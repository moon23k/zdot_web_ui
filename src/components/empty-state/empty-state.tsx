import type { ReactNode } from "react";
import { cn } from "../../utils/cn";
import { Button, ButtonLink } from "../button/button";

export const emptyAction = "ez:min-h-11 ez:px-6 ez:text-site-lead";

const ALIGN = {
  center: "ez:justify-items-center ez:px-4 ez:text-center",
  start: "ez:justify-items-start ez:p-0 ez:text-left",
} as const;

export type EmptyStateAlign = keyof typeof ALIGN;

export type EmptyStateAction = { label: string; icon?: ReactNode } & ({ href: string; onPress?: never } | { onPress: () => void; href?: never });

function Action({ action }: { action: EmptyStateAction }) {
  const body = (
    <>
      {action.icon}
      {action.label}
    </>
  );
  return action.href ? (
    <ButtonLink href={action.href} variant="outline" className={emptyAction}>
      {body}
    </ButtonLink>
  ) : (
    <Button variant="outline" onClick={action.onPress} className={emptyAction}>
      {body}
    </Button>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  align = "center",
  className,
  children,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: EmptyStateAction;
  align?: EmptyStateAlign;
  className?: string;
  children?: ReactNode;
}) {
  const start = align === "start";
  if (!icon) {
    return (
      <div data-slot="empty-state" data-align={align} className={cn("ez:grid ez:gap-4 ez:py-12", ALIGN[align], className)}>
        <div className="ez:grid ez:gap-1">
          <p className={cn("ez:m-0", start ? "ez:font-normal ez:text-muted" : "ez:font-normal ez:text-fg")}>{title}</p>
          {description && <p className="ez:m-0 ez:text-site-small ez:text-muted">{description}</p>}
        </div>
        {action && <Action action={action} />}
        {children}
      </div>
    );
  }
  return (
    <div data-slot="empty-state" data-align={align} className={cn("ez:grid ez:gap-4 ez:py-10", ALIGN[align], className)}>
      <div className="ez:flex ez:size-28 ez:items-center ez:justify-center ez:rounded-[calc(var(--ezd-radius-lg)*1.4)] ez:bg-[color-mix(in_oklab,var(--ezd-primary)_var(--ezd-halo),transparent)]">
        <div className="ez:flex ez:size-20 ez:items-center ez:justify-center ez:rounded-lg ez:bg-primary/10 ez:text-primary">{icon}</div>
      </div>
      <div className="ez:grid ez:gap-1">
        <h2 className="ez:m-0 ez:font-body ez:text-site-body ez:font-normal ez:text-fg">{title}</h2>
        {description && <p className="ez:m-0 ez:text-site-small ez:text-muted">{description}</p>}
      </div>
      {action && <Action action={action} />}
      {children}
    </div>
  );
}
