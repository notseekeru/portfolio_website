export interface ExperienceItem {
    company: string;
    title: string;
    duration: string;
}

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
    experience: ExperienceItem[];
    education: EducationItem[];
    projects: ProjectItem[];
}

const personalData: PersonalData = {
    name: "Stephen Macabulos",
    status: "Available for remote roles and internships",
    title: "Site Reliability | DevOps | Platform | Cloud Engineer",
    location: "Pampanga, Philippines",
    email: "stpmacabulos@gmail.com",
    linkedin: "https://www.linkedin.com/in/stephen-macabulos",
    github: "https://github.com/notseekeru",
    facebook: "https://www.facebook.com/notseekeru",
    instagram: "https://www.instagram.com/notseekeru/",
    x: "https://x.com/notseekeru",
    threads: "https://www.threads.com/@notseekeru",
    bio: "2nd Year Computer Engineering undergraduate who learns by building. I have my projects below to showcase my skills that validates my work I have done and blogs to feature my brain internal reasoning and emotional state on a related project. I Scope my focus on auditing architectural alignment, security, scalability, and isolation with AI delegating syntax and boilerplate to agents. Then I calculate and weigh friction, scope, value, financial risk of my tool and architecture. I judge decisions/approaches based on my present reasoning, feedback and understanding. Currently seeking opportunities where I can contribute and keep growing.",
    profilePicture: "/profile4.png",
    experience: [
        {
            company: "N/A",
            title: "N/A",
            duration: "N/A",
        },
    ],

    education: [
        {
            institution: "Pampanga State University",
            degree: "B.S in Computer Engineering",
            duration: "2025 — 2029",
        },
    ],

    projects: [
        {
            title: "SRE — Observability Stack with LGTM Stack + OTLP Tracing",
            description:
                "Designed a full Loki/Grafana/Tempo/Prometheus + Alloy observability stack with unified OTLP ingestion across logs, metrics and traces. Implemented OpenTelemetry-based distributed tracing, built a Four Golden Signals dashboard, automated Docker log discovery, configured Slack alerting via AlertManager, and validated MTTR/MTTD through chaos engineering experiments (Postgres blackout).",
            techStack: ["Grafana", "Prometheus", "Loki", "Tempo", "Alloy", "OpenTelemetry", "AlertManager", "Docker"],
            favorite: true,
            video: "/project3.webm",
            link: "https://diagram.seekeru.tech",
            github: "https://github.com/notseekeru/diagram_website",
            icon: "SiGrafana",
            blogs: ["observing-the-lab", "sre-steps", "telemetry-madness"],
        },
        {
            title: "Platform — Self-Hosted k3s, ArgoCD GitOps and Edge Hardening",
            description:
                "Runs three live domains (portfolio, diagram and maxterview.seekeru.tech) on a self-hosted k3s cluster behind one Cloudflare Tunnel, reconciled by ArgoCD and bootstrapped by Terraform: ingress-nginx and ArgoCD installed via Helm, a namespace and its secret set created per app, a PostgreSQL 18 StatefulSet on a local-path PVC, GHCR pull secrets, and the Argo root Application applied through the kubectl provider. A separate gitops repo owns everything after that as an app-of-apps: four ArgoCD Applications syncing with prune and selfHeal, a kustomize base with one prod overlay, ingress carrying CSP/COOP/COEP and rate limits plus 300s timeouts tuned for the SSE chat stream, and a PreSync migration Job. Images are multi-stage arm64 builds via QEMU, gated by Trivy CVE scanning in the CD pipeline, with an SSL Labs A+ on the edge. State sits in an R2 S3 backend with a lockfile, secrets are injected from Infisical at plan time, and CI stops at fmt and validate because applies are human-gated by design.",
            techStack: ["Terraform", "k3s", "ArgoCD", "Kubernetes", "Helm", "Kustomize", "Cloudflare Tunnel", "Nginx", "Docker", "Trivy"],
            favorite: true,
            video: "/project2.webm",
            github: "https://github.com/notseekeru/gitops",
            icon: "SiTerraform",
            blogs: ["imposter-syndrome", "the-serverless-trap", "server-security-measures", "cloud-automation-veins"],
        },
        {
            title: "Product Engineering — Maxterview AI Interview Simulator",
            description:
                "Built and shipped an AI interview simulator end to end: FastAPI plus a React/Vite SPA where a candidate creates an interview, answers over SSE, and gets a graded review with per-answer annotations, ten scored dimensions, a verdict and tips. Split the feedback into a grader that reads the transcript and writes prose plus a cheap formatter that emits constrained JSON, so ten dimensions across communication, substance and profile stay gradable without the interviewer grading itself. Added a provider-agnostic entitlement (one subscriptions row, one resolve_tier, PayMongo behind a single module) and Fernet-encrypted bring-your-own-key storage with a last-four hint. Shipped voice as I/O around the turn the app already had instead of a vendor realtime session: Cloudflare Workers AI Whisper for answers and Aura-1 for replies, cached per line and metered inside the free 10,000 neuron daily allocation. Runs on k3s behind ArgoCD with a PreSync migration Job, Trivy-scanned images pinned by tag in a gitops repo, Neon on its direct host because the pooler breaks asyncpg's prepared statements, and a log-only observability pipeline of structlog JSON through Alloy into Loki where every dashboard number is a LogQL aggregate.",
            techStack: ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Neon", "Kubernetes", "ArgoCD", "Terraform", "Cloudflare", "PayMongo"],
            favorite: true,
            video: "/maxterview.mp4",
            link: "https://maxterview.seekeru.tech",
            icon: "SiReact",
        },
        {
            title: "Infrastructure as Code — Ansible Automation & Idempotency",
            description:
                "Transitioned to IaC with modular Ansible roles for security hardening, user management, and Dockerization across RPi5 and cloud nodes. Implemented Ansible Vault for secrets, achieved 100% molecule-tested idempotency, enforced automated CI/CD linting via GitHub Actions, and built self-healing infrastructure using declarative state patterns.",
            techStack: ["Ansible", "Molecule", "Ansible Vault", "GitHub Actions", "Docker"],
            favorite: true,
            video: "/project4.webm",
            github: "https://github.com/notseekeru/ansible",
            icon: "SiAnsible",
            blogs: ["cloud-automation-veins", "server-security-measures"],
        },
        {
            title: "Secrets Management — Infisical as Source of Truth for Every Repo",
            description:
                "One secrets layer for every repo that needs cloud variables, replacing scattered Ansible Vault files, .tfvars and .env files with Infisical Cloud plus its CLI: Terraform providers and the R2 state backend, Ansible playbooks, Docker builds and the Node and FastAPI apps all resolve from one source of truth. Designed the source-of-truth and consumer folder structure with dynamic references, then built per-environment inheritance where a staging environment inherited prod values as per-key references and overrode only the five that must differ (database, identity and payment keys), with plan-time guards that refused the other environment database endpoint in both directions, because an inherited value would otherwise point staging migrations at the production database. Staging itself was later dropped as unearned cost, one environment and no users did not justify a second namespace, secret set and quota consumer, and the exact rebuild path is documented. Still the injection path for Terraform via infisical run, and reusable across Ansible, Docker and Node.js apps through the same CLI.",
            techStack: ["Infisical", "Terraform", "Ansible", "Docker", "Node.js"],
            image: "/project9.png",
            icon: "FaLock",
        },
        {
            title: "AWS — 3-Tier Terraform Stack on Free-Tier Rails",
            description:
                "Provisioned a 3-tier AWS stack in inline HCL with no public VPC modules: Cloudflare CNAME → ALB → ASG (2× t4g.micro, AL2023 arm64 via SSM AMI param) → private single-AZ RDS PostgreSQL, plus a private S3 bucket served through CloudFront with OAC and an ACM certificate DNS-validated through Cloudflare. Added billing rails — a $1 zero-spend tripwire budget and a credit-cap budget firing at 95% actual / 90% forecast — wired to one SNS topic with a CloudWatch CPU alarm, so `make destroy` plus aws-nuke allowlisting keeps monthly spend at zero. Debugged a credential namespace collision where the Cloudflare R2 S3-compatible state backend and the real AWS provider both consumed the native AWS_ACCESS_KEY_ID, resolved by partitioning secrets into TF_VAR_R2_* and pinning the provider's S3 endpoint back to its region. Reached 39 resources with a drift-free terraform plan across repeated destroy and re-apply cycles.",
            techStack: ["Terraform", "AWS", "ALB", "ASG", "RDS", "CloudFront", "S3", "Cloudflare R2", "Infisical"],
            favorite: true,
            status: "in progress",
            github: "https://github.com/notseekeru/terraform",
            icon: "FaAws",
            blogs: ["aws-on-a-budget"],
        },
        {
            title: "Environment — Homelab Services, Virtualization and NixOS",
            description:
                "Runs my daily driver and my home services from config. One NixOS flake with a shared base and per-host deltas for desktop, laptop and server outputs, deployed on the laptop as my daily driver: Flakes, Home-Manager and direnv, a declarative tmux sessionizer, Neovim with LSP, and atomic rollback-capable rebuilds via nixos-rebuild. The Raspberry Pi 5 homelab runs Pi-hole DNS, Plex, Portainer and game servers under UFW, SSH key-only access and a Tailscale-only overlay, with network segmentation and automated apt updates. Guest VMs on Hyper-V and VMware Workstation use NAT, Bridged and Host-only modes, which is where I debug VM-to-host and VM-to-LAN reachability along with in-network DHCP and DNS resolution.",
            techStack: ["NixOS", "Flakes", "Home-Manager", "Raspberry Pi", "Docker", "Tailscale", "Pi-hole", "UFW", "Hyper-V", "VMware"],
            favorite: true,
            video: "/project6.webm",
            github: "https://github.com/notseekeru/nixos-config",
            icon: "SiNixos",
            blogs: ["declarative-identity", "server-security-measures", "observing-the-lab"],
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
            title: "Java OOP Project featuring Production Patterns — Team Lead",
            description:
                "Led a team of 5 Members to compose Software Development and Management Collaboration through effective communication and task delegation. Architected a JavaFX application with layered MVC+DAO+Service architecture, Github Flow, GHA CI/CD pipelines, Flyway schema migrations, Spotbugs/Spotless linting, JUnit integration tests, and JaCoCo code coverage. Documented Informal SOPs and ADRs, and automated Mermaid diagram generation via GitHub Actions for documentation.",
            techStack: ["Java", "JavaFX", "Maven", "GitHub Actions", "Flyway", "JUnit", "Docker", "Mermaid"],
            video: "/project5.webm",
            github: "https://github.com/notseekeru/gui-oop-finals",
            icon: "FaJava",
        },
        {
            title: "Systems Programming — HTTP Server in C with Raw Sockets",
            description:
                "Rebuilt an HTTP server from the sockets up in C with no framework and no HTTP library: socket, bind on INADDR_ANY:8080, listen, then an accept loop that serves each client with one send and closes, so the response is body only. That is why the Makefile's get target uses curl --http0.9, because a conventional client rejects a reply that has no status line or headers. The whole thing is one translation unit, main.c includes its own kv_helper.c, and kv_helper is where the memory work lives: a KVPair allocated on the heap with a NULL check after every allocation and a partial-free path, so a failed value allocation returns the key allocation instead of leaking it. The rest of the pass was correctness under load: one send for the full message, sockaddr_in zeroed before bind, error handling on every syscall, and a loop that keeps serving after a failed accept. What I actually took from it is knowing which bytes are mine, which is the only reason the project exists.",
            techStack: ["C", "Sockets", "Linux", "Make", "curl"],
            status: "in progress",
            github: "https://github.com/notseekeru/custom-http-c",
            icon: "SiC",
        },
        {
            title: "Automation — Self-Hosted n8n Behind Cloudflare Zero Trust",
            description:
                "Ran n8n self-hosted behind a Cloudflared tunnel and Nginx reverse proxy, exposing webhooks only through Cloudflare Zero Trust. Built an AI Gmail labeler as the first pipeline: trigger, transformation nodes, then an agent call for classification, so inbox triage runs deterministically instead of by hand. Hardened after a Docker Scout audit flagged CVSS 9.8 in n8n and Cloudflared, then pinned every lab image to a semantic version to stop state drift.",
            techStack: ["n8n", "Docker", "Nginx", "Cloudflare Zero Trust", "Cloudflared"],
            icon: "SiN8N",
            blogs: ["your-workflow-might-be-obsolete"],
        },
    ],
};

export default personalData;
