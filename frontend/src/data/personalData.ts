export interface ExperienceItem {
    company: string;
    title: string;
    duration: string;
    responsibilities: string;
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
            responsibilities: "N/A",
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
            title: "Website Self-Hosting Security Pipeline Infrastructure",
            description:
                "Designed and deployed a self-hosted websites on RPi5 with a hardened Cloudflared → Nginx proxy-chain architecture featuring network segmentation, CSP/COOP/COEP security headers, multi-stage Docker builds, QEMU multi-arch (ARM64) support, Trivy CVE scanning in CD pipeline, and an SSL Labs A+ rating.",
            techStack: ["React", "TypeScript", "Vite", "Node.js", "Express", "Nginx", "Docker", "Cloudflare", "Trivy"],
            favorite: true,
            video: "/project1.webm",
            icon: "SiReact",
            blogs: ["imposter-syndrome", "the-serverless-trap", "server-security-measures"],
        },
        {
            title: "Cloud Infrastructure  — Terraform & Kubernetes + ArgoCD GitOps",
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
            title: "SRE — Observability Stack with LGTM Stack + OTLP Tracing",
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
            title: "Java OOP Project featuring Production Patterns — Team Lead",
            description:
                "Led a team of 5 Members to compose Software Development and Management Collaboration through effective communication and task delegation. Architected a JavaFX application with layered MVC+DAO+Service architecture, Github Flow, GHA CI/CD pipelines, Flyway schema migrations, Spotbugs/Spotless linting, JUnit integration tests, and JaCoCo code coverage. Documented Informal SOPs and ADRs, and automated Mermaid diagram generation via GitHub Actions for documentation.",
            techStack: ["Java", "JavaFX", "Maven", "GitHub Actions", "Flyway", "JUnit", "Docker", "Mermaid"],
            video: "/project5.webm",
            github: "https://github.com/notseekeru/gui-oop-finals",
            icon: "FaJava",
        },
        {
            title: "Self-Hosted Homelab Infrastructure for Linux, Services and Networking",
            description:
                "Operate a Raspberry Pi 5-based homelab running Pi-hole DNS, Plex media server, Portainer container management, game servers, etc. Applied Linux hardening (UFW, SSH key-only, Tailscale overlay), automated apt updates, and enforced Tailscale-only access across all services with network segmentation.",
            techStack: ["Raspberry Pi", "Docker", "Tailscale", "Pi-hole", "Grafana"],
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
            title: "NixOS Declarative Workflow — Flakes + Home-Manager + Neovim",
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
            description:
                "Migrated from fragmented secret storage (Ansible Vault, .tfvars, .env) to a single source of truth using Infisical Cloud. Designed source-of-truth and consumer folder structure with dynamic secret references, then extended it into per-environment inheritance: a staging environment that inherits prod's values as per-key references while overriding only the five that must differ (database, identity and payment keys). Integrated with Terraform via infisical run for injection into apply, and added plan-time guards in both directions that refuse the other environment's database endpoint, because an inherited value would otherwise point staging's migrations at the production database. Also can be applied to various projects such as Ansible, Docker, and Node.js apps via the Infisical CLI.",
            techStack: ["Infisical", "Terraform", "Ansible"],
            image: "/project9.png",
            icon: "FaLock",
        },
        {
            title: "AWS — 3-Tier Terraform Stack on Free-Tier Rails",
            description:
                "Provisioned a 3-tier AWS stack in inline HCL with no public VPC modules: Cloudflare CNAME → ALB → ASG (2× t4g.micro, AL2023 arm64 via SSM AMI param) → private single-AZ RDS PostgreSQL, plus a private S3 bucket served through CloudFront with OAC and an ACM certificate DNS-validated through Cloudflare. Added billing rails — a $1 zero-spend tripwire budget and a credit-cap budget firing at 95% actual / 90% forecast — wired to one SNS topic with a CloudWatch CPU alarm, so `make destroy` plus aws-nuke allowlisting keeps monthly spend at zero. Debugged a credential namespace collision where the Cloudflare R2 S3-compatible state backend and the real AWS provider both consumed the native AWS_ACCESS_KEY_ID, resolved by partitioning secrets into TF_VAR_R2_* and pinning the provider's S3 endpoint back to its region. Reached 39 resources with a drift-free terraform plan across repeated destroy and re-apply cycles.",
            techStack: ["Terraform", "AWS", "ALB", "ASG", "RDS", "CloudFront", "S3", "Cloudflare R2", "Infisical"],
            favorite: true,
            github: "https://github.com/notseekeru/terraform",
            icon: "FaAws",
            blogs: ["aws-on-a-budget"],
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
            title: "Systems Programming — HTTP Server in C with Raw Sockets",
            description:
                "Rebuilt an HTTP server from the sockets up in C with no framework and no HTTP library: socket, bind on INADDR_ANY:8080, listen, then an accept loop that serves each client with one send and closes, so the response is body only. That is why the Makefile's get target uses curl --http0.9, because a conventional client rejects a reply that has no status line or headers. The whole thing is one translation unit, main.c includes its own kv_helper.c, and kv_helper is where the memory work lives: a KVPair allocated on the heap with a NULL check after every allocation and a partial-free path, so a failed value allocation returns the key allocation instead of leaking it. The rest of the pass was correctness under load: one send for the full message, sockaddr_in zeroed before bind, error handling on every syscall, and a loop that keeps serving after a failed accept. What I actually took from it is knowing which bytes are mine, which is the only reason the project exists.",
            techStack: ["C", "Sockets", "Linux", "Make", "curl"],
            github: "https://github.com/notseekeru/custom-http-c",
            icon: "SiC",
        },
    ],
};

export default personalData;
