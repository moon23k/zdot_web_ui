"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";

function FitName({ name }: { name: string }) {
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
    <span ref={ref} data-wrap={wrap || undefined} className={cn("ez:block ez:max-lg:line-clamp-2 ez:lg:whitespace-nowrap", wrap && "ez:max-lg:text-site-heading")}>
      {name}
    </span>
  );
}

export function SiteLogo({ name, src }: { name: string; src?: string | null }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <FitName name={name} />;
  return <img src={src} alt={name} className="ez:block ez:h-9 ez:w-auto ez:max-w-full ez:object-contain ez:object-left" onError={() => setFailed(true)} />;
}
