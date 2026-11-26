"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";

const markName = "ez:font-body ez:text-site-heading ez:normal-case";

function FitName({ name, className }: { name: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [wrap, setWrap] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const { whiteSpace, fontSize, lineHeight } = el.style;
      el.style.whiteSpace = "nowrap";
      el.style.fontSize = "inherit";
      el.style.lineHeight = "inherit";
      const over = el.scrollWidth > el.clientWidth + 1;
      el.style.whiteSpace = whiteSpace;
      el.style.fontSize = fontSize;
      el.style.lineHeight = lineHeight;
      setWrap(over);
    };
    fit();
    if (typeof ResizeObserver === "undefined") return;
    const watch = new ResizeObserver(fit);
    watch.observe(el.parentElement ?? el);
    return () => watch.disconnect();
  }, [name]);
  return (
    <span ref={ref} data-wrap={wrap || undefined} className={cn("ez:block ez:min-w-0 ez:max-lg:line-clamp-2 ez:lg:whitespace-nowrap", className, wrap && "ez:max-lg:text-site-heading")}>
      {name}
    </span>
  );
}

const MARK_RATIO = 1.6;

type Shape = "pending" | "mark" | "wide" | "failed";

function shapeOf(img: HTMLImageElement): Shape {
  if (!img.complete) return "pending";
  if (!img.naturalWidth || !img.naturalHeight) return "failed";
  return img.naturalWidth / img.naturalHeight < MARK_RATIO ? "mark" : "wide";
}

const known = new Map<string, Shape>();

function LogoImage({ name, src }: { name: string; src: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [shape, setShape] = useState<Shape>(() => known.get(src) ?? "pending");
  const settle = (next: Shape) => {
    if (next !== "pending") known.set(src, next);
    setShape(next);
  };
  useLayoutEffect(() => {
    const img = ref.current;
    if (!img || known.has(src)) return;
    const next = shapeOf(img);
    if (next !== "pending") known.set(src, next);
    setShape(next);
  }, [src]);
  if (shape === "failed") return <FitName name={name} />;
  const mark = shape === "mark";
  return (
    <span data-slot="site-logo" data-shape={shape} className="ez:flex ez:min-w-0 ez:items-center ez:gap-3">
      <img
        ref={ref}
        src={src}
        alt={mark ? "" : name}
        className="ez:block ez:h-9 ez:w-auto ez:max-w-full ez:flex-none ez:object-contain ez:object-left"
        onLoad={(e) => settle(shapeOf(e.currentTarget))}
        onError={() => settle("failed")}
      />
      {mark && <FitName name={name} className={markName} />}
    </span>
  );
}

export function SiteLogo({ name, src }: { name: string; src?: string | null }) {
  if (!src) return <FitName name={name} />;
  return <LogoImage key={src} name={name} src={src} />;
}
