import DOMPurify from 'dompurify'

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['p', 'ul', 'ol', 'li', 'strong', 'em', 'code', 'pre', 'br', 'a', 'b', 'mark', 'span'],
  ALLOWED_ATTR: ['class', 'style', 'href', 'target', 'rel'],
}

export function sanitize(html) {
  return DOMPurify.sanitize(html, SANITIZE_CONFIG)
}
