"use client";

import { useState } from "react";
import { Photo } from "../../components/photo";
import { cn } from "../../utils/cn";
import { figure, focusRing } from "../../utils/styles";

export function ProductGallery({ images, name }: { images: (string | null)[]; name: string }) {
  const shown = images.length ? images.slice(0, 6) : [null];
  const [at, setAt] = useState(0);
  return (
    <div data-slot="product-gallery" className="ez:grid ez:gap-3 ez:lg:grid-cols-[88px_minmax(0,1fr)] ez:lg:gap-4">
      {shown.length > 1 && (
        <div role="tablist" aria-label="상품 사진" className="ez:order-2 ez:flex ez:gap-3 ez:overflow-x-auto ez:lg:order-1 ez:lg:flex-col">
          {shown.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              role="tab"
              aria-selected={at === i}
              aria-label={`사진 ${i + 1}`}
              onClick={() => setAt(i)}
              className={cn(
                "ez:m-0 ez:w-18 ez:shrink-0 ez:cursor-pointer ez:border-0 ez:bg-transparent ez:p-0 ez:lg:w-full",
                at === i && "ez:outline ez:outline-1 ez:outline-primary ez:outline-offset-3",
                focusRing,
              )}
            >
              <Photo src={src} alt="" sizes="88px" tone={i} className="ez:aspect-[4/5]" />
            </button>
          ))}
        </div>
      )}
      <div className={cn("ez:relative ez:order-1 ez:lg:order-2", shown.length < 2 && "ez:lg:col-span-2")}>
        <Photo src={shown[at]} alt={name} preload sizes="(max-width: 1024px) 100vw, 640px" tone={at} className="ez:aspect-[4/5]" />
        {shown.length > 1 && (
          <span aria-hidden="true" className={cn(figure, "ez:absolute ez:right-5 ez:bottom-4 ez:text-site-counter")}>
            {at + 1} / {shown.length}
          </span>
        )}
      </div>
    </div>
  );
}
