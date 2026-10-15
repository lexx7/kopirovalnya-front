let counter = 0;

/**
 * Уникальный ключ для элементов списков (только для React key, не криптостойкий).
 * Работает вне secure context (http), в отличие от crypto.randomUUID().
 */
export function nextKey(): string {
  counter += 1;
  return `k${counter}`;
}
