"use client";

import NextLink from "next/link";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useState, useSyncExternalStore } from "react";
import { ButtonLink } from "../../components/button";
import { overlaySurface } from "../../components/dialog/dialog";
import { Icon } from "../../components/icon";
import { Photo } from "../../components/photo";
import { cn } from "../../utils/cn";
import { focusRing, textLink } from "../../utils/styles";
import { kstToday } from "../../utils/format";
import { popupStyleOf, type PopupSize, type PopupStyleSetting } from "./style";

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
  return read(local, HIDE_TODAY + key) === kstToday() || Boolean(read(session, CLOSED + key));
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

const CENTER_WIDTH: Record<PopupSize, { box: string; photo: string; pane: string; plain: string }> = {
  sm: { box: "ez:max-w-96", photo: "ez:lg:h-96 ez:lg:w-160", pane: "ez:lg:w-80", plain: "ez:lg:w-100" },
  md: { box: "ez:max-w-112", photo: "ez:lg:h-120 ez:lg:w-200", pane: "ez:lg:w-100", plain: "ez:lg:w-120" },
  lg: { box: "ez:max-w-128", photo: "ez:lg:h-144 ez:lg:w-240", pane: "ez:lg:w-120", plain: "ez:lg:w-140" },
};

const CARD_WIDTH: Record<PopupSize, string> = { sm: "ez:lg:w-80", md: "ez:lg:w-96", lg: "ez:lg:w-112" };

const lift = "ez:border ez:border-solid ez:border-site-edge";

const rise = "ez:shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.2)]";

const quiet = cn(plain, "ez:min-h-11 ez:rounded-sm ez:px-4 ez:text-site-small ez:text-muted", focusRing);

export function StorePopup({ popups, store, shape, preview = false }: { popups: StorePopupItem[]; store?: string; shape?: PopupStyleSetting | null; preview?: boolean }) {
  const [dismissed, setDismissed] = useState(false);
  const [at, setAt] = useState(0);
  const items = popups.slice(0, 3);
  const scope = () => store ?? window.location.host;
  const blocked = useSyncExternalStore(idle, () => hidden(scope()), () => true);
  const open = preview || (!blocked && !dismissed);
  const look = popupStyleOf(shape);

  if (!items.length) return null;
  const item = items[Math.min(at, items.length - 1)];
  const many = items.length > 1;
  const photo = Boolean(item.image_url);

  const close = () => {
    if (preview) return;
    write(session, CLOSED + scope(), "1");
    setDismissed(true);
  };
  const hideToday = () => {
    if (preview) return;
    write(local, HIDE_TODAY + scope(), kstToday());
    setDismissed(true);
  };
  const step = (by: number) => setAt((at + by + items.length) % items.length);
  const free = look.overlay ? {} : { onInteractOutside: (e: Event) => e.preventDefault(), onOpenAutoFocus: (e: Event) => e.preventDefault() };
  const external = item.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const today = look.hide_today && (
    <button type="button" onClick={hideToday} className={quiet}>
      오늘 하루 열지 않기
    </button>
  );
  const title = (className: string) => <DialogPrimitive.Title className={cn("ez:m-0 ez:text-fg", className)}>{item.title}</DialogPrimitive.Title>;
  const body = (className: string) => item.body && <DialogPrimitive.Description className={cn("ez:m-0 ez:text-muted", className)}>{item.body}</DialogPrimitive.Description>;
  const go = (className?: string) =>
    item.href && (
      <NextLink href={item.href} onClick={close} className={cn(textLink, "ez:pb-0.5 ez:text-site-small", focusRing, className)} {...external}>
        보러 가기
        <Icon name="right" size="sm" />
      </NextLink>
    );
  const shut = (
    <DialogPrimitive.Close className={quiet} onClick={(e) => preview && e.preventDefault()}>
      닫기
    </DialogPrimitive.Close>
  );
  const props = {
    "data-slot": "store-popup",
    "data-photo": photo ? "" : undefined,
    "data-position": look.position === "center" ? undefined : look.position,
    ...(item.body ? {} : { "aria-describedby": undefined }),
    ...free,
  };

  let content;
  if (look.position === "bar") {
    content = (
      <DialogPrimitive.Content {...props} className={cn(overlaySurface, rise, "ez:fixed ez:inset-x-0 ez:bottom-0 ez:z-50 ez:border-0 ez:border-t ez:border-solid ez:border-site-edge ez:focus:outline-none")}>
        <div className="ez:mx-auto ez:box-border ez:grid ez:max-w-wrap ez:grid-cols-[auto_minmax(0,1fr)] ez:items-center ez:gap-x-4 ez:gap-y-1 ez:px-page ez:pt-3 ez:pb-1 ez:lg:flex ez:lg:py-3">
          {photo && <Photo src={item.image_url} alt="" tone={0} sizes="56px" className="ez:size-14 ez:shrink-0 ez:aspect-square ez:rounded-sm ez:lg:size-12" />}
          <div className={cn("ez:grid ez:min-w-0 ez:gap-0.5 ez:lg:flex ez:lg:flex-1 ez:lg:items-baseline ez:lg:gap-3", !photo && "ez:col-span-2")}>
            {title("ez:truncate ez:text-site-lead ez:font-normal")}
            {body("ez:line-clamp-2 ez:text-site-small ez:lg:truncate")}
          </div>
          {go(cn("ez:shrink-0 ez:justify-self-start", photo && "ez:col-start-2"))}
          <div className="ez:col-span-2 ez:-mx-4 ez:flex ez:items-center ez:justify-between ez:lg:mr-0 ez:lg:ml-auto ez:lg:shrink-0 ez:lg:justify-end">
            {today || <span />}
            <span className="ez:flex ez:items-center">
              {many && <Pager count={items.length} at={at} onStep={step} overlay={false} />}
              {shut}
            </span>
          </div>
        </div>
      </DialogPrimitive.Content>
    );
  } else if (look.position === "bottom") {
    content = (
      <DialogPrimitive.Content
        {...props}
        className={cn(
          overlaySurface,
          lift,
          rise,
          "ez:fixed ez:inset-x-0 ez:bottom-0 ez:z-50 ez:flex ez:max-h-[calc(100dvh-2rem)] ez:flex-col ez:overflow-y-auto ez:rounded-t-lg ez:border-b-0 ez:focus:outline-none ez:lg:inset-x-auto ez:lg:right-6 ez:lg:bottom-6 ez:lg:overflow-hidden ez:lg:rounded-lg ez:lg:border-b ez:lg:shadow-2xl",
          CARD_WIDTH[look.size],
        )}
      >
        <div className="ez:flex ez:gap-4 ez:p-5 ez:lg:flex-col ez:lg:gap-0 ez:lg:p-0">
          {photo && (
            <Photo
              src={item.image_url}
              alt=""
              tone={0}
              sizes="(min-width: 1024px) 448px, 96px"
              className="ez:size-24 ez:shrink-0 ez:aspect-square ez:rounded-md ez:lg:size-auto ez:lg:w-full ez:lg:aspect-[3/2] ez:lg:rounded-none"
            />
          )}
          <div className="ez:flex ez:min-w-0 ez:flex-col ez:items-start ez:gap-1.5 ez:lg:px-6 ez:lg:pt-5 ez:lg:pb-4">
            {title("ez:text-site-item ez:font-normal ez:text-balance")}
            {body("ez:whitespace-pre-line ez:text-site-body")}
            {go("ez:mt-2")}
          </div>
        </div>
        <div className="ez:flex ez:min-h-11 ez:items-center ez:justify-between ez:gap-2 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:px-1 ez:py-1 ez:lg:px-2">
          {today || <span />}
          {many && <Pager count={items.length} at={at} onStep={step} overlay={false} />}
          {shut}
        </div>
      </DialogPrimitive.Content>
    );
  } else {
    const width = CENTER_WIDTH[look.size];
    content = (
      <DialogPrimitive.Content
        {...props}
        className={cn(
          overlaySurface,
          "ez:fixed ez:top-1/2 ez:left-1/2 ez:z-50 ez:flex ez:max-h-[calc(100dvh-2rem)] ez:w-[calc(100%-2rem)] ez:-translate-x-1/2 ez:-translate-y-1/2 ez:flex-col ez:overflow-y-auto ez:rounded-lg ez:focus:outline-none",
          width.box,
          !look.overlay && cn(lift, "ez:shadow-2xl"),
          photo ? cn(width.photo, "ez:lg:max-w-none ez:lg:flex-row ez:lg:overflow-hidden") : cn(width.plain, "ez:lg:max-w-none"),
        )}
      >
        {photo && (
          <div className={cn("ez:relative ez:shrink-0 ez:lg:h-full", width.pane)}>
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
          <DialogPrimitive.Close
            aria-label="닫기"
            onClick={(e) => preview && e.preventDefault()}
            className={cn(plain, "ez:absolute ez:top-2 ez:right-2 ez:inline-flex ez:size-11 ez:items-center ez:justify-center ez:rounded-sm ez:text-muted", focusRing)}
          >
            <Icon name="x" size="sm" />
          </DialogPrimitive.Close>
          <div className="ez:flex ez:flex-1 ez:flex-col ez:items-start ez:justify-center ez:gap-2.5 ez:px-6 ez:pt-14 ez:pb-4 ez:lg:px-10 ez:lg:pt-12 ez:lg:pb-6">
            {title("ez:text-site-title ez:text-balance")}
            {body("ez:whitespace-pre-line ez:text-site-body")}
            {item.href && (
              <ButtonLink href={item.href} className="ez:mt-5" onClick={close} {...external}>
                보러 가기
                <Icon name="right" size="sm" />
              </ButtonLink>
            )}
          </div>
          {(today || (many && !photo)) && (
            <div className="ez:flex ez:min-h-11 ez:items-center ez:justify-between ez:gap-2 ez:px-2 ez:pb-2 ez:lg:px-6 ez:lg:pb-3">
              {today || <span />}
              {many && !photo && <Pager count={items.length} at={at} onStep={step} overlay={false} />}
            </div>
          )}
        </div>
      </DialogPrimitive.Content>
    );
  }

  return (
    <DialogPrimitive.Root open={open} modal={look.overlay} onOpenChange={(next) => (next ? setDismissed(false) : close())}>
      <DialogPrimitive.Portal>
        {look.overlay && <DialogPrimitive.Overlay className="ez:fixed ez:inset-0 ez:z-50 ez:bg-overlay" />}
        {content}
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
