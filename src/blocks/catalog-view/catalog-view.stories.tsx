import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import products from "../../__stories__/fixtures/products.json";
import { AnchorTabs, CatalogView, Crumbs, Fold, ProductGallery, ProductShelf } from "../../index";

const meta: Meta<typeof CatalogView> = {
  title: "Blocks/CatalogView",
  component: CatalogView,
  parameters: { layout: "padded" },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <CatalogView
      title="그릇"
      count={products.length}
      crumbs={[
        { label: "홈", href: "/" },
        { label: "그릇", href: "/products?category=c1" },
      ]}
      chips={[
        { label: "전체", href: "/products" },
        { label: "그릇", href: "/products?category=c1", on: true },
      ]}
      sorts={[
        { label: "신상품순", href: "/products", on: true },
        { label: "인기순", href: "/products?sort=popular" },
      ]}
      products={products}
      more="/products?cursor=2"
    />
  ),
};

export const Detail: StoryObj = {
  render: () => (
    <div className="ez:grid ez:gap-10">
      <Crumbs
        items={[
          { label: "홈", href: "/" },
          { label: products[0].name, href: "/products/1" },
        ]}
      />
      <ProductGallery images={products.map((p) => p.cover_url)} name={products[0].name} />
      <AnchorTabs
        items={[
          { label: "상세 정보", href: "#detail" },
          { label: "리뷰", href: "#reviews", count: 12 },
        ]}
      />
      <Fold title="상품 정보 제공 고시">
        <p>상세페이지 참조</p>
      </Fold>
      <ProductShelf title="찜한 상품" count={products.length} products={products} href="/me/likes" />
    </div>
  ),
};
