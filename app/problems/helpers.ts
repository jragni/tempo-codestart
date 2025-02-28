/**
 * Problem helpers
 */

export function convertSlugToProblemTitle(title: string) {
  return title.split('-').map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

