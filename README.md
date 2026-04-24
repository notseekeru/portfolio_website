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

Lingos

- Demitelarized zone: A network architecture where the frontend and backend services are separated into different zones, enhancing security and scalability.
- Network hops: The number of intermediary steps or devices that data must pass through to reach its destination. In this context, it refers to the path from the user's browser to the backend application.
- Network segmentation: The practice of dividing a network into smaller, isolated segments to improve security and performance. In this architecture, different segments are used for the tunnel edge, gateway, and application services.
- Cross-origin resource sharing (CORS): A security feature implemented by web browsers to restrict web pages from making requests to a different domain than the one that served the web page. In this architecture, CORS is configured to allow communication between the frontend and backend services.
- Xss (Cross-site scripting): A security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users. In this architecture, security measures are implemented to prevent XSS attacks.
- Reverse proxy: A server that sits in front of web servers and forwards client requests to those web servers. In this architecture, Nginx is used as a reverse proxy to route traffic to the appropriate services.
- Encrypted bridge: A secure communication channel that encrypts data as it travels between two points. In this architecture, Tailscale is used to create an encrypted bridge between the Raspberry Pi and the local desktop.
- Containerization: The process of packaging an application and its dependencies into a container, allowing for consistent deployment across different environments. In this architecture, Docker is used to containerize the backend application.
- Cloudflare Tunnel: A service that allows you to securely expose your local server to the internet without opening ports on your router. In this architecture, cloudflared is used to create a secure tunnel from the Raspberry Pi to the Cloudflare edge.

Todos:

- N8N integration for contact form submissions using webhooks and secure headers.
- Implementing security measures to prevent XSS attacks and ensure secure communication between frontend and backend services.
- Dependabot in GitHub for automated dependency updates and security patches.
