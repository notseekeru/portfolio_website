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

export interface SkillItem {
  name: string;
  icon: string;
  summary: string;
  implementation: string;
}

export interface Skills {
  languages: SkillItem[];
  frameworks: SkillItem[];
  tools: SkillItem[];
}

export interface ProjectItem {
  title: string;
  description: string;
  techStack: string[];
  link?: string;
  image?: string;
  favorite?: boolean;
  github?: string;
  icon?: string;
}

export interface PersonalData {
  name: string;
  level: string;
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
  background: string;
  profilePicture: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: Skills;
  projects: ProjectItem[];
}

const personalData: PersonalData = {
  name: "Stephen Macabulos",
  level: "Intern/Entry Level",
  status: "Available for Internships or Entry level roles in a Remote setting",
  title: "Site Reliability Engineer | DevOps Engineer | Platform Engineer",
  location: "Pampanga, Philippines",
  email: "stpmacabulos@gmail.com",
  linkedin: "https://www.linkedin.com/in/stephen-macabulos",
  github: "https://github.com/notseekeru",
  facebook: "https://www.facebook.com/notseekeru",
  instagram: "https://www.instagram.com/notseekeru/",
  x: "https://x.com/notseekeru",
  threads: "https://www.threads.com/@notseekeru",
  bio: "Building reliable and scalable systems, I am an Engineer with a strong background in Software Engineering, SRE Principles and DevOps Practices. With experience in designing and maintaining complex infrastructures, I can thrive on securing cloud/physical environments and ensuring seamless integration experience. My skills includes cloud computing, automation, and monitoring, allowing me to proactively identify and resolve issues while continuously improving system reliability.",
  background:
    "I am a Computer Engineering undergraduate student with an obession for technology. I have a strong hunger for learning and exploring various fields in technology, from software to hardware. I am driven by a desire to understand how things work under the hood and to develop deep technical skills. I currently operate a self-hosted homelab infrastructure, where I experiment with various technologies and build projects that helps me learn, showcase my skills and creativity. I am always eager to take on new challenges and expand my knowledge in the evolving world of technology.",
  profilePicture: "/profile3.png",

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

  skills: {
    languages: [
      {
        name: "JavaScript",
        icon: "SiJavascript",
        summary: "Dynamic web semantics.",
        implementation: "Used for frontend interactivity and backend tooling.",
      },
      {
        name: "Python",
        icon: "SiPython",
        summary: "Versatile object-oriented language.",
        implementation: "Scripting and backend systems automation.",
      },
      {
        name: "TypeScript",
        icon: "SiTypescript",
        summary: "Type-safe JavaScript.",
        implementation: "Core language for reliable React architectures.",
      },
      {
        name: "C++",
        icon: "SiCplusplus",
        summary: "Systems-level programming.",
        implementation: "Hardware control and Microcontroller programming.",
      },
      {
        name: "Java",
        icon: "FaJava",
        summary: "Write once, run anywhere.",
        implementation: "Object-oriented enterprise backend structures.",
      },
      {
        name: "Go",
        icon: "FaGolang",
        summary: "Compiled language for concurrency.",
        implementation: "Building efficient microservices",
      },
    ],
    frameworks: [
      {
        name: "React",
        icon: "SiReact",
        summary: "UI component library.",
        implementation: "Building SPAs and interactive web frontends.",
      },
      {
        name: "Tailwind CSS",
        icon: "SiTailwindcss",
        summary: "Utility-first styling.",
        implementation: "Rapid responsive UI component designing.",
      },
      {
        name: "Express",
        icon: "SiExpress",
        summary: "Node.js framework.",
        implementation: "Fast and minimalist REST API development.",
      },
      {
        name: "JavaFX",
        icon: "SiOpenjdk",
        summary: "Java desktop framework.",
        implementation: "Building cross-platform rich client applications.",
      },
    ],
    tools: [
      {
        name: "Node.js",
        icon: "SiNodedotjs",
        summary: "JavaScript runtime.",
        implementation: "Serverside execution for full-stack apps.",
      },
      {
        name: "Git",
        icon: "FaGitAlt",
        summary: "Version control system.",
        implementation: "Code tracking and collaborative development.",
      },
      {
        name: "Bash",
        icon: "SiGnubash",
        summary: "Unix shell.",
        implementation: "Automation and OS-level administration scripts.",
      },
      {
        name: "Docker",
        icon: "FaDocker",
        summary: "Containerization.",
        implementation: "Isolating microservices for stable deployments.",
      },
      {
        name: "Mermaid",
        icon: "SiMermaid",
        summary: "Diagramming tool.",
        implementation: "Visualizing architecture flows as code.",
      },
      {
        name: "Github Actions",
        icon: "SiGithubactions",
        summary: "CI/CD pipelines.",
        implementation: "Automating testing and build workflows.",
      },
      {
        name: "Ansible",
        icon: "SiAnsible",
        summary: "IT automation tool.",
        implementation: "Configuration management of infrastructure.",
      },
      {
        name: "NGinx",
        icon: "SiNginx",
        summary: "Web server.",
        implementation: "Reverse proxy and load balancing operations.",
      },
      {
        name: "Cloudflare",
        icon: "SiCloudflare",
        summary: "CDN and security.",
        implementation: "DDoS protection and DNS record management.",
      },
      {
        name: "Loki",
        icon: "SiGrafana",
        summary: "Log aggregation.",
        implementation: "Centralized logging for troubleshooting and analysis.",
      },
      {
        name: "Grafana",
        icon: "SiGrafana",
        summary: "Data visualization.",
        implementation: "Monitoring dashboards for system metrics.",
      },
      {
        name: "Tempo",
        icon: "SiGrafana",
        summary: "Distributed tracing.",
        implementation:
          "Tracing requests across microservices for performance insights.",
      },
      {
        name: "Prometheus",
        icon: "SiPrometheus",
        summary: "Metrics database.",
        implementation: "Scraping and storing time-series telemetry data.",
      },
      {
        name: "Grafana Alloy",
        icon: "SiGrafana",
        summary: "Telemetry collector.",
        implementation: "Agile pipeline routing for logs, metrics, and traces.",
      },
      {
        name: "OpenTelemetry",
        icon: "SiOpentelemetry",
        summary: "Observability framework.",
        implementation:
          "Standardizing cloud-native instrumentation and traces.",
      },
      {
        name: "Terraform",
        icon: "SiTerraform",
        summary: "Infrastructure as Code.",
        implementation:
          "Automating the provisioning and management of infrastructure.",
      },
      {
        name: "DigitalOcean",
        icon: "SiDigitalocean",
        summary: "Cloud computing platform.",
        implementation: "Hosting and managing cloud infrastructure.",
      },
      {
        name: "Kubernetes",
        icon: "SiKubernetes",
        summary: "Container orchestration.",
        implementation: "Deploying and managing containerized applications.",
      },
      {
        name: "ArgoCD",
        icon: "SiArgo",
        summary: "GitOps CD tool.",
        implementation:
          "Automated Kubernetes deployments via Git repositories.",
      },
      {
        name: "Tailscale",
        icon: "SiTailscale",
        summary: "Zero-config VPN.",
        implementation: "Secure overlay network for multi-node infrastructure.",
      },
      {
        name: "Trivy",
        icon: "SiTrivy",
        summary: "Vulnerability scanner.",
        implementation:
          "CVE and secret scanning in container images and repos.",
      },
      {
        name: "AlertManager",
        icon: "SiPrometheus",
        summary: "Alert routing.",
        implementation: "Handling and deduplicating Prometheus alerts.",
      },
      {
        name: "Neovim",
        icon: "SiNeovim",
        summary: "Terminal-first editor.",
        implementation: "Optimized development workflow with LazyVim.",
      },
      {
        name: "Tmux",
        icon: "SiTmux",
        summary: "Terminal multiplexer.",
        implementation:
          "Session persistence and multi-pane terminal management.",
      },
      {
        name: "Vite",
        icon: "SiVite",
        summary: "Frontend build tool.",
        implementation: "Fast HMR and optimized production builds for SPAs.",
      },
    ],
  },

  projects: [
    {
      title: "Portfolio Website & Production-Grade Infrastructure",
      description:
        "Designed and deployed a self-hosted portfolio on RPi5 with a hardened Cloudflared → Nginx proxy-chain architecture featuring network segmentation, CSP/COOP/COEP security headers, multi-stage Docker builds, QEMU multi-arch (ARM64) support, Trivy CVE scanning in CD pipeline, and an SSL Labs A+ rating.",
      techStack: [
        "React",
        "TypeScript",
        "Vite",
        "Node.js",
        "Express",
        "Nginx",
        "Docker",
        "Cloudflare",
        "TLS 1.3",
        "Trivy",
        "ARM64",
      ],
      link: "https://portfolio.seekeru.tech",
      image: "/1.png",
      favorite: true,
      github: "https://github.com/notseekeru/portfolio_website",
      icon: "SiReact",
    },
    {
      title: "Cloud Infrastructure — Terraform & Kubernetes",
      description:
        "Provisioned DigitalOcean infrastructure with Terraform using modular .tf files and secure variable management, integrated dynamic Ansible inventories, deployed a 3-node Kubernetes cluster with ArgoCD GitOps, and hardened containers with tmpfs/readonly root filesystems.",
      techStack: [
        "Terraform",
        "DigitalOcean",
        "Kubernetes",
        "ArgoCD",
        "Ansible",
        "Docker",
        "GitHub Actions",
      ],
      favorite: true,
      icon: "SiTerraform",
    },
    {
      title: "Observability & SRE — LGTM Stack with OTLP Tracing",
      description:
        "Architected a full Loki/Grafana/Tempo/Prometheus + Alloy observability stack with unified OTLP ingestion across logs, metrics and traces. Implemented OpenTelemetry-based distributed tracing, built a Four Golden Signals dashboard, automated Docker log discovery, configured Slack alerting via AlertManager, and validated MTTR/MTTD through chaos engineering experiments (Postgres blackout).",
      techStack: [
        "Grafana",
        "Prometheus",
        "Loki",
        "Tempo",
        "Alloy",
        "OpenTelemetry",
        "AlertManager",
        "Docker",
        "Node.js",
      ],
      favorite: true,
      icon: "SiGrafana",
    },
    {
      title: "Infrastructure as Code — Ansible Automation",
      description:
        "Transitioned to IaC with modular Ansible roles for security hardening, user management, and Dockerization across RPi5 and cloud nodes. Implemented Ansible Vault for secrets, achieved 100% molecule-tested idempotency, enforced automated CI/CD linting via GitHub Actions, and built self-healing infrastructure using declarative state patterns.",
      techStack: [
        "Ansible",
        "Molecule",
        "Ansible Vault",
        "GitHub Actions",
        "Linux",
        "IaC",
      ],
      favorite: true,
      github: "https://github.com/notseekeru",
      icon: "SiAnsible",
    },
    {
      title: "Java Enterprise Architecture Project — Team Lead",
      description:
        "Architected a production-grade JavaFX application with layered MVC+DAO+Service architecture, CI/CD pipelines, Flyway schema migrations, Bcrypt hashing, Spotbugs/Spotless linting, JUnit integration tests, and JaCoCo code coverage. Led a non-technical team through GitHub Flow, authored Level 3 SOPs and ADRs, and automated Mermaid diagram generation via GitHub Actions for documentation.",
      techStack: [
        "Java",
        "JavaFX",
        "Maven",
        "GitHub Actions",
        "Flyway",
        "JUnit",
        "Docker",
        "Mermaid",
      ],
      favorite: true,
      github: "https://github.com/notseekeru",
      icon: "FaJava",
    },
    {
      title: "Homelab & Self-Hosted Infrastructure",
      description:
        "Operate a Raspberry Pi 5-based homelab running Pi-hole DNS, Plex media server, Portainer container management, game servers, and the full LGTM observability stack. Applied Linux hardening (UFW, SSH key-only, Tailscale overlay), automated apt updates, and enforced Tailscale-only access across all services with network segmentation.",
      techStack: [
        "Raspberry Pi",
        "Docker",
        "Linux",
        "Tailscale",
        "Pi-hole",
        "Grafana",
        "Networking",
      ],
      icon: "SiRaspberrypi",
    },
  ],
};

export default personalData;
