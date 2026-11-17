import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export function Field({
  label,
  hint,
  error,
  wide,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  wide?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div data-slot="field" className={cn("ez:grid ez:content-start ez:gap-2 ez:text-fg", wide && "ez:md:col-span-2", className)}>
      <label className="ez:grid ez:gap-2">
        <span className="ez:text-site-small ez:text-muted">{label}</span>
        {children}
      </label>
      {hint && !error && <span className="ez:text-site-caption ez:text-muted">{hint}</span>}
      {error && (
        <span className="ez:text-site-caption ez:text-danger" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

const control = cn(
  "ez:box-border ez:w-full ez:m-0 ez:px-0 ez:py-2.5 ez:rounded-none ez:border-0 ez:border-b ez:border-solid ez:border-site-field",
  "ez:bg-transparent ez:text-fg ez:font-body ez:text-site-lead ez:placeholder:text-muted/65",
  "ez:disabled:opacity-45 ez:aria-invalid:border-danger ez:outline-none ez:focus-visible:border-primary",
);

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input data-slot="input" className={cn(control, "ez:min-h-(--ezd-control)", className)} {...rest} />;
}

export function TextArea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea data-slot="textarea" className={cn(control, "ez:min-h-33 ez:resize-y ez:rounded-md ez:border ez:border-site-line ez:px-4.5 ez:py-4", className)} {...rest} />;
}
