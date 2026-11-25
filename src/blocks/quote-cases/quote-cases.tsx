import { QUOTE_DESIGNS } from "../../sections/quote";
import type { QuoteListProps } from "../../sections/quote/types";
import { bySkin } from "../../templates/skin";
import type { ShopSkin } from "../../templates/types";

export function QuoteCases({ skin, ...props }: QuoteListProps & { skin?: ShopSkin }) {
  const List = (bySkin(QUOTE_DESIGNS, skin) ?? QUOTE_DESIGNS.editorial).List;
  return <List {...props} />;
}
