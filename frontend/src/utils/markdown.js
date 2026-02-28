function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
  if (!match) return { meta: {}, content: raw }

  const metaBlock = match[1]
  const content = match[2]
  const meta = {}

  metaBlock.split('\n').forEach((line) => {
    const idx = line.indexOf(':')
    if (idx === -1) return
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    meta[key] = value
  })

  return { meta, content }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function parseMarkdown(md) {
  let html = ''
  const lines = md.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('```')) {
      i++
      let code = ''
      while (i < lines.length && !lines[i].startsWith('```')) {
        code += (code ? '\n' : '') + lines[i]
        i++
      }
      i++
      html += `<pre class="blog-code-block"><code>${escapeHtml(code)}</code></pre>`
      continue
    }

    if (line.startsWith('######')) {
      html += `<h6>${parseInline(line.slice(6).trim())}</h6>`
    } else if (line.startsWith('#####')) {
      html += `<h5>${parseInline(line.slice(5).trim())}</h5>`
    } else if (line.startsWith('####')) {
      html += `<h4>${parseInline(line.slice(4).trim())}</h4>`
    } else if (line.startsWith('###')) {
      html += `<h3>${parseInline(line.slice(3).trim())}</h3>`
    } else if (line.startsWith('##')) {
      html += `<h2>${parseInline(line.slice(2).trim())}</h2>`
    } else if (line.startsWith('#')) {
      html += `<h1>${parseInline(line.slice(1).trim())}</h1>`
    } else if (line.startsWith('> ')) {
      let quote = ''
      while (i < lines.length && lines[i].startsWith('> ')) {
        quote += (quote ? ' ' : '') + lines[i].slice(2)
        i++
      }
      html += `<blockquote>${parseInline(quote)}</blockquote>`
      continue
    } else if (line.match(/^---+\s*$/) || line.match(/^\*\*\*+\s*$/)) {
      html += '<hr />'
    } else if (line.match(/^[-*]\s/)) {
      let items = ''
      while (i < lines.length && lines[i].match(/^[-*]\s/)) {
        items += `<li>${parseInline(lines[i].replace(/^[-*]\s/, ''))}</li>`
        i++
      }
      html += `<ul>${items}</ul>`
      continue
    } else if (line.match(/^\d+\.\s/)) {
      let items = ''
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        items += `<li>${parseInline(lines[i].replace(/^\d+\.\s/, ''))}</li>`
        i++
      }
      html += `<ol>${items}</ol>`
      continue
    } else if (line.trim() === '') {
      html += ''
    } else {
      let para = line
      while (i + 1 < lines.length && lines[i + 1].trim() !== '' && !isBlockStart(lines[i + 1])) {
        i++
        para += ' ' + lines[i]
      }
      html += `<p>${parseInline(para)}</p>`
    }

    i++
  }

  return html
}

function isBlockStart(line) {
  return (
    line.startsWith('#') ||
    line.startsWith('```') ||
    line.startsWith('> ') ||
    line.match(/^[-*]\s/) ||
    line.match(/^\d+\.\s/) ||
    line.match(/^---+\s*$/) ||
    line.match(/^\*\*\*+\s*$/)
  )
}

function parseInline(text) {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

export { parseFrontmatter, parseMarkdown }
