export function reviewWord(main?: string | null): "리뷰" | "후기" {
  return main === "shop" ? "리뷰" : "후기";
}
