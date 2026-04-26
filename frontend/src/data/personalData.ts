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

export interface Skills {
  languages: string[];
  frameworks: string[];
  tools: string[];
}

export interface InfrastructureItem {
  role: string;
  description: string;
  focus: string[];
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
  title: "Site Reliability Engineer | DevOps | System Administrator",
  location: "Pampanga, Philippines",
  email: "stpmacabulos@gmail.com",
  linkedin: "https://www.linkedin.com/in/stephen-macabulos-192495336/",
  github: "https://github.com/notseekeru",
  facebook: "https://www.facebook.com/notseekeru",
  instagram: "https://www.instagram.com/notseekeru/",
  bio: "Passionate about building reliable and scalable systems, I am a Site Reliability Engineer with a strong background in software development and DevOps practices. With experience in designing and maintaining complex infrastructures, I thrive on securing cloud/physical environments and ensuring seamless user experiences. My expertise includes cloud computing, automation, and monitoring, allowing me to proactively identify and resolve issues while continuously improving system reliability.",
  background:
    "I am a Computer Engineering undergraduate student with a obession for technology. I have a strong passion for learning and exploring various fields in technology, from software development to hardware tinkering. I am driven by a desire to understand how things work under the hood and to create innovative solutions that can make a positive impact.",
  profilePicture: "/profile.png",

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
    languages: ["JavaScript", "Python", "TypeScript", "C++", "Java"],
    frameworks: ["React", "Tailwind CSS", "Express", "Node.js"],
    tools: [
      "Git",
      "Bash",
      "Docker",
      "Mermaid",
      "Github Actions",
      "Ansible",
      "NGinx",
      "Cloudflare",
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
