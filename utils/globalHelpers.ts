/**
 * globalHelpers
 */

export function snakeToCamelCase(str: string) {
  return str.split('_').reduce((acc, word, index) => {
    if (index === 0) {
      return word;
    }
    return acc + word.charAt(0).toUpperCase() + word.slice(1);
  }, '');
}

export function camelCaseData(object: Record<string, any>) {
  if (!object) return null;
  return Object.keys(object).reduce((acc: Record<string,any>, key) => {
    const newKey = snakeToCamelCase(key);
    acc[newKey] = object[key];
    return acc;
  }, {});
}