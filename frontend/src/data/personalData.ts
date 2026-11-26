export interface EducationItem {
    institution: string;
    degree: string;
    duration: string;
}

export interface ProjectItem {
    title: string;
    description: string;
    techStack: string[];
    link?: string;
    image?: string;
    video?: string;
    favorite?: boolean;
    status?: string;
    github?: string;
    icon?: string;
    blogs?: string[];
}

export interface PersonalData {
    name: string;
    status: string;
    title: string;
    location: string;
    email: string;
    linkedin: string;
    github: string;
    facebook: string;
    instagram: string;
    x: string;
    threads: string;
    bio: string;
    profilePicture: string;
    education: EducationItem[];
    projects: ProjectItem[];
}

const personalData: PersonalData = {
    name: "Stephen Macabulos",
    status: "Available for remote roles and internships",
    title: "Aspiring - Site Reliability | DevOps | Platform | Cloud Engineer",
    location: "Pampanga, Philippines",
    email: "stpmacabulos@gmail.com",
    linkedin: "https://www.linkedin.com/in/stephen-macabulos",
    github: "https://github.com/notseekeru",
    facebook: "https://www.facebook.com/notseekeru",
    instagram: "https://www.instagram.com/notseekeru/",
    x: "https://x.com/notseekeru",
    threads: "https://www.threads.com/@notseekeru",
    bio: "2nd Year Computer Engineering undergraduate who learns by building. I Scope my focus on auditing architectural alignment, security, scalability, and isolation. I calculate and weigh friction, scope, value, financial risk of my tool and architecture. I judge decisions/approaches based on my present reasoning, feedback and understanding. Currently seeking opportunities where I can contribute and keep growing.",
    profilePicture: "/profile4.png",
    education: [
        {
            institution: "Pampanga State University",
            degree: "B.S in Computer Engineering",
            duration: "2025 — 2029",
        },
    ],

    projects: [
        {
            title: "Platform — Self-Hosted Web Delivery on RPi5",
            description:
                "Designed and deployed a self-hosted websites on RPi5 with a hardened Cloudflared → Nginx proxy-chain architecture featuring network segmentation, CSP/COOP/COEP security headers, multi-stage Docker builds, QEMU multi-arch (ARM64) support, Trivy CVE scanning in CD pipeline, and an SSL Labs A+ rating.",
            techStack: ["React", "TypeScript", "Vite", "Node.js", "Express", "Nginx", "Docker", "Cloudflare", "Trivy"],
            favorite: true,
            video: "/project1.webm",
            icon: "SiReact",
            blogs: ["imposter-syndrome", "the-serverless-trap", "server-security-measures"],
        },
        {
            title: "Cloud Native  — Terraform & Kubernetes + ArgoCD GitOps",
            description:
                "Provisioned DigitalOcean infrastructure with Terraform using modular .tf files and secure variable management, integrated dynamic Ansible inventories, deployed a 3-node Kubernetes cluster with ArgoCD GitOps, and hardened containers with tmpfs/readonly root filesystems. Extended the same GitOps pattern to a self-hosted k3s cluster with two environments rendered from one kustomize base (separate namespace, secret and managed database per env), both reconciled by ArgoCD.",
            techStack: ["Terraform", "DigitalOcean", "Kubernetes", "ArgoCD", "Ansible", "GitHub Actions"],
            favorite: true,
            video: "/project2.webm",
            github: "https://github.com/notseekeru/terraform",
            icon: "SiTerraform",
            blogs: ["cloud-automation-veins"],
        },
        {
            title: "SRE — Local Observability with LGTM Stack + OTLP Tracing",
            description:
                "Designed a full Loki/Grafana/Tempo/Prometheus + Alloy observability stack with unified OTLP ingestion across logs, metrics and traces. Implemented OpenTelemetry-based distributed tracing, built a Four Golden Signals dashboard, automated Docker log discovery, configured Slack alerting via AlertManager, and validated MTTR/MTTD through chaos engineering experiments (Postgres blackout).",
            techStack: ["Grafana", "Prometheus", "Loki", "Tempo", "Alloy", "OpenTelemetry", "AlertManager", "Docker"],
            favorite: true,
            video: "/project3.webm",
            github: "https://github.com/notseekeru/diagram_website",
            icon: "SiGrafana",
            blogs: ["observing-the-lab", "sre-steps", "telemetry-madness"],
        },
        {
            title: "SRE — Load Testing, Application Benchmarking, and Improving System Design (k6 on k3s)",
            description:
                "Load tested the deployment the SRE work had only been watching, because a dashboard nobody has proven under load is a guess. Built a sweep with gates instead of opinions, moved the boundary twice by fixing round trips and the pool, and shipped the numbers I could defend next to the ones I could not.",
            techStack: ["k6", "Grafana", "Prometheus", "OpenTelemetry", "Kubernetes", "k3s", "Neon", "Tailscale", "Python"],
            blogs: ["sre-upgrade"],
        },
        {
            title: "Infrastructure as Code — Ansible Automation & Idempotency",
            description: "Transitioned to IaC with modular Ansible roles for security hardening, user management, and Dockerization across RPi5 and cloud nodes. Implemented Ansible Vault for secrets, achieved molecule-tested idempotency, enforced automated CI/CD linting via GitHub Actions.",
            techStack: ["Ansible", "Molecule", "Ansible Vault", "GitHub Actions", "Docker"],
            favorite: true,
            video: "/project4.webm",
            github: "https://github.com/notseekeru/ansible",
            icon: "SiAnsible",
            blogs: ["cloud-automation-veins", "server-security-measures"],
        },
        {
            title: "Java OOP Project featuring Production Patterns — Team Lead",
            description:
                "Led a team of 5 Members to compose Software Development and Management Collaboration through effective communication and task delegation. Architected a JavaFX application with layered MVC+DAO+Service architecture, Github Flow, GHA CI/CD pipelines, Flyway schema migrations, Spotbugs/Spotless linting, JUnit integration tests, and JaCoCo code coverage. Documented Informal SOPs and ADRs, and automated Mermaid diagram generation via GitHub Actions for documentation.",
            techStack: ["Java", "JavaFX", "Maven", "GitHub Actions", "Flyway", "JUnit", "Docker", "Mermaid"],
            video: "/project5.webm",
            github: "https://github.com/notseekeru/gui-oop-finals",
            icon: "FaJava",
        },
        {
            title: "Homelab — Services and Virtualization",
            description:
                "Operate a Raspberry Pi 5-based homelab running Pi-hole DNS, Plex media server, Portainer container management, game servers, etc. Applied Linux hardening (UFW, SSH key-only, Tailscale overlay), automated apt updates, and enforced Tailscale-only access across all services with network segmentation. Run guest VMs on both Hyper-V and VMware Workstation, using VMware NAT/Bridged/Host-only modes and debugging VM-to-host and VM-to-LAN reachability plus in-network DHCP/DNS resolution.",
            techStack: ["Raspberry Pi", "Docker", "Tailscale", "Pi-hole", "Grafana", "Hyper-V", "VMware"],
            favorite: true,
            video: "/project6.webm",
            icon: "SiRaspberrypi",
            blogs: ["server-security-measures", "observing-the-lab"],
        },
        {
            title: "Raw L7 TCP/HTTP 1.1 Engine & L7 Reverse Proxy + Load Balancer",
            description: "Built an HTTP/1.1 server + L4 Reverse Proxy + Load Balancer from scratch using Go's net package — no frameworks, just raw net sockets, and bufio.Reader. Serves GET/POST with dynamic Content-Length, SetDeadline timeouts, and proper 200/400/404 http responses.",
            techStack: ["Go", "TCP/IP", "HTTP/1.1"],
            favorite: true,
            image: "/project7.png",
            github: "https://github.com/notseekeru/l4-l7-rproxy-lb-http-go",
            icon: "FaGolang",
            blogs: ["digging-the-wire"],
        },
        {
            title: "NixOS Workflow — Flakes + Home-Manager + Tmux + Neovim",
            description:
                "Transitioned to a fully declarative NixOS stack with Flakes, Home-Manager, and direnv for reproducible multi-node configs. Modularized host-specific configs so every machine inherits the same baseline. Declarative tmux-init script and Neovim configuration. Achieved atomic, rollback-capable system rebuilds via nixos-rebuild.",
            techStack: ["NixOS", "Flakes", "Home-Manager", "direnv", "neovim", "tmux"],
            favorite: true,
            image: "/project8.png",
            github: "https://github.com/notseekeru/nixos-config",
            icon: "SiNixos",
            blogs: ["declarative-identity"],
        },
        {
            title: "Centralized Secrets Management with Infisical Cloud + CLI",
            description: "Migrated from fragmented secret storage (Ansible Vault, .tfvars, .env) to a single source of truth using Infisical Cloud. Designed source-of-truth and consumer folder structure with dynamic secret references, and integrated it with Terraform via infisical run for injection into apply.",
            techStack: ["Infisical", "Terraform", "Ansible"],
            image: "/project9.png",
            icon: "FaLock",
        },
        {
            title: "AWS Serverless on One Box",
            description:
                "Moved a real app onto AWS serverless and Event Driven Design to learn how it works. One t4g.micro runs nginx, the Cloudflare tunnel and the NAT, four Lambdas run the app and the jobs behind a Function URL, background work goes through SQS with a dead letter queue, and secrets moved from Secrets Manager and KMS to SSM SecureString with no automatic rotation. Also frontend pulls from S3.",
            techStack: ["Terraform", "AWS", "Lambda", "SQS", "SSM", "RDS", "Cloudflare", "GitHub Actions", "Infisical"],
            favorite: true,
            status: "live",
            github: "https://github.com/notseekeru/terraform",
            icon: "FaAws",
            blogs: ["moving-my-app-to-aws-serverless"],
        },
        {
            title: "Product — Maxterview AI Interview Simulator",
            description:
                "Shipped an AI interview simulator built with Hono on Node behind a React/Vite SPA where a candidate creates an interview, answers over SSE. Split the feedback into a grader that reads the transcript and writes prose plus a cheap formatter that emits constrained JSON. Telemetry leaves the pod as pino JSON, OTLP metrics and traces through one Alloy receiver into Grafana Cloud, the trace id in every log line and no telemetry write credential in the app. Payments are one subscriptions row, one resolve_tier and PayMongo behind a single module.",
            techStack: ["Node.js", "Hono", "React", "TypeScript", "PostgreSQL", "Neon", "Kubernetes", "ArgoCD", "Terraform", "Cloudflare", "PayMongo"],
            favorite: true,
            video: "/maxterview.mp4",
            link: "https://maxterview.seekeru.tech",
            icon: "SiReact",
        },
        // {
        //     title: "Systems Programming — HTTP Server in C with Raw Sockets",
        //     description:
        //         "Rebuiling an HTTP server from the sockets up in C with no framework and no HTTP library: socket, bind on INADDR_ANY:8080, listen, then an accept loop that serves each client with one send and closes, so the response is body only. That is why the Makefile's get target uses curl --http0.9, because a conventional client rejects a reply that has no status line or headers. The whole thing is one translation unit, main.c includes its own kv_helper.c, and kv_helper is where the memory work lives: a KVPair allocated on the heap with a NULL check after every allocation and a partial-free path, so a failed value allocation returns the key allocation instead of leaking it. The rest of the pass was correctness under load: one send for the full message, sockaddr_in zeroed before bind, error handling on every syscall, and a loop that keeps serving after a failed accept. What I actually took from it is knowing how low level systems or computers work internally and verify myself.",
        //     techStack: ["C", "Sockets", "Linux", "Make", "curl"],
        //     github: "https://github.com/notseekeru/custom-http-c",
        //     icon: "SiC",
        //     status: "in progress",
        // },
    ],
};

export default personalData;
