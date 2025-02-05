export function highlightText(text: string, searchTerm: string) {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      return `<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-1">${part}</mark>`;
    }
    return part;
  }).join('');
} 