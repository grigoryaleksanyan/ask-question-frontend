import DOMPurify from 'dompurify';

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

/**
 * Очищает переданный HTML-код с помощью DOMPurify.
 *
 * @param {string} html - Строка HTML, которую необходимо очистить.
 * @return {string} Возвращает очищенную версию переданной строки HTML.
 */
export default function sanitizeHtml(html) {
  return DOMPurify.sanitize(html);
}
