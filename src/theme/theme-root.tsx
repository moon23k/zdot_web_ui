import type { ReactNode } from "react";
import type { TemplateDesign } from "../templates/types";
import type { Design } from "../types";
import { nightTheme, type NightTheme } from "./night";
import { applyTemplate, designVars, fontHref } from "./tokens";

export function ThemeRoot({
  design: brand,
  template,
  night,
  children,
}: {
  design?: Design | null;
  template?: TemplateDesign | null;
  night?: NightTheme | null;
  children: ReactNode;
}) {
  const design = applyTemplate(brand, template, night);
  const glow = template?.skin === "night" ? nightTheme(night) : undefined;
  const css = `:root{${Object.entries(designVars(design, template ? { ...template.look, skin: template.skin, night: glow } : false))
    .map(([name, value]) => `${name}:${value.replace(/[<>{};]/g, "")}`)
    .join(";")}}`;
  const href = fontHref(design);
  return (
    <>
      {href && <FontSheet href={href} />}
      <style>{css}</style>
      <div className="ez-root" data-template={template?.id} data-frame={template ? "gallery" : undefined} data-skin={template?.skin} data-night-theme={glow}>{children}</div>
    </>
  );
}

function FontSheet({ href }: { href: string }) {
  const load = `(function(){var l=document.createElement("link");l.rel="stylesheet";l.media="print";l.onload=function(){l.media="all"};l.href=${JSON.stringify(href).replace(/</g, "\\u003c")};document.head.appendChild(l)})()`;
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <script dangerouslySetInnerHTML={{ __html: load }} />
      <noscript>
        <link rel="stylesheet" href={href} />
      </noscript>
    </>
  );
}
