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

export interface InfrastructureItem {
  role: string;
  description: string;
  focus: string[];
  icon: string;
  summary: string;
  implementation: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  techStack: string[];
  link: string;
  image: string;
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
  bio: string;
  background: string;
  profilePicture: string;
  age: number;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: Skills;
  infrastructure: InfrastructureItem[];
  projects: ProjectItem[];
}

const personalData: PersonalData = {
  name: "Stephen Macabulos",
  level: "Intern",
  status: "Available for internships/entry level roles",
  title: "Site Reliability Engineer | DevOps Engineer | Platform Engineer",
  location: "Pampanga, Philippines",
  email: "stpmacabulos@gmail.com",
  linkedin: "https://www.linkedin.com/in/stephen-macabulos-521a6b406/",
  github: "https://github.com/notseekeru",
  facebook: "https://www.facebook.com/notseekeru",
  instagram: "https://www.instagram.com/notseekeru/",
  bio: "Building reliable and scalable systems, I am an Engineer with a strong background in Software Engineering, SRE Principles and DevOps Practices. With experience in designing and maintaining complex infrastructures, I can thrive on securing cloud/physical environments and ensuring seamless integration experience. My skills includes cloud computing, automation, and monitoring, allowing me to proactively identify and resolve issues while continuously improving system reliability.",
  background:
    "I am a Computer Engineering undergraduate student with a obession for technology. I have a strong obsession(not just passion) for learning and exploring various fields in technology, from software to hardware. I am driven by a desire to understand how things work under the hood and to develop deep technical skills. I currently operate a self-hosted homelab infrastructure, where I experiment with various technologies and build projects that helps me learn, showcase my skills and creativity. I am always eager to take on new challenges and expand my knowledge in the fast evolving world of technology.",
  profilePicture: "/profile2.png",

  get age(): number {
    const birthYear = 2006;
    const birthMonth = 2; // March (0-indexed)
    const birthDay = 18;
    const today = new Date();
    let age = today.getFullYear() - birthYear;
    if (
      today.getMonth() < birthMonth ||
      (today.getMonth() === birthMonth && today.getDate() < birthDay)
    ) {
      age--;
    }
    return age;
  },

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
        name: "FastAPI",
        icon: "SiFastapi",
        summary: "Python web framework.",
        implementation: "High-performance APIs with async support.",
      },
      {
        name: "Spring Boot",
        icon: "SiSpringboot",
        summary: "Java application framework.",
        implementation: "Building robust enterprise backend systems.",
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
    ],
  },

  infrastructure: [
    {
      role: "Self-Hosted Infrastructure (RPi5 Lab)",
      description:
        "Architected and hardened a production-grade proxy chain environment.",
      focus: [
        "Ansible (IaC)",
        "Docker Compose (Orchestration)",
        "Network Security (UFW/Tailscale)",
        "Observability (Prometheus/Loki/Grafana)",
      ],
      icon: "FaServer",
      summary: "Homelab cluster for self-hosted applications.",
      implementation:
        "Managed via Docker Compose and Ansible over Tailscale VPN.",
    },
  ],

  projects: [
    {
      title: "Portfolio Website (This Website)",
      description:
        "My personal portfolio website to contain blogs, projects, and resume.",
      techStack: ["Vite", "TypeScript", "React", "Node.js", "Express"],
      link: "https://portfolio.seekeru.tech",
      image: "/1.png",
    },
    {
      title: "PC Building Business Website",
      description:
        "A website for my local PC building business to showcase my services and builds.",
      techStack: ["React", "Node.js", "Express"],
      link: "https://shop.seekeru.tech",
      image: "/2.png",
    },
  ],
};

export default personalData;
