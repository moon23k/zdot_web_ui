"use client";

import { clsx } from "clsx";
import { useActionState, useEffect } from "react";
import type { FormAction, FormState } from "../../types";
import { focusRing } from "../../utils/styles";
import { Notice } from "../parts/notice";

export function LogoutButton({ action }: { action: FormAction }) {
  const [state, submit, pending] = useActionState<FormState, FormData>(action, {});
  useEffect(() => {
    if (state.redirect) window.location.assign(state.redirect);
  }, [state.redirect]);
  return (
    <form action={submit}>
      <button
        type="submit"
        disabled={pending}
        className={clsx(
          "ez:m-0 ez:cursor-pointer ez:border-0 ez:border-b ez:border-solid ez:border-site-faint ez:bg-transparent ez:p-0 ez:pb-0.5 ez:font-body ez:text-site-small ez:text-muted ez:hover:text-fg ez:disabled:cursor-not-allowed",
          focusRing,
        )}
      >
        로그아웃
      </button>
      {state.error && <Notice tone="error">{state.error}</Notice>}
    </form>
  );
}
