---
title: The Awakening
date: 2026-02-25
description: How I designed and built my first live website. The architectural decisions, the tech stack, and the lessons learned from the experience.
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfM21gdAKGbsc4tUO29PLVGvmI5dPHZeN_xg&s"
---

---

# Summary

This article outlines the process of building a live portfolio website using React, Vite, Tailwind, with the assistance of AI tools. I discuss the initial planning, design choices, development process, and deployment strategy, highlighting the challenges and lessons learned along the way.

---

## Defining the Vision

It all started with the realization that I needed a live portfolio to showcase my skills and projects. I decided to orchestrate the process using AI, but first, I had to define the tech stack. While the AI provided a generic suggestion, I refined it with custom prompts to make the stack more specific to my needs.

---

## Planning with AI

With the tech stack finalized, I leveraged Claude Code Opus 4.6 and `Copilot Education` to break the project into manageable tasks and phases. This delegation allowed me to focus on one step at a time while ensuring the overall vision stayed on track.

---

## Building the Website

The development phase began with React and Vite as the foundation, Tailwind for styling, and Framer Motion for animations. These tools provided the speed, flexibility, and polish I needed to bring the design to life.

---

## Deploying to Production

Once the website was ready, I deployed it using `Vercel`, a serverless hosting platform. Setting up a custom domain with a registered CNAME was straightforward, and the site was live in no time. However, I soon realized that Vercel's simplicity came with limitations (e.g., limited control over server-side logic, deployment configurations, infrastructure costs if commercial and scaled).

---

## Switching to Cloudflare

To gain more control and flexibility, I migrated the deployment to Cloudflare. This involved replacing my existing registrar with Cloudflare Registers and setting up a subdomain. Learned about A Records, CNAMEs, and other `Cloudflare Dashboard` configurations. The transition was a little rough, but the new setup offered better performance and scalability.

---

## Wait, Am I Vibe-Coding?

This made me realize that I was `technically "vibe-coding"` the project, meaning I was relying heavily on AI to generate code. Though this made the process faster and more efficient, it also made me question my own coding skills(I must admit that I hate coding). However, what I discovered was more invaluable and that is `System Design and Architecture`. I learned how to design and architect a system, how to break down a project into smaller tasks, and how to leverage AI tools to enhance my workflow. This experience has been a mind-opening that made me think "I'd love to Architect Systems" This founded by ambition to be a Systems Architect and not just a developer. I want to design and build systems that are scalable, secure, and reliable.

---

# Conclusion

Looking back, this journey was more than just building a website. It was about leveraging AI to enhance creativity, streamline workflows, and push the boundaries of what I could achieve as a developer. This made me think of system architecture and design the `bigger picture` that otherwise wouldn't have occurred to me if I hadn't used AI as a `tool`. This allowed me to think bigger and approach problems with a more strategic mindset and not just worry about the details, the code, the nuance of programming. The project taught me real patterns of code and not something that lives inside the local folder, it taught me I could build and ship real projects that I could show to the world and improve my skills as a developer. Each step taught me something new, and the end result is a portfolio that truly represents my skills and vision.

---

## Update (April 24, 2026)

You can check the others blogs I wrote about the next steps of this project, which include self-hosting the website, implementing a reverse proxy with Nginx, A tunnel using cloudflare. Link at [The Serverless Trap](https://portfolio.seekeru.tech/blog/the-serverless-trap).

---
