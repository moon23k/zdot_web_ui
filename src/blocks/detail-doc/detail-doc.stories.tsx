import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DetailDoc, type DetailDocValue } from "../../index";

const meta: Meta<typeof DetailDoc> = {
  title: "Blocks/DetailDoc",
  component: DetailDoc,
  parameters: { layout: "padded" },
};
export default meta;

const photos = ["https://picsum.photos/seed/zdot-vase/720/900", "https://picsum.photos/seed/zdot-shelf/720/720"];

const doc: DetailDocValue = {
  version: 2,
  background: "#EFE7DC",
  blocks: [
    { id: "b1", layout: "image", layers: [{ id: "p1", type: "image", url: photos[0] }] },
    {
      id: "b2",
      layout: "text",
      space_top: 4,
      space_bottom: 4,
      layers: [
        { id: "t1", type: "text", text: "한 송이만 꽂아도\n달라지는 자리", style: { font: "serif", size: 8, weight: "bold", align: "center", line: 3, tracking: -2 } },
        { id: "t2", type: "text", text: "손으로 빚어 유약을 두 번 입힌 화병", style: { size: 4, align: "center" } },
      ],
    },
    {
      id: "b3",
      layout: "side",
      layers: [
        { id: "p2", type: "image", url: photos[1] },
        { id: "t3", type: "text", text: "지름 12cm · 높이 24cm", style: { font: "gothic", size: 6, weight: "bold", effect: "band" } },
      ],
    },
    {
      id: "b4",
      layout: "two_images",
      layers: [
        { id: "p3", type: "image", url: photos[0] },
        { id: "p4", type: "image", url: photos[1] },
        { id: "t4", type: "text", text: "선물 포장", style: { font: "hand", size: 7 } },
      ],
    },
    {
      id: "b5",
      layout: "card",
      layers: [
        { id: "p5", type: "image", url: photos[1] },
        { id: "t5", type: "text", text: "32,000원", style: { font: "display", size: 8, effect: "outline" } },
      ],
    },
  ],
};

export const Default: StoryObj = { render: () => <DetailDoc doc={doc} /> };
