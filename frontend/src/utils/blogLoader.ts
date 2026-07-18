// This file is responsible for loading and parsing blog posts from markdown files in the content/blogs directory. It uses Vite's glob import to load all markdown files, parses their frontmatter metadata, and provides functions to retrieve all blog posts or a specific post by slug.

import { parseFrontmatter } from "./frontmatter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  image: string;
  content: string;
  favorite?: boolean;
  github?: string;
}

const blogModules = import.meta.glob("../content/blogs/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

function getSlugFromPath(path: string): string {
  const filename = path.split("/").pop() ?? "";
  return filename.replace(/\.md$/, "");
}

async function loadBlogs(): Promise<BlogPost[]> {
  const entries = await Promise.all(
    Object.entries(blogModules).map(async ([path, loader]) => {
      const raw = await loader();
      const { meta, content } = parseFrontmatter(raw);
      const slug = getSlugFromPath(path);

      return {
        slug,
        title: meta.title || slug,
        date: meta.date || "",
        description: meta.description || "",
        image: meta.image || "",
        favorite: meta.favorite === "true",
        github: meta.github || "",
        content,
      };
    }),
  );

  entries.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return entries;
}

async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const blogs = await loadBlogs();
  return blogs.find((b) => b.slug === slug) || null;
}

export { loadBlogs, getBlogBySlug };
