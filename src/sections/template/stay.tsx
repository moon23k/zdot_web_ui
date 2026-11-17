import { Badge } from "../../components/badge";
import { ButtonLink } from "../../components/button";
import type { SectionProps } from "../../renderer/registry";
import NextLink from "next/link";
import { Icon } from "../../components/icon";
import { cn } from "../../utils/cn";
import { chip, countSup, figure, pointTag, sectionTitle, textLink } from "../../utils/styles";
import { Bar, BlankButton, BlankPrice, Block, Card, Cols, Lines, Pairs, Pic, Rows, Split, Title } from "../kit";
import type { Room } from "./data";

export function SearchBar({ data }: SectionProps<"search_bar">) {
  return (
    <form
      data-slot="search-bar"
      action={data.href ?? "/rooms"}
      className="ez:grid ez:gap-2 ez:rounded-md ez:border ez:border-solid ez:border-primary-border ez:bg-surface ez:p-3 ez:md:grid-cols-[1fr_1fr_1fr_auto]"
    >
      {(
        [
          ["check_in", "입실", "date"],
          ["check_out", "퇴실", "date"],
          ["guests", "인원", "number"],
        ] as const
      ).map(([name, label, type]) => (
        <label key={name} className="ez:grid ez:gap-1 ez:text-site-note ez:text-muted">
          {label}
          <input name={name} type={type} min={type === "number" ? 1 : undefined} className="ez:min-h-11 ez:rounded-md ez:border ez:border-solid ez:border-primary-border ez:bg-surface ez:px-3 ez:text-site-body ez:text-fg" />
        </label>
      ))}
      <button type="submit" className="ez:min-h-11 ez:self-end ez:rounded-button ez:border-0 ez:bg-point-soft ez:px-6 ez:text-site-body ez:font-medium ez:text-primary">
        검색
      </button>
    </form>
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

export function BookingStrip({ data, variant, blank }: SectionProps<"booking_strip">) {
  if (!data.price && !blank) return null;
  if (variant === "gallery") return <GalleryStrip data={data} />;
  return (
    <section data-slot="booking-strip" data-blank={data.price ? undefined : ""} className="ez:grid ez:gap-3 ez:rounded-md ez:bg-surface-alt ez:p-4 ez:text-fg ez:md:grid-cols-[1fr_auto] ez:md:items-center">
      {data.price ? <strong className="ez:text-site-figure ez:tabular-nums">{data.price}</strong> : <BlankPrice before="1박" after="원부터" className="ez:font-display ez:text-site-item" />}
      {data.price ? <ButtonLink href={data.href ?? "/booking"}>예약하기</ButtonLink> : <BlankButton>예약하기</BlankButton>}
    </section>
  );
}

export function SpecIcons({ data, blank }: SectionProps<"spec_icons">) {
  const items = data.items ?? [];
  if (!items.length && !blank) return null;
  const empty = !items.length;
  return (
    <ul data-slot="spec-icons" data-blank={empty ? "" : undefined} className="ez:m-0 ez:flex ez:list-none ez:flex-wrap ez:gap-x-5 ez:gap-y-2 ez:p-0 ez:text-fg">
      {(empty ? ["a", "b", "c", "d"] : items).map((t) => (
        <li key={t} className="ez:flex ez:items-center ez:gap-2">
          <span aria-hidden="true" className={empty ? "ez:size-2 ez:rounded-full ez:bg-tile-blank" : "ez:size-2 ez:rounded-full ez:bg-primary"} />
          {empty ? <Bar size="short" /> : t}
        </li>
      ))}
    </ul>
  );
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
  if (!items.length) {
    return (
      <Block slot="amenities" blank>
        <Title>{data.title ?? "편의시설"}</Title>
        <Cols m={2} pc={3}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="ez:flex ez:items-center ez:gap-2 ez:rounded-md ez:bg-surface-alt ez:p-3 ez:text-site-note">
              <span aria-hidden="true" className="ez:size-2 ez:rounded-full ez:bg-tile-blank" />
              <Bar />
            </div>
          ))}
        </Cols>
      </Block>
    );
  }
  if (variant === "groups") {
    const groups = [...new Set(items.map((i) => i.group ?? "기본"))];
    return (
      <Block slot="amenities">
        <Title>{data.title ?? "편의시설"}</Title>
        <Cols m={1} pc={3}>
          {groups.map((g) => (
            <div key={g} className="ez:grid ez:content-start ez:gap-1">
              <strong className="ez:font-semibold">{g}</strong>
              <span className="ez:text-site-note ez:text-muted">
                {items
                  .filter((i) => (i.group ?? "기본") === g)
                  .map((i) => i.name)
                  .join(" · ")}
              </span>
            </div>
          ))}
        </Cols>
      </Block>
    );
  }
  return (
    <Block slot="amenities">
      <Title>{data.title ?? "편의시설"}</Title>
      <Cols m={2} pc={3}>
        {items.map((i) => (
          <div key={i.name} className="ez:flex ez:items-center ez:gap-2 ez:rounded-md ez:bg-surface-alt ez:p-3 ez:text-site-note">
            <span aria-hidden="true" className="ez:size-2 ez:rounded-full ez:bg-primary" />
            {i.name}
          </div>
        ))}
      </Cols>
    </Block>
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

export function RoomList({ data, variant, blank }: SectionProps<"room_list">) {
  const rooms = data.rooms ?? [];
  if (!rooms.length && !blank) return null;
  if (variant === "gallery") return <GalleryRooms title={data.title} rooms={rooms} />;
  if (!rooms.length) {
    return (
      <Block slot="room-list" blank>
        <Title>{data.title ?? "객실"}</Title>
        <Cols m={1} pc={3}>
          {[0, 1, 2].map((i) => (
            <Card key={i} className="ez:flex ez:flex-col">
              <Pic ratio={1.5} tone={i} />
              <span className="ez:font-display ez:text-site-item">
                <Bar />
              </span>
              <span className="ez:text-site-note">
                <Bar size="long" />
              </span>
              <BlankPrice before="1박" after="원부터" />
              <span className="ez:mt-auto ez:grid ez:grid-cols-2 ez:gap-2">
                <BlankButton variant="outline">자세히</BlankButton>
                <BlankButton>예약</BlankButton>
              </span>
            </Card>
          ))}
        </Cols>
      </Block>
    );
  }
  return (
    <Block slot="room-list">
      <Title>{data.title ?? "객실"}</Title>
      <Cols m={1} pc={3}>
        {rooms.map((r, i) => (
          <Card key={r.id} className="ez:flex ez:flex-col" data-sample={r.sample || undefined}>
            <span className="ez:relative ez:block">
              <Pic src={r.image} ratio={1.5} tone={i} />
              {r.sample && <Badge className="ez:absolute ez:left-2 ez:top-2">예시</Badge>}
            </span>
            <strong className="ez:font-display ez:text-site-item">{r.name}</strong>
            <span className="ez:text-site-note ez:text-muted">{r.specs.join(" · ")}</span>
            <strong className="ez:text-primary ez:tabular-nums">{r.price}</strong>
            {r.left != null && <span className="ez:text-site-note ez:text-muted">{`남은 객실 ${r.left}`}</span>}
            <span className={cn("ez:mt-auto ez:grid ez:gap-2", !r.sample && "ez:grid-cols-2")}>
              <ButtonLink href={r.href ?? "#"} variant="outline">
                자세히
              </ButtonLink>
              {!r.sample && <ButtonLink href={r.href ?? "#"}>예약</ButtonLink>}
            </span>
          </Card>
        ))}
      </Cols>
    </Block>
  );
}

export function RoomBox({ data, blank }: SectionProps<"room_box">) {
  if (!data.title && !blank) return null;
  return (
    <section data-slot="room-box" data-blank={data.title ? undefined : ""} className="ez:grid ez:text-fg ez:md:grid-cols-[1.4fr_1fr] ez:md:items-center">
      <Pic src={data.image} ratio={1.3} tone={0} />
      <div className="ez:grid ez:gap-2 ez:p-6 ez:text-center">
        {!data.title && (
          <>
            <span className="ez:font-display ez:text-site-item">
              <Bar />
            </span>
            <Lines />
            <BlankButton variant="outline" className="ez:justify-self-center">
              객실 보기
            </BlankButton>
          </>
        )}
        {data.title && <strong className="ez:font-display ez:text-site-item">{data.title}</strong>}
        {data.body && <p className="ez:m-0 ez:text-muted">{data.body}</p>}
        {data.names && <span className="ez:text-site-note">{data.names.join(" · ")}</span>}
        {data.href && (
          <ButtonLink href={data.href} variant="outline" className="ez:justify-self-center">
            객실 보기
          </ButtonLink>
        )}
      </div>
    </section>
  );
}
