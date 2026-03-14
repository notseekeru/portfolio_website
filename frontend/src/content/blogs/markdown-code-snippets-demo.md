---
title: Markdown Code Snippets Demo
date: 2026-03-14
description: Example blog post with multiple fenced code blocks to test Prism rendering in BlogPost.
image: /blog/code-snippets-demo.png
---

# Markdown Code Snippets Demo

This post exists to verify that fenced code blocks render correctly with syntax highlighting.

## JavaScript

```js
function greet(name) {
  return `Hello, ${name}!`
}

const message = greet('Seeker')
console.log(message)
```

## TypeScript

```ts
type Project = {
  id: number
  name: string
  stack: string[]
}

const portfolio: Project = {
  id: 1,
  name: 'portfolio_website',
  stack: ['vite', 'react', 'tailwind']
}
```

## Dockerfile

```dockerfile
FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev", "--", "--host"]
```

## Docker Compose (YAML)

```yaml
services:
  frontend:
    build:
      context: ./frontend
      target: dev
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
```

## Compose Alias Fence

```compose
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
```

## Bash

```bash
docker compose -p portfolio-dev -f compose.yml -f compose.dev.yml up -d
```

## JSON

```json
{
  "feature": "markdown-code-highlight",
  "enabled": true,
  "languages": ["js", "ts", "dockerfile", "yaml", "compose", "bash", "json"]
}
```

## JSX

```jsx
export default function Badge({ label }) {
  return <span className="rounded-md px-2 py-1 text-xs bg-zinc-800">{label}</span>
}
```

## Plain Code (No Language)

```
No language tag here.
This should still render as a code block without syntax colors.
```

## Unsupported Language Fallback

```brainfuck
++>+++++[<+>-]++++++++[<++++++>-]<.
```

Inline code sample: use `parseMarkdown` before rendering content.
