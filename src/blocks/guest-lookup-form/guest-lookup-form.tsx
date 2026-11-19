"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "../../components/button";
import { Field, Input } from "../../components/field";
import type { FormAction, FormState } from "../../types";
import { Notice } from "../parts/notice";
import { form } from "../parts/form";

export function GuestLookupForm({ action }: { action: FormAction }) {
  const [state, submit, pending] = useActionState<FormState, FormData>(action, {});
  const [number, setNumber] = useState("");
  const [phone, setPhone] = useState("");
  const box = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const typed = (name: string) => box.current?.querySelector<HTMLInputElement>(`input[name="${name}"]`)?.value;
    setNumber((v) => v || typed("number") || "");
    setPhone((v) => v || typed("phone") || "");
  }, []);
  useEffect(() => {
    if (state.redirect) window.location.assign(state.redirect);
  }, [state.redirect]);
  return (
    <form ref={box} data-slot="guest-lookup-form" action={submit} className={form}>
      <Field label="주문번호">
        <Input name="number" required placeholder="20261022-00001" value={number} onChange={(e) => setNumber(e.target.value)} />
      </Field>
      <Field label="주문할 때 넣은 휴대폰 번호">
        <Input name="phone" required inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </Field>
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <Button type="submit" block disabled={pending}>
        주문 조회
      </Button>
    </form>
  );
}
