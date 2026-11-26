"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "../../components/button";
import { Field, TextArea } from "../../components/field";
import { Photo } from "../../components/photo";
import { STAR_PATH } from "../../components/star-row";
import type { FormAction, FormState } from "../../types";
import { cn } from "../../utils/cn";
import { fieldset, legend } from "../parts/choice";
import { form } from "../parts/form";
import { Notice } from "../parts/notice";
import { scriptOf } from "../../utils/writing";

export function ReviewForm({
  orderItemId,
  productName,
  option,
  imageSrc,
  action,
  word = "후기",
}: {
  orderItemId: string;
  productName: string;
  option?: string | null;
  imageSrc?: string | null;
  action: FormAction;
  word?: string;
}) {
  const [state, submit, pending] = useActionState<FormState, FormData>(action, {});
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const box = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const typed = box.current?.querySelector("textarea")?.value;
    const picked = box.current?.querySelector<HTMLInputElement>('input[name="rating"]:checked')?.value;
    if (typed) setBody(typed);
    if (picked) setRating(Number(picked));
  }, []);
  if (state.ok) return <Notice>{productName} {word}를 남겼어요.</Notice>;
  return (
    <form ref={box} data-slot="review-form" action={submit} className={form}>
      <input type="hidden" name="order_item_id" value={orderItemId} />
      <div className="ez:flex ez:items-center ez:gap-3">
        {imageSrc !== undefined && <Photo src={imageSrc} alt="" sizes="40px" className="ez:w-10 ez:shrink-0 ez:aspect-[4/5]" />}
        <span className="ez:grid">
          <span>{productName}</span>
          {option && <span data-script={scriptOf(option)} className="ez:text-site-small ez:text-muted">{option}</span>}
        </span>
      </div>
      <fieldset className={fieldset}>
        <legend className={legend}>별점</legend>
        <div className="ez:-ml-1 ez:flex">
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              data-star={n <= rating ? "on" : undefined}
              className={cn(
                "ez:flex ez:size-11 ez:cursor-pointer ez:items-center ez:justify-center ez:rounded-md",
                "ez:has-focus-visible:outline-2 ez:has-focus-visible:outline-primary",
                n <= rating ? "ez:text-primary" : "ez:text-site-field",
              )}
            >
              <input type="radio" name="rating" value={n} required checked={rating === n} onChange={() => setRating(n)} className="ez:sr-only" />
              <span className="ez:sr-only">{n}점</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="ez:size-8">
                <path fill="currentColor" d={STAR_PATH} />
              </svg>
            </label>
          ))}
        </div>
      </fieldset>
      <Field label={word} hint={<>5자 이상 · <span className="ez:tabular-nums">{`${body.length.toLocaleString("ko-KR")} / 2,000`}</span></>}>
        <TextArea name="body" required minLength={5} maxLength={2000} value={body} onChange={(e) => setBody(e.target.value)} />
      </Field>
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <Button type="submit" block disabled={pending || !rating || body.trim().length < 5}>
        {word} 등록
      </Button>
    </form>
  );
}
