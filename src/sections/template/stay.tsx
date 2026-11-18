import { Badge } from "../../components/badge";
import { ButtonLink } from "../../components/button";
import type { SectionProps } from "../../renderer/registry";
import NextLink from "next/link";
import { Icon } from "../../components/icon";
import { cn } from "../../utils/cn";
import { chip, countSup, figure, focusRing, pointTag, sectionTitle, textLink } from "../../utils/styles";
import { Bar, BlankButton, Block, Pairs, Pic, Rows, Split, Title } from "../kit";
import type { Room } from "./data";

type SearchData = SectionProps<"search_bar">["data"] & Partial<Pick<SectionProps<"booking_strip">["data"], "check_in" | "check_out" | "guests" | "price">>;

export function SearchBar({ data, blank }: SectionProps<"search_bar">) {
  const d: SearchData = data;
  const filled = Boolean(d.check_in || d.price);
  if (!filled && !blank) return null;
  const cells: [string, string | null | undefined][] = [
    ["체크인", d.check_in],
    ["체크아웃", d.check_out],
    ["인원", d.guests],
    ["요금", d.price],
  ];
  return (
    <section
      data-slot="search-bar"
      data-blank={filled ? undefined : ""}
      className="ez:relative ez:z-1 ez:grid ez:gap-4 ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:p-5 ez:text-fg ez:md:grid-cols-2 ez:lg:flex ez:lg:h-22 ez:lg:items-center ez:lg:rounded-full ez:lg:py-0 ez:lg:pr-3 ez:lg:pl-10 ez:lg:[[data-slot=hero][data-variant=full]+&]:-mt-[calc(var(--ezd-section-gap)+144px)] ez:lg:[[data-slot=hero][data-variant=full]+&]:border-transparent"
    >
      {cells.map(([label, value], i) => (
        <div key={label} className={cn("ez:flex ez:min-w-0 ez:flex-1 ez:flex-col", i > 0 && "ez:lg:border-0 ez:lg:border-l ez:lg:border-solid ez:lg:border-site-line ez:lg:pl-8")}>
          <span className="ez:text-site-small ez:text-muted">{label}</span>
          <span className="ez:truncate ez:font-medium ez:tabular-nums">{value ?? <Bar size="short" />}</span>
        </div>
      ))}
      {filled ? (
        <ButtonLink href="#rooms" className="ez:md:col-span-2 ez:lg:h-16 ez:lg:px-9">
          객실 보기
          <Icon name="right" size="sm" />
        </ButtonLink>
      ) : (
        <BlankButton className="ez:md:col-span-2 ez:lg:h-16 ez:lg:px-9">객실 보기</BlankButton>
      )}
    </section>
  );
}

function GalleryStrip({ data }: { data: SectionProps<"booking_strip">["data"] }) {
  const cells: [string, string | null | undefined][] = [
    ["체크인", data.check_in],
    ["체크아웃", data.check_out],
    ["인원", data.guests],
  ];
  return (
    <section
      data-slot="booking-strip"
      data-variant="gallery"
      data-blank={data.price ? undefined : ""}
      className="ez:relative ez:z-1 ez:grid ez:gap-4 ez:rounded-md ez:border ez:border-solid ez:border-site-line ez:bg-surface ez:p-5 ez:text-fg ez:lg:mx-20 ez:lg:-mt-[calc(var(--ezd-section-gap)+44px)] ez:lg:flex ez:lg:h-22 ez:lg:items-center ez:lg:rounded-full ez:lg:py-0 ez:lg:pr-3 ez:lg:pl-10"
    >
      {cells.map(([label, value], i) => (
        <div key={label} className={cn("ez:flex ez:flex-1 ez:flex-col", i > 0 && "ez:lg:border-0 ez:lg:border-l ez:lg:border-solid ez:lg:border-site-line ez:lg:pl-8")}>
          <span className="ez:text-site-small ez:text-muted">{label}</span>
          <span className="ez:font-medium">{value ?? <Bar size="short" />}</span>
        </div>
      ))}
      {data.price ? (
        <ButtonLink href="#rooms" className="ez:lg:h-16 ez:lg:px-8">
          예약 가능 객실 보기
          <Icon name="right" size="sm" />
        </ButtonLink>
      ) : (
        <BlankButton>예약 가능 객실 보기</BlankButton>
      )}
    </section>
  );
}

export function BookingStrip({ data, blank }: SectionProps<"booking_strip">) {
  if (!data.price && !blank) return null;
  return <GalleryStrip data={data} />;
}

export function Amenities({ data, variant, blank }: SectionProps<"amenities">) {
  const items = data.items ?? [];
  if (!items.length && !blank) return null;
  if (variant === "gallery") {
    return (
      <Split slot="amenities" id="amenities" title={data.title ?? "편의 시설"} blank={!items.length}>
        <ul className="ez:m-0 ez:grid ez:list-none ez:gap-x-6 ez:p-0 ez:md:grid-cols-3">
          {(items.length ? items : [null, null, null]).map((it, i) => (
            <li key={it?.name ?? i} className="ez:flex ez:items-baseline ez:justify-between ez:gap-3 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:py-4.5">
              <span>{it ? it.name : <Bar />}</span>
              {it?.group && <span className="ez:text-site-small ez:text-muted">{it.group}</span>}
            </li>
          ))}
        </ul>
      </Split>
    );
  }
  const empty = !items.length;
  return (
    <section data-slot="amenities" id="amenities" data-blank={empty ? "" : undefined} className="ez:grid ez:gap-6 ez:text-fg ez:lg:grid-cols-[4fr_8fr]">
      <h2 className="ez:m-0 ez:text-site-section">{data.title ?? "편의시설"}</h2>
      <ul className="ez:m-0 ez:grid ez:min-w-0 ez:list-none ez:grid-cols-2 ez:gap-x-6 ez:p-0 ez:md:grid-cols-4">
        {(empty ? [null, null, null, null] : items).map((it, i) => (
          <li key={it?.name ?? i} className="ez:flex ez:flex-col ez:gap-1.5 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:py-5">
            <span>{it ? it.name : <Bar />}</span>
            {it?.group && <span className="ez:text-site-small ez:text-muted">{it.group}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HouseRules({ data, variant, blank }: SectionProps<"house_rules">) {
  const rules = data.rules ?? [];
  if (!data.check_in && !rules.length && !blank) return null;
  if (variant === "gallery") {
    const empty = !data.check_in && !rules.length;
    return (
      <Split slot="house-rules" id="rules" title="이용 안내" blank={empty}>
        <Pairs
          cols={2}
          rows={
            empty
              ? [
                  { label: "체크인", value: <Bar size="short" /> },
                  { label: "체크아웃", value: <Bar size="short" /> },
                ]
              : [
                  ...(data.check_in ? [{ label: "체크인", value: data.check_in }] : []),
                  ...(data.check_out ? [{ label: "체크아웃", value: data.check_out }] : []),
                  ...rules.map((r) => ({ label: r })),
                ]
          }
        />
      </Split>
    );
  }
  if (!data.check_in && !rules.length) {
    return (
      <Block slot="house-rules" blank>
        <Title>이용 규칙</Title>
        <Rows rows={[{ label: "입실", value: <Bar size="short" /> }, { label: "퇴실", value: <Bar size="short" /> }, { label: <Bar size="long" /> }]} />
      </Block>
    );
  }
  return (
    <Block slot="house-rules">
      <Title>이용 규칙</Title>
      <Rows
        rows={[
          ...(data.check_in ? [{ label: "입실", value: data.check_in }] : []),
          ...(data.check_out ? [{ label: "퇴실", value: data.check_out }] : []),
          ...rules.map((r) => ({ label: r })),
        ]}
      />
    </Block>
  );
}

function RoomRow({ room, i }: { room: Room | null; i: number }) {
  const out = room?.left === 0;
  const body = (
    <>
      <span className={cn(figure, "ez:text-site-section ez:max-lg:hidden")}>{room ? String(i + 1).padStart(2, "0") : null}</span>
      <span className="ez:relative ez:block">
        <Pic src={room?.image} ratio={1.53} tone={i} />
        {room?.sample && <Badge className="ez:absolute ez:left-2.5 ez:top-2.5">예시</Badge>}
      </span>
      <span className="ez:flex ez:flex-col ez:gap-5 ez:lg:pl-6">
        <span className="ez:flex ez:flex-col ez:gap-2">
          {room && room.left != null && room.left > 0 && room.left <= 3 && (
            <span className={pointTag}>
              <span aria-hidden="true" className="ez:size-1.25 ez:rounded-full ez:bg-primary" />
              {room.left}객실 남음
            </span>
          )}
          <span className="ez:text-site-page-sm ez:font-light ez:tracking-[-0.035em] ez:lg:text-site-name">{room ? room.name : <Bar />}</span>
        </span>
        <span className="ez:flex ez:flex-wrap ez:gap-2">
          {(room?.specs ?? ["", ""]).map((s, k) => (
            <span key={`${s}-${k}`} className={cn(chip, "ez:h-8.5 ez:text-site-small ez:cursor-auto")}>
              {s || <Bar size="short" />}
            </span>
          ))}
        </span>
      </span>
      <span className="ez:flex ez:items-end ez:justify-between ez:gap-4 ez:lg:flex-col ez:lg:text-right">
        <span className="ez:flex ez:flex-col ez:lg:items-end">
          <span className={cn("ez:text-site-heading ez:font-medium ez:tabular-nums", out && "ez:text-muted")}>{room ? (out ? "오늘 마감" : (room.amount ?? room.price)) : <Bar size="short" />}</span>
          {room?.unit && !out && <span className="ez:text-site-small ez:text-muted">{room.unit}</span>}
        </span>
        <span className={cn(textLink, "ez:text-site-small")}>객실 보기</span>
      </span>
    </>
  );
  const cls = "ez:grid ez:gap-5 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:py-8 ez:text-fg ez:no-underline ez:lg:grid-cols-[56px_minmax(0,520px)_1fr_260px] ez:lg:gap-8";
  if (!room) return <div className={cls}>{body}</div>;
  return (
    <NextLink href={room.href ?? "#"} data-sample={room.sample || undefined} className={cls}>
      {body}
    </NextLink>
  );
}

function GalleryRooms({ title, rooms }: { title?: string | null; rooms: Room[] }) {
  return (
    <section data-slot="room-list" data-variant="gallery" id="rooms" data-blank={rooms.length ? undefined : ""} className="ez:grid ez:gap-8 ez:text-fg ez:lg:gap-12">
      <h2 className="ez:m-0 ez:text-site-section">
        {sectionTitle(title, "객실")}
        {rooms.length > 0 && <span className={countSup}>{rooms.length}</span>}
      </h2>
      <div className="ez:grid">
        {(rooms.length ? rooms : [null, null]).map((r, i) => (
          <RoomRow key={r?.id ?? i} room={r} i={i} />
        ))}
      </div>
    </section>
  );
}

function RoomCard({ room, i }: { room: Room | null; i: number }) {
  const out = room?.left === 0;
  const few = room?.left != null && room.left > 0 && room.left <= 3;
  const body = (
    <>
      <span className="ez:relative ez:block">
        <Pic src={room?.image} ratio={4 / 3} tone={i} className={cn(out && "ez:opacity-50")} />
        {room?.sample && <Badge className="ez:absolute ez:left-2.5 ez:top-2.5">예시</Badge>}
      </span>
      <span className="ez:flex ez:flex-1 ez:flex-col ez:gap-2.5">
        <span className="ez:text-site-heading">{room ? room.name : <Bar />}</span>
        <span className="ez:text-site-small ez:text-muted">{room ? room.specs.join(" · ") : <Bar size="long" />}</span>
        <span className="ez:mt-auto ez:flex ez:items-baseline ez:justify-between ez:gap-3 ez:border-0 ez:border-t ez:border-solid ez:border-site-line ez:pt-3">
          <span className={pointTag}>{few ? `${room.left}객실 남음` : null}</span>
          <span className={cn("ez:text-site-item ez:tabular-nums", out && "ez:text-muted")}>{room ? (out ? "오늘 마감" : room.price) : <Bar size="short" />}</span>
        </span>
      </span>
    </>
  );
  const cls = cn("ez:flex ez:flex-col ez:gap-4 ez:text-fg ez:no-underline", focusRing);
  if (!room) return <div className={cls}>{body}</div>;
  return (
    <NextLink href={room.href ?? "#"} data-sample={room.sample || undefined} className={cls}>
      {body}
    </NextLink>
  );
}

export function RoomList({ data, variant, blank }: SectionProps<"room_list">) {
  const rooms = data.rooms ?? [];
  if (!rooms.length && !blank) return null;
  if (variant === "gallery") return <GalleryRooms title={data.title} rooms={rooms} />;
  return (
    <section data-slot="room-list" id="rooms" data-blank={rooms.length ? undefined : ""} className="ez:grid ez:gap-8 ez:text-fg">
      <h2 className="ez:m-0 ez:text-site-section">
        {sectionTitle(data.title, "객실")}
        {rooms.length > 0 && <span className={countSup}>{rooms.length}</span>}
      </h2>
      <div className="ez:grid ez:grid-cols-1 ez:gap-x-gutter ez:gap-y-14 ez:sm:grid-cols-2 ez:lg:grid-cols-3">
        {(rooms.length ? rooms : [null, null, null]).map((r, i) => (
          <RoomCard key={r?.id ?? i} room={r} i={i} />
        ))}
      </div>
    </section>
  );
}

type BoxData = SectionProps<"room_box">["data"] & { rooms?: Room[]; price?: string | null };

function BoxRow({ room, name }: { room?: Room; name: string | null }) {
  const out = room?.left === 0;
  const few = room?.left != null && room.left > 0 && room.left <= 3;
  const body = (
    <>
      <span className="ez:flex ez:min-w-0 ez:flex-col ez:gap-1">
        <span className="ez:text-site-heading">{name ?? <Bar />}</span>
        {room && room.specs.length > 0 && <span className="ez:text-site-small ez:text-muted">{room.specs.slice(0, 2).join(" · ")}</span>}
        {!name && <Bar size="long" />}
      </span>
      {room && (
        <span className="ez:flex ez:shrink-0 ez:flex-col ez:items-end ez:gap-1 ez:text-right">
          <span className={cn("ez:text-site-item ez:tabular-nums", out && "ez:text-muted")}>{out ? "오늘 마감" : room.price}</span>
          {few && <span className={pointTag}>{room.left}객실 남음</span>}
        </span>
      )}
    </>
  );
  const cls = cn("ez:flex ez:items-center ez:justify-between ez:gap-6 ez:border-0 ez:border-t ez:border-solid ez:border-site-edge ez:py-6 ez:text-fg ez:no-underline", focusRing);
  if (!room?.href) return <div className={cls}>{body}</div>;
  return (
    <NextLink href={room.href} data-sample={room.sample || undefined} className={cls}>
      {body}
    </NextLink>
  );
}

export function RoomBox({ data, blank }: SectionProps<"room_box">) {
  const d: BoxData = data;
  const rooms = d.rooms ?? [];
  const names = rooms.length ? rooms.map((r) => r.name) : (d.names ?? []);
  if (!names.length && !blank) return null;
  const empty = !names.length;
  return (
    <section data-slot="room-box" id="rooms" data-blank={empty ? "" : undefined} className="ez:mx-[calc(50%-50vw)] ez:bg-surface-alt ez:text-fg">
      <div className="ez:mx-auto ez:grid ez:max-w-wrap ez:gap-gutter ez:px-page ez:py-16 ez:lg:grid-cols-2 ez:lg:py-24">
        <Pic src={d.image ?? rooms[0]?.image} ratio={1.2} tone={0} />
        <div className="ez:flex ez:min-w-0 ez:flex-col ez:lg:pl-14">
          <h2 className="ez:m-0 ez:mb-4 ez:text-site-section">
            {sectionTitle(d.title, "객실")}
            {!empty && <span className={countSup}>{names.length}</span>}
          </h2>
          {(empty ? [null, null, null] : names).map((name, i) => (
            <BoxRow key={name ?? i} room={rooms[i]} name={name} />
          ))}
          <div className="ez:mt-auto ez:flex ez:flex-wrap ez:items-center ez:justify-between ez:gap-4 ez:border-0 ez:border-t ez:border-solid ez:border-site-edge ez:pt-7">
            {d.price ? <span className="ez:text-site-heading ez:font-medium ez:tabular-nums">{d.price}</span> : <span />}
            {empty ? (
              <BlankButton>예약하기</BlankButton>
            ) : (
              d.href && (
                <ButtonLink href={d.href} className="ez:bg-surface">
                  예약하기
                  <Icon name="right" size="sm" />
                </ButtonLink>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
