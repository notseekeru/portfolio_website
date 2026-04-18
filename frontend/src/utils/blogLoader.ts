import { parseFrontmatter } from "./markdown";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  image: string;
  content: string;
}

const blogModules = import.meta.glob("../content/blogs/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function getSlugFromPath(path: string): string {
  const filename = path.split("/").pop() ?? "";
  return filename.replace(/\.md$/, "");
}

function loadBlogs(): BlogPost[] {
  const blogs = Object.entries(blogModules).map(([path, raw]) => {
    const { meta, content } = parseFrontmatter(raw);
    const slug = getSlugFromPath(path);

    return {
      slug,
      title: meta.title || slug,
      date: meta.date || "",
      description: meta.description || "",
      image: meta.image || "",
      content,
    };
  });

  blogs.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    const bTime = new Date(b.date).getTime();
    const aTime = new Date(a.date).getTime();
    return bTime - aTime;
  });

  return blogs;
}

function getBlogBySlug(slug: string): BlogPost | null {
  const blogs = loadBlogs();
  return blogs.find((b) => b.slug === slug) || null;
}

export { loadBlogs, getBlogBySlug };
