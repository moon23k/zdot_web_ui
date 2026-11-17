import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import products from "../../__stories__/fixtures/products.json";
import { BookingFrame, BookingHead, Button, CardCells, CardPrice, CardRow, CardTotal, PhotoCollage, Quantity, RoomShelf, SectionSplit, TimeTiles } from "../../index";

const meta: Meta<typeof BookingFrame> = {
  title: "Blocks/BookingFrame",
  component: BookingFrame,
  parameters: { layout: "padded" },
};
export default meta;

const photos = products.map((p) => p.cover_url);

function ClassExample() {
  const [slot, setSlot] = useState("s1");
  return (
    <BookingFrame
      action="/checkout"
      main={
        <>
          <PhotoCollage images={photos} name="물레 도자기 원데이" kind="class" />
          <BookingHead title="물레 도자기 원데이" rating={{ average: 4.9, count: 18, label: "후기" }} facts={[{ label: "소요", value: "2시간" }]} />
          <SectionSplit title="취소 · 환불">
            <p>이용일 3일 전까지 100% 환불</p>
          </SectionSplit>
        </>
      }
      card={
        <>
          <CardPrice amount="65,000원" unit="1인" />
          <TimeTiles
            name="slot"
            value={slot}
            onChange={setSlot}
            items={[
              { id: "s1", time: "10:00", note: "2자리" },
              { id: "s2", time: "14:00", note: "5자리" },
              { id: "s3", time: "16:30", note: "마감", off: true },
            ]}
          />
          <CardRow label="인원">
            <Quantity name="qty" label="인원" size="sm" />
          </CardRow>
          <CardTotal label="합계" value="65,000원" />
          <Button type="submit" block>
            예약하기
          </Button>
        </>
      }
    />
  );
}

function StayExample() {
  return (
    <div className="ez:grid ez:gap-10">
      <PhotoCollage images={photos} name="바다 앞 독채" />
      <BookingFrame
        action="/checkout"
        main={<BookingHead title="바다 앞 독채" chips={["기준 2 · 최대 4인", "입실 15:00"]} />}
        card={
          <>
            <CardPrice amount="99,000원" unit="1박" tag="1실 남음" />
            <CardCells
              cells={[
                { label: "체크인", value: "11월 28일 금" },
                { label: "체크아웃", value: "11월 30일 일" },
              ]}
            />
            <CardTotal rows={[{ label: "추가 요금", value: "주문서에서 계산" }]} label="객실 · 2박" value="198,000원" />
          </>
        }
      />
      <RoomShelf title="다른 객실" rooms={[{ id: "r2", name: "숲속 복층 객실", image: photos[1], price: "90,000원", unit: "1박" }]} />
    </div>
  );
}

export const Class: StoryObj = { render: () => <ClassExample /> };

export const Stay: StoryObj = { render: () => <StayExample /> };
