import { Icon } from "../../components/icon";
import type { SectionProps } from "../../renderer/registry";
import { won } from "../../utils/cn";

export function FreeShippingBar({ context }: SectionProps<"free_shipping_bar">) {
  const threshold = context.shipping?.free_threshold;
  if (!threshold) return null;
  return (
    <p data-slot="free-shipping-bar" className="ez:m-0 ez:flex ez:min-h-9.5 ez:items-center ez:justify-center ez:gap-2 ez:rounded-sm ez:bg-surface-alt ez:px-4 ez:text-site-small ez:text-fg">
      <Icon name="truck" size="sm" />
      {won(threshold)} 이상 구매하면 무료 배송
    </p>
  );
}
