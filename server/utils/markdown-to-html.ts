// Markdown to HTML converter for rendering docs
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseInline(text: string): string {
  let result = escapeHtml(text);
  result = result.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
  );
  result = result.replace(/\*\*(\S[^*]+)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/\*(\S[^*]+)\*/g, '<em>$1</em>');
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match: string, text: string, href: string) => {
      const cleanHref = href.replace(/\.md(?=[\s#?/]|$)/g, '');
      return `<a href="${cleanHref}" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">${text}</a>`;
    }
  );
  return result;
}

function parseTable(
  lines: string[],
  start: number
): { html: string; end: number } {
  const tableLines: string[] = [];
  let i = start;
  while (i < lines.length && lines[i].trim().startsWith('|')) {
    tableLines.push(lines[i]);
    i++;
  }

  if (tableLines.length < 2) {
    return { html: '', end: start };
  }

  const headerCells = tableLines[0]
    .split('|')
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
  const separator = tableLines[1]
    .split('|')
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const colCount = Math.max(headerCells.length, separator.length);

  let html =
    '<div class="overflow-x-auto mb-4"><table class="min-w-full border-collapse border border-gray-300 dark:border-gray-700">';

  html += '<thead><tr>';
  for (let c = 0; c < colCount; c++) {
    const align = (separator[c] || '').startsWith(':')
      ? (separator[c] || '').endsWith(':')
        ? 'center'
        : 'left'
      : (separator[c] || '').endsWith(':')
        ? 'right'
        : 'left';
    const alignClass =
      align === 'center'
        ? 'text-center'
        : align === 'right'
          ? 'text-right'
          : 'text-left';
    html += `<th class="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2 font-semibold text-gray-900 dark:text-gray-100 ${alignClass}">${parseInline(headerCells[c] || '')}</th>`;
  }
  html += '</tr></thead><tbody>';

  for (let r = 2; r < tableLines.length; r++) {
    const cells = tableLines[r]
      .split('|')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    html += '<tr>';
    for (let c = 0; c < colCount; c++) {
      const align = (separator[c] || '').startsWith(':')
        ? (separator[c] || '').endsWith(':')
          ? 'center'
          : 'left'
        : (separator[c] || '').endsWith(':')
          ? 'right'
          : 'left';
      const alignClass =
        align === 'center'
          ? 'text-center'
          : align === 'right'
            ? 'text-right'
            : 'text-left';
      html += `<td class="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200 ${alignClass}">${parseInline(cells[c] || '')}</td>`;
    }
    html += '</tr>';
  }

  html += '</tbody></table></div>';
  return { html, end: i };
}

function parseMarkdown(md: string): string {
  const lines = md.split('\n');
  const html: string[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';
  let inOrderedList = false;
  let inUnorderedList = false;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        html.push(
          `<div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm mb-4">`
        );
        html.push(
          `<pre class="text-gray-800 dark:text-gray-100"><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`
        );
        html.push('</div>');
        codeBuffer = [];
        codeLang = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
      }
      i++;
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      i++;
      continue;
    }

    if (line.trim().startsWith('|')) {
      const { html: tableHtml, end } = parseTable(lines, i);
      if (tableHtml) {
        html.push(tableHtml);
        i = end;
        continue;
      }
    }

    if (line.startsWith('### ')) {
      html.push(
        `<h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-2">${parseInline(line.slice(4))}</h3>`
      );
    } else if (line.startsWith('## ')) {
      html.push(
        `<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">${parseInline(line.slice(3))}</h2>`
      );
    } else if (line.startsWith('# ')) {
      html.push(
        `<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-4">${parseInline(line.slice(2))}</h1>`
      );
    } else if (line.startsWith('> ')) {
      html.push(
        `<blockquote class="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-2 my-4 text-gray-600 dark:text-gray-400 italic">${parseInline(line.slice(2))}</blockquote>`
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inUnorderedList) {
        html.push('<ul class="list-disc pl-6 mb-4 space-y-1">');
        inUnorderedList = true;
      }
      html.push(`<li>${parseInline(line.slice(2))}</li>`);
      const next = lines[i + 1];
      if (!next || (!next.startsWith('- ') && !next.startsWith('* '))) {
        html.push('</ul>');
        inUnorderedList = false;
      }
    } else if (/^\d+\. /.test(line)) {
      if (!inOrderedList) {
        html.push('<ol class="list-decimal pl-6 mb-4 space-y-1">');
        inOrderedList = true;
      }
      html.push(`<li>${parseInline(line.replace(/^\d+\. /, ''))}</li>`);
      const next = lines[i + 1];
      if (!next || !/^\d+\. /.test(next)) {
        html.push('</ol>');
        inOrderedList = false;
      }
    } else if (line.startsWith('---')) {
      html.push('<hr class="my-8 border-gray-300 dark:border-gray-700" />');
    } else if (line.trim() === '') {
      // skip
    } else {
      html.push(
        `<p class="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">${parseInline(line)}</p>`
      );
    }

    i++;
  }

  if (inCodeBlock) {
    html.push(
      `<div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm mb-4"><pre class="text-gray-800 dark:text-gray-100"><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre></div>`
    );
  }

  return html.join('\n');
}

export function markdownToHtml(markdown: string, title?: string): string {
  const body = parseMarkdown(markdown);
  const pageTitle = title || 'Documentation';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <title>${escapeHtml(pageTitle)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
  <div class="max-w-3xl mx-auto px-4 py-10">
    <a href="/docs" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 inline-block">&larr; Home</a>
    ${body}
  </div>
</body>
</html>`;
}
