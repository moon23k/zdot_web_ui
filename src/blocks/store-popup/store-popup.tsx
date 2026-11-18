"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import { useState, useSyncExternalStore } from "react";
import { ButtonLink } from "../../components/button";
import { overlaySurface } from "../../components/dialog/dialog";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import { cn } from "../../utils/cn";
import { focusRing } from "../../utils/styles";

export type StorePopupItem = {
  id: string;
  title: string;
  body: string | null;
  image_url: string | null;
  href: string | null;
  external: boolean;
};

const HIDE_TODAY = "ez-popup-today:";
const CLOSED = "ez-popup-closed:";

function today(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function read(storage: () => Storage, key: string): string | null {
  try {
    return storage().getItem(key);
  } catch {
    return null;
  }
}

function write(storage: () => Storage, key: string, value: string) {
  try {
    storage().setItem(key, value);
  } catch {
    return;
  }
}

const local = () => window.localStorage;
const session = () => window.sessionStorage;

const idle = () => () => {};

function hidden(key: string): boolean {
  return read(local, HIDE_TODAY + key) === today() || Boolean(read(session, CLOSED + key));
}

const plain = "ez:m-0 ez:border-0 ez:bg-transparent ez:p-0 ez:font-body ez:cursor-pointer";

function Pager({ count, at, onStep, overlay }: { count: number; at: number; onStep: (by: number) => void; overlay: boolean }) {
  const arrow = cn(
    plain,
    "ez:inline-flex ez:size-11 ez:items-center ez:justify-center ez:rounded-full",
    overlay ? "ez:bg-surface/80 ez:text-fg" : "ez:text-muted",
    focusRing,
  );
  const dots = (
    <span aria-hidden="true" className={cn("ez:flex ez:justify-center ez:gap-1.5", overlay && "ez:absolute ez:inset-x-0 ez:bottom-4")}>
      {Array.from({ length: count }, (_, i) => (
        <i
          key={i}
          data-on={i === at ? "" : undefined}
          className={cn(
            "ez:size-1.5 ez:rounded-full",
            overlay ? (i === at ? "ez:bg-surface" : "ez:bg-surface/50") : i === at ? "ez:bg-muted" : "ez:bg-site-edge",
          )}
        />
      ))}
    </span>
  );
  const prev = (
    <button type="button" aria-label="이전" onClick={() => onStep(-1)} className={cn(arrow, overlay && "ez:absolute ez:top-1/2 ez:left-3 ez:-translate-y-1/2")}>
      <Icon name="back" size="sm" />
    </button>
  );
  const next = (
    <button type="button" aria-label="다음" onClick={() => onStep(1)} className={cn(arrow, overlay && "ez:absolute ez:top-1/2 ez:right-3 ez:-translate-y-1/2")}>
      <Icon name="next" size="sm" />
    </button>
  );
  if (overlay) {
    return (
      <>
        {prev}
        {next}
        {dots}
      </>
    );
  }
  return (
    <span className="ez:flex ez:items-center ez:gap-1">
      {prev}
      {dots}
      {next}
    </span>
  );
}

export function StorePopup({ popups, store }: { popups: StorePopupItem[]; store?: string }) {
  const [dismissed, setDismissed] = useState(false);
  const [at, setAt] = useState(0);
  const items = popups.slice(0, 3);
  const scope = () => store ?? window.location.host;
  const blocked = useSyncExternalStore(idle, () => hidden(scope()), () => true);
  const open = !blocked && !dismissed;

  if (!items.length) return null;
  const item = items[Math.min(at, items.length - 1)];
  const many = items.length > 1;
  const photo = Boolean(item.image_url);

  const close = () => {
    write(session, CLOSED + scope(), "1");
    setDismissed(true);
  };
  const hideToday = () => {
    write(local, HIDE_TODAY + scope(), today());
    setDismissed(true);
  };
  const step = (by: number) => setAt((at + by + items.length) % items.length);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => (next ? setDismissed(false) : close())}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="ez:fixed ez:inset-0 ez:z-50 ez:bg-overlay" />
        <DialogPrimitive.Content
          data-slot="store-popup"
          data-photo={photo ? "" : undefined}
          {...(item.body ? {} : { "aria-describedby": undefined })}
          className={cn(
            overlaySurface,
            "ez:fixed ez:top-1/2 ez:left-1/2 ez:z-50 ez:flex ez:max-h-[calc(100dvh-2rem)] ez:w-[calc(100%-2rem)] ez:max-w-112 ez:-translate-x-1/2 ez:-translate-y-1/2 ez:flex-col ez:overflow-y-auto ez:rounded-lg ez:focus:outline-none",
            photo ? "ez:lg:h-120 ez:lg:w-200 ez:lg:max-w-none ez:lg:flex-row ez:lg:overflow-hidden" : "ez:lg:w-120 ez:lg:max-w-none",
          )}
        >
          {photo && (
            <div className="ez:relative ez:shrink-0 ez:lg:h-full ez:lg:w-100">
              <Photo
                src={item.image_url}
                alt=""
                tone={0}
                sizes="(min-width: 1024px) 400px, 448px"
                className="ez:aspect-[3/2] ez:rounded-none ez:lg:aspect-auto ez:lg:h-full"
              />
              {many && <Pager count={items.length} at={at} onStep={step} overlay />}
            </div>
          )}
          <div className="ez:relative ez:flex ez:min-w-0 ez:flex-1 ez:flex-col">
            <DialogPrimitive.Close aria-label="닫기" className={cn(plain, "ez:absolute ez:top-2 ez:right-2 ez:inline-flex ez:size-11 ez:items-center ez:justify-center ez:rounded-sm ez:text-muted", focusRing)}>
              <Icon name="x" size="sm" />
            </DialogPrimitive.Close>
            <div className="ez:flex ez:flex-1 ez:flex-col ez:items-start ez:justify-center ez:gap-2.5 ez:px-6 ez:pt-14 ez:pb-4 ez:lg:px-10 ez:lg:pt-12 ez:lg:pb-6">
              <DialogPrimitive.Title className="ez:m-0 ez:text-site-title ez:text-fg ez:text-balance">{item.title}</DialogPrimitive.Title>
              {item.body && <DialogPrimitive.Description className="ez:m-0 ez:whitespace-pre-line ez:text-site-body ez:text-muted">{item.body}</DialogPrimitive.Description>}
              {item.href && (
                <ButtonLink
                  href={item.href}
                  className="ez:mt-5"
                  onClick={close}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  보러 가기
                  <Icon name="right" size="sm" />
                </ButtonLink>
              )}
            </div>
            <div className="ez:flex ez:min-h-11 ez:items-center ez:justify-between ez:gap-2 ez:px-2 ez:pb-2 ez:lg:px-6 ez:lg:pb-3">
              <button type="button" onClick={hideToday} className={cn(plain, "ez:min-h-11 ez:rounded-sm ez:px-4 ez:text-site-small ez:text-muted", focusRing)}>
                오늘 하루 열지 않기
              </button>
              {many && !photo && <Pager count={items.length} at={at} onStep={step} overlay={false} />}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
