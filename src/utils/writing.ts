const HANGUL = /[가-힣ᄀ-ᇿ㄰-㆏]/;

const LATIN = /[A-Za-z]/;

export function scriptOf(text: unknown): "latin" | undefined {
  if (typeof text !== "string" || HANGUL.test(text)) return undefined;
  return LATIN.test(text) ? "latin" : undefined;
}
