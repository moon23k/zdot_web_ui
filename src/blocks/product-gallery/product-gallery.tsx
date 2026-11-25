"use client";

import { useState } from "react";
import { Photo } from "../../components/photo";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";

export function ProductGallery({ images, name }: { images: (string | null)[]; name: string }) {
  const shown = images.length ? images.slice(0, 6) : [null];
  const [at, setAt] = useState(0);
  return (
    <div data-slot="product-gallery" className="ez:grid ez:gap-3 ez:lg:grid-cols-[88px_minmax(0,1fr)] ez:lg:gap-4">
      {shown.length > 1 && (
        <div role="group" aria-label="상품 사진" className="ez:order-2 ez:flex ez:gap-3 ez:lg:order-1 ez:lg:flex-col">
          {shown.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              aria-pressed={at === i}
              aria-label={`사진 ${i + 1}`}
              onClick={() => setAt(i)}
              className={cn("ez:relative ez:m-0 ez:min-w-0 ez:flex-1 ez:cursor-pointer ez:border-0 ez:bg-transparent ez:p-0 ez:lg:w-full ez:lg:flex-none", focusRing)}
            >
              <Photo src={src} alt="" sizes="88px" tone={i} className="ez:aspect-[4/5]" />
              {at === i && (
                <span
                  aria-hidden="true"
                  data-slot="gallery-pick"
                  className="ez:pointer-events-none ez:absolute ez:inset-0 ez:box-border ez:rounded-lg ez:border ez:border-solid ez:border-primary"
                />
              )}
            </button>
          ))}
        </div>
      )}
      <div className={cn("ez:order-1 ez:lg:order-2", shown.length < 2 && "ez:lg:col-span-2")}>
        <Photo src={shown[at]} alt={name} preload sizes="(max-width: 1024px) 100vw, 640px" tone={at} className="ez:aspect-[4/5]" />
      </div>
      {shown.length > 1 && (
        <p aria-hidden="true" data-slot="gallery-count" className="ez:order-3 ez:m-0 ez:text-right ez:text-site-small ez:text-muted ez:tabular-nums ez:lg:col-start-2">
          {at + 1} / {shown.length}
        </p>
      )}
    </div>
  );
}
