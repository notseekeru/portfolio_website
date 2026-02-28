const personalData = {
  name: 'Stephen Macabulos',
  title: 'Developing Engineer',
  location: 'Pampanga, Philippines',
  email: 'stpmacabulos0318@gmail.com',
  linkedin: 'https://www.linkedin.com/in/stephen-macabulos-192495336/',
  github: 'https://github.com/notseekeru',
  facebook: '',
  bio: 'I am a passionate enthusiastic person, I love tech and my heart craves for it. I develop interesting projects that suits and solves problems.',
  profilePicture: '/profile.png',

  experience: [
    {
      company: 'Tech Corp',
      title: 'Senior Developer',
      duration: '2020 — Present',
      responsibilities: 'Developing scalable web applications.'
    }
  ],

  education: [
    {
      institution: 'Pampanga State University',
      degree: 'B.S. in Computer Engineering',
      duration: '2025 — 2029'
    }
  ],

  skills: {
    languages: ['JavaScript', 'Python', 'TypeScript'],
    frameworks: ['React', 'Next.js', 'Tailwind CSS'],
    tools: ['Git', 'Docker', 'Vercel']
  },

  projects: [
    {
      title: 'Resume Website',
      description: 'My personal resume website built with Next.js and Tailwind CSS.',
      techStack: ['Next.js', 'Tailwind', 'TypeScript'],
      link: 'https://example.com/project',
      image: 'https://example.com/image.png',
      isHobby: false
    }
  ],

  HobbyProjects: [
    {
      title: 'E-Commerce Platform',
      description:
        'A full-featured online store with product listings, cart, checkout, and order management.',
      techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      link: '#',
      isHobby: true
    },
    {
      title: 'Task Management App',
      description:
        'Kanban-style task board with drag-and-drop, team collaboration, and deadline tracking.',
      techStack: ['React', 'Express', 'MongoDB', 'Socket.io'],
      link: '#',
      isHobby: true
    },
    {
      title: 'Weather Dashboard',
      description: 'Real-time weather app with location search, 7-day forecasts, and radar maps.',
      techStack: ['React', 'OpenWeather API', 'Tailwind'],
      link: '#',
      isHobby: true
    },
    {
      title: 'Real-Time Chat App',
      description:
        'Multi-room chat application with user auth, message history, and live presence indicators.',
      techStack: ['React', 'Node.js', 'Socket.io', 'Redis'],
      link: '#',
      isHobby: true
    },
    {
      title: 'Blog Platform',
      description: 'Headless CMS-powered blog with markdown support, tags, and an RSS feed.',
      techStack: ['Next.js', 'Contentful', 'Tailwind'],
      link: '#',
      isHobby: true
    },
    {
      title: 'Dev Portfolio Hobby',
      description:
        'A minimal, customizable developer portfolio starter with dark mode and animations.',
      techStack: ['React', 'Vite', 'Framer Motion'],
      link: '#',
      isHobby: true
    }
  ]
}

export default personalData
