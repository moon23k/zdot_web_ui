"use client";

import { useActionState, useEffect } from "react";
import { Button } from "../../components/button";
import { Field, Input } from "../../components/field";
import type { FormAction, FormState } from "../../types";
import { Notice } from "../parts/notice";
import { form } from "../parts/form";

export function GuestLookupForm({ action }: { action: FormAction }) {
  const [state, submit, pending] = useActionState<FormState, FormData>(action, {});
  useEffect(() => {
    if (state.redirect) window.location.assign(state.redirect);
  }, [state.redirect]);
  return (
    <form data-slot="guest-lookup-form" action={submit} className={form}>
      <Field label="주문번호">
        <Input name="number" required placeholder="20261022-00001" />
      </Field>
      <Field label="주문할 때 넣은 휴대폰 번호">
        <Input name="phone" required inputMode="tel" />
      </Field>
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <Button type="submit" block disabled={pending}>
        주문 조회
      </Button>
    </form>
  );
}
