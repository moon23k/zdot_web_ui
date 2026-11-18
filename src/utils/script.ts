const pending = new Map<string, Promise<void>>();

export function loadScript(src: string, ready: () => boolean): Promise<void> {
  if (ready()) return Promise.resolve();
  const found = pending.get(src);
  if (found) return found;
  const loading = new Promise<void>((resolve, reject) => {
    const tag = document.createElement("script");
    tag.src = src;
    tag.onload = () => resolve();
    tag.onerror = () => {
      pending.delete(src);
      tag.remove();
      reject(new Error(src));
    };
    document.head.appendChild(tag);
  });
  pending.set(src, loading);
  return loading;
}
