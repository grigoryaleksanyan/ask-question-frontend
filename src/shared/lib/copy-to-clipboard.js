export default function copyToClipboard(textToCopy) {
  // для API Clipboard необходим безопасный контекст
  if (window.isSecureContext && navigator.clipboard) {
    return navigator.clipboard.writeText(textToCopy);
  }

  // если API Clipboard недоступен, то пробуем через устаревший document.execCommand
  return new Promise((resolve, reject) => {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;

    // убираем прокрутку страницы
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      resolve();
    } catch {
      reject();
    }
  });
}
