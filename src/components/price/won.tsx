import { won } from "../../utils/format";

const PRICE = /^(\d[\d,]*\s*)(만원|원)$/;

export function Won({ value, amount }: { value?: string | null; amount?: number | null }) {
  const text = amount != null ? won(amount) : value;
  if (text == null) return null;
  const parts = PRICE.exec(text);
  if (!parts) return text;
  return (
    <span data-slot="won">
      {parts[1]}
      <span className="ez-won-unit">{parts[2]}</span>
    </span>
  );
}
