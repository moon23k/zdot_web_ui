"use client";

import { useState } from "react";
import { Field, Input } from "../../components/field";
import { cn } from "../../utils/cn";
import { Choice, fieldset, legend } from "../parts/choice";
import { CHECKOUT_NOTES, type CheckoutNote } from "./setting";

const CUSTOM = "custom";

export function RequestNote({
  label,
  notes = [],
  custom = true,
  name = "request_note",
  maxLength = 200,
}: {
  label: string;
  notes?: CheckoutNote[];
  custom?: boolean;
  name?: string;
  maxLength?: number;
}) {
  const [pick, setPick] = useState<string | null>(null);
  if (!notes.length) {
    return custom ? (
      <Field label={label} wide>
        <Input name={name} maxLength={maxLength} />
      </Field>
    ) : null;
  }
  const row = "ez:py-2.5";
  const options = [...notes.map((note) => ({ value: note, label: CHECKOUT_NOTES[note] })), ...(custom ? [{ value: CUSTOM, label: "직접 입력" }] : [])];
  const chosen = notes.find((note) => note === pick);
  return (
    <fieldset data-slot="request-note" className={cn(fieldset, "ez:gap-0 ez:md:col-span-2")}>
      <legend className={legend}>{label}</legend>
      {options.map((option) => (
        <Choice
          key={option.value}
          type="radio"
          name={`${name}_pick`}
          value={option.value}
          checked={pick === option.value}
          onChange={() => setPick(option.value)}
          label={option.label}
          className={row}
        />
      ))}
      {chosen && <input type="hidden" name={name} value={CHECKOUT_NOTES[chosen]} />}
      {pick === CUSTOM && <Input name={name} maxLength={maxLength} aria-label="직접 입력" />}
    </fieldset>
  );
}
