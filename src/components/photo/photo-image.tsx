"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

export function PhotoImage({
  src,
  alt,
  sizes,
  preload,
  fallback,
}: {
  src: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  fallback?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return fallback ?? null;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      className="ez:object-cover"
      onError={() => setFailed(true)}
    />
  );
}
