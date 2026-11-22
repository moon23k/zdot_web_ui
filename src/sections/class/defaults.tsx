import NextLink from "next/link";
import { SessionList } from "../template/class";
import { CLASS_TITLE } from "./shared";
import type { ClassListProps } from "./types";

export function StandInList({ view, title, classes, sessions, links }: ClassListProps) {
  return (
    <div data-slot="class-catalog" className="ez:grid ez:gap-8 ez:text-fg">
      <h1 className="ez:m-0">{title}</h1>
      {view === "schedule" ? (
        <SessionList sessions={sessions} />
      ) : (
        <ul className="ez:m-0 ez:grid ez:list-none ez:gap-4 ez:p-0 ez:md:grid-cols-3">
          {classes.map((c) => (
            <li key={c.id}>
              <NextLink href={c.href ?? `/products/${c.id}`} className="ez:text-fg">
                {c.name}
              </NextLink>
              <span className="ez:block ez:text-site-small ez:text-muted">{[c.price, c.next].filter(Boolean).join(" · ")}</span>
            </li>
          ))}
        </ul>
      )}
      <NextLink href={view === "schedule" ? links.classes : links.schedule} className="ez:text-site-small ez:text-fg">
        {view === "schedule" ? CLASS_TITLE.all : CLASS_TITLE.scheduleAll}
      </NextLink>
    </div>
  );
}
