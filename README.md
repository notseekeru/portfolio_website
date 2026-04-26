Network Flow

Cloudflare Tunnel (cloudflared) -> Master Nginx (reverse proxy) -> Slave Nginx (serving frontend) + Backend API (Node.js application)

TechStack

- TypeScript (for frontend and backend development)
- Node.js (for backend application)
- React (for frontend application)

System Stack

- Cloudflare Tunnel (cloudflared)
- Nginx (for reverse proxying)
- Tailscale (for secure encrypted bridge between Raspberry Pi and local desktop)
- Docker (for containerizing the backend application)
- Raspberry Pi (as the gateway device)
- Local Desktop (running the frontend and backend applications)
- Internal networking (for communication between containers and services)

Curl commands:

- To test the backend API endpoint:

  ```bash
    curl -I https://portfolio.seekeru.tech
  ```

Todos:

- N8N integration for contact form submissions using webhooks and secure headers.
- Implementing security measures to prevent XSS attacks and ensure secure communication between frontend and backend services.
- Dependabot in GitHub for automated dependency updates and security patches.
- implement hsts headers for better security. why? HSTS (HTTP Strict Transport Security) is a security feature that forces web browsers to only communicate with the server over HTTPS, preventing man-in-the-middle attacks and ensuring that all data transmitted between the client and server is encrypted. By implementing HSTS headers, you can enhance the security of your website and protect your users' data from potential threats.
- ssllabs for testing ssl configuration and security headers.
- Implementing a monitoring solution to track the performance and health of the backend application and the overall system.
- uptime kuma for monitoring system uptime and performance that sends to my Slack channel.
- Implementing a logging solution to capture and analyze logs from the backend application and the Nginx reverse proxy for troubleshooting and performance optimization.
- look at how the CNCF (Cloud Native Computing Foundation) handles these things. Compare your Nginx patterns to the Nginx Ingress Controller documentation.
