import { QUOTE_DESIGNS } from "../../sections/quote";
import type { QuoteListProps } from "../../sections/quote/types";
import type { ShopSkin } from "../../templates/types";

export function QuoteCases({ skin, ...props }: QuoteListProps & { skin?: ShopSkin }) {
  const List = QUOTE_DESIGNS[skin ?? "editorial"].List;
  return <List {...props} />;
}
