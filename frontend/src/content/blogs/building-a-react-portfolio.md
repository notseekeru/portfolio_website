---
title: Building a Modern React Portfolio from Scratch
date: 2026-01-25
description: How I designed and built my personal portfolio using React, Vite, Tailwind CSS, and Framer Motion.
image: /blog/react-portfolio.png
---

Every developer needs a portfolio. It's your digital resume and the first thing recruiters and clients see. Here's how I built mine from the ground up.

## Choosing the Stack

I went with **React + Vite** for the framework, **Tailwind CSS** for styling, and **Framer Motion** for animations. This combo gives you fast builds, utility-first styling, and buttery smooth transitions.

## Project Structure

Keeping things organized matters. I separated concerns into clear folders:

- **components/** — Reusable UI pieces like Navbar, Footer, Hero
- **pages/** — Route-level components (Home, Projects, Contact)
- **data/** — Centralized personal data in one file

This makes it easy to update content without touching component logic.

## Dark Theme Design

A dark theme feels modern and is easier on the eyes. The key is contrast — use zinc/neutral grays for backgrounds and a vibrant accent color for interactive elements. I picked cyan as my primary accent with purple as a secondary.

## Animations That Don't Annoy

Framer Motion makes it easy to add page transitions and scroll reveals. The trick is subtlety:

- Keep durations under 0.5 seconds
- Use opacity and small vertical shifts
- Stagger child elements for a cascading entrance
- Never animate something just because you can

## Responsive Design

Tailwind's responsive prefixes make mobile-first design straightforward. Start with the mobile layout, then layer on tablet and desktop styles with `md:` and `lg:` prefixes.

## Performance Tips

- Lazy-load images and heavy components
- Use Vite's built-in code splitting
- Optimize images before uploading
- Keep your bundle lean — audit dependencies regularly

## Final Thoughts

Your portfolio is a living project. Ship the first version fast, then iterate. The best portfolio is one that exists online, not one that's perfect in your head.
