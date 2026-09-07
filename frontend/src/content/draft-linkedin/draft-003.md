The world is piling on abstraction, but I dig deeper.

Two weeks ago, I built an L7 HTTP server and L4 Load Balancer from scratch using Go.

No `net/http`. No frameworks. Just `net`, `bufio`, and other packages.

Why? Because I got tired of not knowing what actually happens when I send a request.

What I built:

Layer 7 (HTTP/1.1 Engine):
- Request line parser (method, path, version)
- Header parser (15+ headers, including massive Cookie JWTs)
- Query parameter parser (/api?age=18&name=mark)
- POST body reader with dynamic Content-Length
- Static file server with MIME type mapping
- Path traversal security (tested 8 attack vectors)
- RFC-compliant response generator (Date, Server, Content-Length, Connection)

Layer 4 (TCP Reverse Proxy + Load Balancer):
- Raw byte forwarder using io.Copy
- Round‑robin load balancing across multiple backends
- Bidirectional traffic flow with concurrent goroutines

The hard lessons I learned:

1. bufio.Reader is a stream, not an array. I tried to read the same line twice. It moved its internal pointer automatically. I spent 30 minutes confused. Then I accepted it and moved on.

2. A hidden \r\n broke strconv.Atoi(). I didn't trim it before converting to int. Spent 2 hours debugging. The error handling I skipped because I was lazy cost me 2 hours. Never again.

3. L4 proxies are deaf. When my HTTP engine sent Connection: keep-alive, my proxy hung forever waiting for the backend to close the socket. The only thing that saved it was the 5‑second timeout I had set. That's why L7 proxies exist—they parse Content-Length to know when a response ends.

4. Connection: close vs keep-alive isn't just a header. It's a contract that forces you to think about state machines, connection lifecycles, and timeouts.

5. fmt.Printf("%q", line) reveals invisible characters. Saved me more times than I can count.

The result:
A fully functional HTTP/1.1 static file server, fronted by a TCP reverse proxy and round‑robin load balancer.

No magic. No abstractions. Just bytes.
