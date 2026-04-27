function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function sanitizeInput(str: string): string {
  if (typeof str !== 'string') return '';
  return escapeHtml(str.trim());
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}
