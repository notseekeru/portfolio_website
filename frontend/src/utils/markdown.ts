import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-docker";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-python";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-yaml";

interface HighlightedCode {
  html: string;
  className: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function normalizeLanguage(lang: string): string {
  if (!lang) return "";

  const aliases: Record<string, string> = {
    js: "javascript",
    jsx: "jsx",
    ts: "typescript",
    tsx: "tsx",
    py: "python",
    sh: "bash",
    shell: "bash",
    zsh: "bash",
    yml: "yaml",
    docker: "docker",
    dockerfile: "docker",
    compose: "yaml",
  };

  const normalized = lang.trim().toLowerCase();
  return aliases[normalized] || normalized;
}

function highlightCode(code: string, language: string): HighlightedCode {
  const normalizedLanguage = normalizeLanguage(language);
  const prismLanguage = Prism.languages[normalizedLanguage];

  if (!normalizedLanguage || !prismLanguage) {
    return {
      html: escapeHtml(code),
      className: "",
    };
  }

  return {
    html: Prism.highlight(code, prismLanguage, normalizedLanguage),
    className: `language-${normalizedLanguage}`,
  };
}

function parseMarkdown(md: string): string {
  let html = "";
  const lines = md.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const fenceMatch = line.match(/^```\s*([\w-]+)?\s*$/);
      const language = fenceMatch?.[1] || "";
      i++;
      let code = "";
      while (i < lines.length && !lines[i].startsWith("```")) {
        code += (code ? "\n" : "") + lines[i];
        i++;
      }
      i++;

      if (language === "mermaid") {
        html += `<div class="mermaid">${escapeHtml(code)}</div>`;
      } else {
        const highlighted = highlightCode(code, language);
        html += `<pre class="blog-code-block"><code class="${highlighted.className}">${highlighted.html}</code></pre>`;
      }
      continue;
    }

    if (line.startsWith("######")) {
      html += `<h6>${parseInline(line.slice(6).trim())}</h6>`;
    } else if (line.startsWith("#####")) {
      html += `<h5>${parseInline(line.slice(5).trim())}</h5>`;
    } else if (line.startsWith("####")) {
      html += `<h4>${parseInline(line.slice(4).trim())}</h4>`;
    } else if (line.startsWith("###")) {
      html += `<h3>${parseInline(line.slice(3).trim())}</h3>`;
    } else if (line.startsWith("##")) {
      html += `<h2>${parseInline(line.slice(2).trim())}</h2>`;
    } else if (line.startsWith("#")) {
      html += `<h1>${parseInline(line.slice(1).trim())}</h1>`;
    } else if (line.startsWith("> ")) {
      let quote = "";
      while (i < lines.length && lines[i].startsWith("> ")) {
        quote += (quote ? " " : "") + lines[i].slice(2);
        i++;
      }
      html += `<blockquote>${parseInline(quote)}</blockquote>`;
      continue;
    } else if (line.match(/^---+\s*$/) || line.match(/^\*\*\*+\s*$/)) {
      html += "<hr />";
    } else if (line.match(/^[-*]\s/)) {
      let items = "";
      while (i < lines.length && lines[i].match(/^[-*]\s/)) {
        items += `<li>${parseInline(lines[i].replace(/^[-*]\s/, ""))}</li>`;
        i++;
      }
      html += `<ul>${items}</ul>`;
      continue;
    } else if (line.match(/^\d+\.\s/)) {
      let items = "";
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        items += `<li>${parseInline(lines[i].replace(/^\d+\.\s/, ""))}</li>`;
        i++;
      }
      html += `<ol>${items}</ol>`;
      continue;
    } else if (line.trim() === "") {
      html += "";
    } else {
      let para = line;
      while (
        i + 1 < lines.length &&
        lines[i + 1].trim() !== "" &&
        !isBlockStart(lines[i + 1])
      ) {
        i++;
        para += " " + lines[i];
      }
      html += `<p>${parseInline(para)}</p>`;
    }

    i++;
  }

  return html;
}

function isBlockStart(line: string): boolean {
  return (
    line.startsWith("#") ||
    line.startsWith("```") ||
    line.startsWith("> ") ||
    line.match(/^[-*]\s/) !== null ||
    line.match(/^\d+\.\s/) !== null ||
    line.match(/^---+\s*$/) !== null ||
    line.match(/^\*\*\*+\s*$/) !== null
  );
}

function parseInline(text: string): string {
  return escapeHtml(text)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

export { parseMarkdown };
