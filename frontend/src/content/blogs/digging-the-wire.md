---
title: Digging the Wire
date: 2026-7-30
description: I got tired of everyone hiding behind abstractions, so I built a TCP reverse proxy and an HTTP/1.1 engine from scratch in Go with nothing but the standard library. No net/http, no frameworks.
favorite: true
github: https://github.com/notseekeru/l4-l7-rproxy-lb-http-go
---

# Summary

A networking stack I built by hand — the project I'm most proud of. Started June 30, 2026, it's a monorepo of components written from scratch in Go with nothing but the standard library. The core is a minimal HTTP/1.1 engine hand-rolled on `net.Listen`, `net.Accept`, and `net.Conn`; a Layer 4 reverse proxy/load balancer sits in front of it. No frameworks, no `net/http`, no third-party deps. It's a learning repo, not something I'd run in prod — that was never the goal. The goal was answering whether I actually understood the network stack, or had just been polite to it my whole career. It turned out I could build it, byte by byte.

---

## The Everywhere Abstraction

Every project I'd shipped ran on someone else's invisible rails — `net/http`, Vercel, Cloudflare tunnels, Nginx as a black-box gateway. They worked, and I never resented them for it. But underneath sat a quiet discomfort: I could describe what a load balancer did in a sentence, but if you pressed me on what happened to a single byte crossing a connection, I'd have struggled. The abstractions weren't wrong — they were just hiding, and I'd never once looked.

So instead of climbing higher up the stack, I decided to dig down. On June 30, 2026, I opened the repo and started building it by hand.

## Why Go, and Why Nothing Else

Go's standard library hands you the raw socket primitives and gets out of the way. `net.Listen`, `net.Accept`, `net.Conn`, `io.Copy` — every byte crosses my own code before the wire, no `ResponseWriter` to hide the parsing. Go was the thinnest curtain I could find.

My one hard rule: **standard library only**. No routing framework, no middleware, no HTTP/2, no connection pooling. Deliberate omissions, so I could understand the layer beneath them.

The architecture was simple. A client opens a TCP connection to the Layer 4 balancer on `:9000`, which round-robins it to one of two backend HTTP engines on `:8080` and `:8081`, then just relays bytes both ways. Protocol-agnostic by design — it balances raw TCP streams, not HTTP requests, because it has no business knowing what HTTP is.

![Paper architecture of the proxy. curl or a browser opens TCP to the Layer 4 proxy on :9000, which accepts, round-robins with counter % 2, and relays bytes with io.Copy to one of two hand-rolled HTTP/1.1 engines on :8080 and :8081. Each engine runs a per-connection goroutine with a 5 second deadline and keep-alive loop, buffers the request line, headers and query with bufio, then writes the response.](/digging-the-wire.png)

That diagram is the whole project in one picture — every box something I'd wire together by hand. For the first time a load balancer wasn't a mystery box on a slide; it was a shape I could see.

## Writing an HTTP Engine Without `net/http`

The L7 engine was the heart — a raw HTTP/1.1 server on `net.Listen`/`net.Accept`/`net.Conn`: per-connection goroutines, a keep-alive request loop, `bufio`-buffered parsing. No framework to validate anything, so I had to decide what malformed meant.

- Raw TCP listener with per-connection goroutines and a 5-second deadline
- Keep-alive request loop with buffered parsing
- Request-line / header / query-string parsing with validation
- `GET`/`POST` only (`405` otherwise); HTTP/1.1 only (`400` otherwise)
- Static file serving with MIME detection and directory-traversal protection
- Hand-built response builder
- POST bodies capped at ~10 MB via `io.LimitReader`

The parsing was the unglamorous part I'd always taken for granted. The request line splits on spaces and must have exactly three parts, `HTTP/1.1` in the third slot, and only `GET` or `POST`. The query string gets cut at `?`, split on `&`, validated, dumped into a map. Headers follow, keyed by name.

```go
// l7-http-engine — the request line, untangled by hand
requestLine, err := reader.ReadString('\n')
requestLine = strings.TrimRight(requestLine, "\r\n")
requestParts := strings.Split(requestLine, " ")

if len(requestParts) != 3 {
    HTTPMessage(conn, "400", "Bad Request", "Too many")
    return
}
if requestParts[2] != "HTTP/1.1" {
    HTTPMessage(conn, "400", "Bad Request", "Only HTTP/1.1 supported")
    return
}
if requestParts[0] != "GET" && requestParts[0] != "POST" {
    HTTPMessage(conn, "405", "Method Not Allowed", "Unsupported HTTP Method")
    return
}
```

The response was just as naked — a hand-assembled string with a dynamic `Content-Length`, signed at the bottom with `Server: GoLang NixOS TCP/HTTP Engine`. Every byte crossed my own code before the socket.

```go
// l7-http-engine — what an HTTP response looks like when you write it yourself
serverResponse := "HTTP/1.1 " + statusCode + " " + statusPhrase + "\r\n" +
    "Date: " + time.Now().UTC().Format(time.RFC1123) + "\r\n" +
    "Server: " + "GoLang NixOS TCP/HTTP Engine" + "\r\n" +
    "Content-Length: " + contentLength + "\r\n" +
    "Content-Type: " + contentType + "\r\n" +
    "Connection: " + "keep-alive" + "\r\n" +
    "\r\n" +
    body

myConnection.Write([]byte(serverResponse))
```

## The Case of the Vanishing POST Body

The bug that taught me the most starts with that `io.LimitReader` bullet. I capped POST bodies at ~10 MB and was verifying it with `curl` — a big body, then a normal one. The big one got rejected as designed. Then I fired the small one again and its body came back truncated. Half a JSON body, then nothing. Same spot every time — not a race, structural.

The trap: I parsed the request line and headers through a `bufio.Reader` wrapped around the raw `net.Conn` — the same shared, buffered reader for the whole connection. `bufio` doesn't read byte-by-byte; it pulls big chunks into its internal buffer and hands them out piecemeal. So by the time I'd read the headers, the reader had very likely already pre-fetched a chunk of the POST body into that buffer — counted as "read" from the socket's view, not yet consumed by my code.

And there I'd made the mistake. When I capped the body, my first instinct was to wrap the limit around the raw socket:

```go
// l7-http-engine — the naive cap, and where the bytes went to die
body, _ := io.ReadAll(io.LimitReader(conn, maxBody+1))
```

`io.LimitReader(conn, ...)` reads straight off the socket, _not_ through my `bufio.Reader`. The bytes already slurped into the buffer were orphaned — my code could never reach that cache again. The truncation wasn't data lost on the network; it was me throwing away bytes I'd already received, because I'd put the cap on the wrong side of the buffer.

The fix was one variable. Keep the limit on the same reader that owns those buffered bytes:

```go
// l7-http-engine — the cap, chained onto the buffer that owns the bytes
body, _ := io.ReadAll(io.LimitReader(reader, maxBody+1))
```

`net/http` hides this seam so completely I'd never have known it existed — which is exactly why I'd never have learned it if I'd kept using it. The abstraction wasn't protecting me from this bug; it was protecting me from the _understanding_ that the bug exists. This gotcha only bites when you build the whole connection by hand, and that's a big part of why I did.

## A Load Balancer I Added Afterwards

The Layer 4 component came after the engine — it let me look at what I'd built from the outside. It listens on `:9000`, accepts connections in a loop, and round-robins each one across the two backends. The work I'd been dreading for years turned out to be two lines:

```go
// l4-rproxy-lb — minimal busy loop, sockets, and a round-robin pointer
backend := backends[next%len(backends)]
next++

// client -> backend
go func() {
    _, _ = io.Copy(backend, client)
    _ = backend.CloseWrite()
}()
// backend -> client
_, _ = io.Copy(client, backend)
```

Deceptively short, but that's the door opening. A reverse proxy at this layer isn't interpreting anything — it's a mirror. It holds the connection open in both directions and lets bytes flow; when one side hangs up, it closes the write on the other so the conversation ends cleanly.

Then came the moment I'd been digging for: `curl localhost:9000` round-robin'd into the engine I'd written on `:8080` and relayed a real HTTP response back through a connection I'd wired by hand. Protocol-agnostic by construction — it would happily balance raw Telnet or a binary stream. That's when I internalized the difference between balancing connections and balancing requests, and why the "L4" actually meant something.

## The Honest Rule About AI

After two projects where I leaned hard on AI and paid for it with systems I didn't fully understand, I set a stricter boundary this time. I wrote the core logic and conventions entirely myself. AI was the assistant, not the author: syntax, boilerplate, and a code-review/critique tool so I could understand the systems better. I hand-picked its advice and investigated its edge cases myself rather than accepting fixes wholesale.

But I also learned AI can be confidently wrong. On the path-traversal surface, the AI kept insisting my code had a vulnerability. My defense was a containment check — building the full path and asserting it stayed under the working directory:

```go
// l7-http-engine — the directory-traversal guard the AI insisted was broken
fullPath := filepath.Join(cwd, filePath)
basePrefix := cwd + string(filepath.Separator)

if !strings.HasPrefix(fullPath, basePrefix) && fullPath != cwd {
    log.Println("Error: File path is outside the allowed directory")
    return
}
```

I didn't think it was broken, so I stopped arguing and did the only thing that settles technical disagreements: I wrote a test.

```bash
./path_traversal_test.sh   # directory-traversal and injection attempts
```

It rejected traversal and injection attempts cleanly, and when I fed the results back, the AI admitted it was wrong. My code wasn't broken — its confidence was. That's the whole rule in practice: let AI critique and generate, but keep the ultimate authority, and verify its claims with your own tests. Maybe I've still missed something — a real possibility — but the behavior is verified by my tests, not by an AI's confidence. That distinction mattered more than shipping a perfectly secure server.

# Conclusion

Everyone is hiding on abstractions these days — it's fast, reasonable, and usually the right call. But the most valuable thing you can do is sometimes refuse to fit in and dig one layer down, just to see. This project was my dig: a learning repo, not prod, but I understand it byte by byte — and that understanding is worth more than any framework could have handed me.

The goal wasn't to build something better than the tools that exist — it was to build something I couldn't hide behind. The next time someone hands me a perfectly abstracted tool, I'll be the one who knows what's actually underneath it. All I had to do was dig — and I'm proud I did.

---
