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
  profilePicture: string;
  age: number;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: Skills;
  projects: ProjectItem[];
}

const personalData: PersonalData = {
  name: "Stephen Macabulos",
  title: "Computer Engineer",
  location: "Pampanga, Philippines",
  email: "stpmacabulos@gmail.com",
  linkedin: "https://www.linkedin.com/in/stephen-macabulos-192495336/",
  github: "https://github.com/notseekeru",
  facebook: "https://www.facebook.com/notseekeru",
  instagram: "https://www.instagram.com/notseekeru/",
  bio: "I am a passionate enthusiastic tech person, I love tech and my heart craves for it. Software and Hardware is what I desire and I am aiming to be the best at both worlds.",
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
      duration: "2025 — ----",
    },
  ],

  skills: {
    languages: ["JavaScript", "Python", "TypeScript", "C++", "Java"],
    frameworks: ["React", "Tailwind CSS", "Express", "Node.js"],
    tools: [
      "Git",
      "Bash",
      "Docker",
      "Vercel",
      "Github Actions",
      "Ansible",
      "Terraform",
      "K8s",
      "NGinx",
      "Cloudflare",
    ],
  },

  projects: [
    {
      title: "Portfolio Website (This Website)",
      description:
        "My personal portfolio website to contain blogs, projects, and resume.",
      techStack: ["Vite", "TypeScript", "React", "Node", "Express"],
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
