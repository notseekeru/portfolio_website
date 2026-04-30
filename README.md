## TechStack

- TypeScript (for frontend and backend development)
- Node.js (for backend application)
- React (for frontend application)

## System Stack

- Cloudflare Tunnel (cloudflared)
- Nginx (for reverse proxying)
- Tailscale (for secure encrypted bridge between Raspberry Pi and local desktop)
- Docker (for containerizing the backend application)

## Website Features

- Single Page Application (SPA) for smooth navigation and fast loading times.
- Hover interactive project and tool overview in the Infrastructure, Projects, Languages, Tools & Framework sections.
- Interactive Mermaid Diagrams for infrastructure and CI/CD pipelines at blogposts.
- Contact form with N8N integration using webhooks and secure headers.

## Testing and Security:

- SSLLabs for testing SSL configuration and security headers.
- To test the SSL configuration and security headers of your website, you can use the following command:

```bash
  curl -I https://portfolio.seekeru.tech
```

Todos:

- Add Section to prefer remote work and you can work from anywhere.
- Add where you're currently located and your timezone.
- Add `Labs` section for a full diagram breakdown of my whole homelab infrastructure, including the Raspberry Pi, Tailscale, Cloudflare Tunnel, and Nginx setup.
- N8N integration for contact form submissions using webhooks and secure headers.
- Dependabot in GitHub for automated dependency updates and security patches.
- implement hsts headers for better security. why? HSTS (HTTP Strict Transport Security) is a security feature that forces web browsers to only communicate with the server over HTTPS, preventing man-in-the-middle attacks and ensuring that all data transmitted between the client and server is encrypted. By implementing HSTS headers, you can enhance the security of your website and protect your users' data from potential threats.
- Implementing a monitoring solution to track the performance and health of the backend application and the overall system.
- Implementing a logging solution to capture and analyze logs from the backend application and the Nginx reverse proxy for troubleshooting and performance optimization.
- Look at how the CNCF (Cloud Native Computing Foundation) handles these things. Compare your Nginx patterns to the Nginx Ingress Controller documentation.
