import { parseFrontmatter } from './markdown'

const blogModules = import.meta.glob('../content/blogs/*.md', { query: '?raw', import: 'default', eager: true })

function getSlugFromPath(path) {
  const filename = path.split('/').pop()
  return filename.replace(/\.md$/, '')
}

function loadBlogs() {
  const blogs = Object.entries(blogModules).map(([path, raw]) => {
    const { meta, content } = parseFrontmatter(raw)
    const slug = getSlugFromPath(path)

    return {
      slug,
      title: meta.title || slug,
      date: meta.date || '',
      description: meta.description || '',
      image: meta.image || '',
      content
    }
  })

  blogs.sort((a, b) => {
    if (!a.date || !b.date) return 0
    return new Date(b.date) - new Date(a.date)
  })

  return blogs
}

function getBlogBySlug(slug) {
  const blogs = loadBlogs()
  return blogs.find((b) => b.slug === slug) || null
}

export { loadBlogs, getBlogBySlug }
