import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BRAND_SCENES, BrandCover, BrandKit, BrandMark, BrandScene, BrandSpecimen, type BrandArtData } from "../../index";

const vase =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M40 12h20v8c0 6 14 14 14 34 0 22-12 34-24 34S26 76 26 54c0-20 14-28 14-34z" fill="#6f8f9a"/><path d="M40 12h20v6H40z" fill="#4f6b74"/></svg>',
  );

const data: BrandArtData = {
  name: "바닷가 펜션",
  slug: "seaside",
  title: "좋아해서 타협하지 않는",
  closing: "파도 소리 들리는 방에서 기다릴게요.",
  cta: "객실 보기",
  image: vase,
  font: "Sunflower",
};

const bare: BrandArtData = { name: "흙손 도예 공방", slug: "heukson", title: "애정이 쌓인 디테일" };

const meta: Meta = { title: "Blocks/BrandArt", parameters: { layout: "padded" } };
export default meta;

function Box({ children }: { children: React.ReactNode }) {
  return <div style={{ width: 328 }}>{children}</div>;
}

export const Cover: StoryObj = { render: () => <Box><BrandCover data={data} /></Box> };

export const CoverWithoutPhoto: StoryObj = { render: () => <Box><BrandCover data={bare} /></Box> };

export const Specimen: StoryObj = { render: () => <Box><BrandSpecimen data={data} /></Box> };

export const Kit: StoryObj = { render: () => <Box><BrandKit data={data} /></Box> };

export const Scenes: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      {BRAND_SCENES.map((kind) => (
        <div key={kind} style={{ width: 240 }}>
          <BrandScene data={data} kind={kind} />
        </div>
      ))}
    </div>
  ),
};

export const Marks: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <BrandMark name={data.name} size="sm" />
      <BrandMark name={data.name} size="md" />
      <BrandMark name={data.name} size="lg" />
      <BrandMark name={data.name} size="xl" />
    </div>
  ),
};
