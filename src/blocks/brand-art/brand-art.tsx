import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export type BrandArtData = {
  name: string;
  slug: string;
  title: string;
  closing?: string | null;
  cta?: string | null;
  logo?: string | null;
  image?: string | null;
  font?: string | null;
};

export type BrandSceneKind = "card" | "box" | "post" | "sign";

export const BRAND_ART_SIZE = {
  cover: [328, 400],
  type: [328, 400],
  kit: [328, 380],
  scene: [320, 400],
} as const;

export const SCENE_LABEL: Record<BrandSceneKind, string> = { card: "명함", box: "상자", post: "게시물", sign: "간판" };
export const BRAND_SCENES = Object.keys(SCENE_LABEL) as BrandSceneKind[];

const MARK = {
  sm: "ez:size-6 ez:text-site-note",
  md: "ez:size-8 ez:text-site-body",
  lg: "ez:size-10 ez:text-site-item",
  xl: "ez:size-14 ez:text-site-section",
} as const;

export function Canvas({ width, height, label, group, children }: { width: number; height: number; label: string; group?: boolean; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="ez:block ez:h-auto ez:w-full" role={group ? "group" : "img"} aria-label={label}>
      {children}
    </svg>
  );
}

export function Layer({ x = 0, y = 0, width, height, transform, children, className }: {
  x?: number;
  y?: number;
  width: number;
  height: number;
  transform?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <foreignObject x={x} y={y} width={width} height={height} transform={transform}>
      <div className={cn("ez:relative ez:box-border ez:h-full ez:w-full ez:overflow-hidden ez:font-body ez:text-fg", className)}>{children}</div>
    </foreignObject>
  );
}

export function BrandMark({ name, logo, size = "md", inverse, className }: {
  name: string;
  logo?: string | null;
  size?: keyof typeof MARK;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "ez:inline-flex ez:shrink-0 ez:items-center ez:justify-center ez:overflow-hidden ez:rounded-button ez:font-display ez:leading-none",
        logo ? "ez:bg-surface" : inverse ? "ez:bg-surface ez:text-primary" : "ez:bg-primary ez:text-on-primary",
        MARK[size],
        className,
      )}
    >
      {logo ? <img src={logo} alt="" className="ez:size-full ez:object-contain" /> : Array.from(name.trim())[0] ?? ""}
    </span>
  );
}

function Lockup({ data, size = "md", inverse }: { data: BrandArtData; size?: keyof typeof MARK; inverse?: boolean }) {
  return (
    <span className="ez:flex ez:min-w-0 ez:items-center ez:gap-2">
      <BrandMark name={data.name} logo={data.logo} size={size} inverse={inverse} />
      <span className={cn("ez:truncate ez:font-display ez:font-title", inverse ? "ez:text-on-primary" : "ez:text-fg", size === "sm" ? "ez:text-site-note" : "ez:text-site-body")}>
        {data.name}
      </span>
    </span>
  );
}

function Cutout({ data, x, y, size }: { data: BrandArtData; x: number; y: number; size: number }) {
  if (!data.image) return null;
  return <image href={data.image} x={x} y={y} width={size} height={size} preserveAspectRatio="xMidYMid meet" />;
}

export function CoverBody({ data, width, height, compact }: { data: BrandArtData; width: number; height: number; compact?: boolean }) {
  const photo = compact ? Math.round(height * 0.74) : Math.round(width * 0.78);
  return (
    <>
      <rect width={width} height={height} className="ez:fill-surface-alt" />
      <ellipse cx={width / 2} cy={height * 0.9} rx={width * 0.62} ry={height * 0.32} className="ez:fill-surface" opacity="0.9" />
      {data.image ? (
        <Cutout data={data} x={compact ? width - photo - 12 : (width - photo) / 2} y={compact ? 20 : height - photo - 64} size={photo} />
      ) : (
        <Layer y={compact ? 0 : 60} width={width} height={compact ? height : height - 150} className="ez:grid ez:place-items-center">
          <BrandMark name={data.name} logo={data.logo} size="xl" />
        </Layer>
      )}
      <Layer width={width} height={height} className="ez:flex ez:flex-col ez:justify-between ez:p-5">
        <Lockup data={data} size={compact ? "md" : "lg"} />
        <div className="ez:flex ez:items-end ez:justify-between ez:gap-3">
          <p className={cn("ez:m-0 ez:font-display ez:text-balance ez:break-keep", compact ? "ez:text-site-item ez:max-w-3/5" : "ez:text-site-section")}>{data.title}</p>
          {compact && <span className="ez:shrink-0 ez:text-site-note ez:text-muted">{data.slug}.zdot.shop</span>}
        </div>
      </Layer>
    </>
  );
}

export function BrandCover({ data }: { data: BrandArtData }) {
  const [w, h] = BRAND_ART_SIZE.cover;
  return (
    <Canvas width={w} height={h} label={`${data.name} 표지`}>
      <CoverBody data={data} width={w} height={h} />
    </Canvas>
  );
}

export function BrandSpecimen({ data }: { data: BrandArtData }) {
  const [w, h] = BRAND_ART_SIZE.type;
  return (
    <Canvas width={w} height={h} label={`${data.name} 글꼴`}>
      <rect width={w} height={h} className="ez:fill-surface" />
      <Layer width={w} height={h} className="ez:flex ez:flex-col ez:gap-1 ez:p-6">
        <p className="ez:m-0 ez:font-display ez:text-site-page ez:font-title">가나다 Aa</p>
        {data.font && <p className="ez:m-0 ez:text-site-note ez:text-muted">{data.font}</p>}
        <div className="ez:mt-auto ez:grid ez:justify-items-start ez:gap-3">
          <p className="ez:m-0 ez:font-display ez:text-site-section ez:text-balance ez:break-keep">{data.title}</p>
          {data.closing && <p className="ez:m-0 ez:text-site-body ez:text-muted ez:break-keep">{data.closing}</p>}
          {data.cta && (
            <span className="ez:inline-flex ez:h-10 ez:items-center ez:rounded-button ez:bg-primary ez:px-5 ez:text-site-note ez:font-semibold ez:text-on-primary">
              {data.cta}
            </span>
          )}
        </div>
      </Layer>
    </Canvas>
  );
}

function CardScene({ data }: { data: BrandArtData }) {
  return (
    <>
      <rect width="320" height="400" className="ez:fill-scene-floor" />
      <ellipse cx="160" cy="250" rx="190" ry="170" className="ez:fill-scene-floor-deep" opacity="0.45" />
      <g transform="rotate(-9 177 123)">
        <rect x="65" y="66" width="230" height="130" rx="5" className="ez:fill-scene-shade" transform="translate(0 10)" />
        <Layer x={62} y={58} width={230} height={130} className="ez:flex ez:flex-col ez:justify-between ez:rounded-sm ez:bg-surface ez:p-5">
          <div className="ez:grid ez:gap-1">
            <span className="ez:font-display ez:text-site-body ez:font-title">{data.name}</span>
            <span className="ez:text-site-note ez:text-primary ez:break-keep">{data.title}</span>
          </div>
          <span className="ez:text-site-note ez:text-muted">{data.slug}.zdot.shop</span>
        </Layer>
      </g>
      <g transform="rotate(5 149 277)">
        <rect x="38" y="222" width="230" height="130" rx="5" className="ez:fill-scene-shade" transform="translate(0 12)" />
        <Layer x={34} y={212} width={230} height={130} className="ez:flex ez:items-center ez:justify-center ez:rounded-sm ez:bg-primary">
          <Lockup data={data} size="lg" inverse />
        </Layer>
      </g>
    </>
  );
}

function BoxScene({ data }: { data: BrandArtData }) {
  return (
    <>
      <rect width="320" height="400" className="ez:fill-scene-floor" />
      <ellipse cx="160" cy="318" rx="128" ry="22" className="ez:fill-scene-shade" />
      <polygon points="40,150 160,105 280,150 160,195" className="ez:fill-scene-kraft-top" />
      <polygon points="40,150 160,195 160,320 40,275" className="ez:fill-scene-kraft-left" />
      <polygon points="160,195 280,150 280,275 160,320" className="ez:fill-scene-kraft-right" />
      <polygon points="92,130 116,121 236,166 212,175" className="ez:fill-primary" />
      <polygon points="212,175 236,166 236,196 212,205" className="ez:fill-primary-hover" />
      <Layer x={64} y={196} width={64} height={64} transform="skewY(21)" className="ez:grid ez:place-items-center ez:overflow-visible">
        <BrandMark name={data.name} logo={data.logo} size="xl" className="ez:ring-4 ez:ring-surface" />
      </Layer>
    </>
  );
}

function PostScene({ data }: { data: BrandArtData }) {
  return (
    <>
      <rect width="320" height="400" className="ez:fill-primary-tint" />
      <rect x="44" y="70" width="232" height="300" rx="10" className="ez:fill-scene-shade" />
      <Layer x={40} y={56} width={240} height={300} className="ez:flex ez:flex-col ez:rounded-md ez:bg-surface">
        <div className="ez:flex ez:items-center ez:gap-2 ez:px-3 ez:py-2">
          <BrandMark name={data.name} logo={data.logo} size="sm" />
          <span className="ez:text-site-note ez:font-semibold">{data.slug}</span>
        </div>
        <div className="ez:relative ez:flex-1 ez:overflow-hidden ez:bg-surface-alt">
          <p className="ez:m-0 ez:max-w-3/5 ez:p-4 ez:font-display ez:text-site-item ez:break-keep">{data.title}</p>
          {data.cta && (
            <span className="ez:absolute ez:bottom-4 ez:left-4 ez:inline-flex ez:h-7 ez:items-center ez:rounded-button ez:bg-primary ez:px-3 ez:text-site-note ez:text-on-primary">
              {data.cta}
            </span>
          )}
        </div>
        <span className="ez:px-3 ez:py-2 ez:text-site-note ez:text-muted ez:truncate">{data.closing ?? data.name}</span>
      </Layer>
      <Cutout data={data} x={150} y={150} size={150} />
    </>
  );
}

function SignScene({ data }: { data: BrandArtData }) {
  return (
    <>
      <rect width="320" height="280" className="ez:fill-scene-wall" />
      <rect y="280" width="320" height="120" className="ez:fill-scene-ground" />
      <ellipse cx="160" cy="352" rx="96" ry="12" className="ez:fill-scene-shade" />
      <polygon points="100,52 220,52 258,348 62,348" className="ez:fill-scene-stand" />
      <polygon points="108,64 212,64 246,336 74,336" className="ez:fill-surface" />
      <polygon points="80,286 240,286 246,336 74,336" className="ez:fill-primary" />
      <Layer x={88} y={84} width={144} height={190} className="ez:flex ez:flex-col ez:items-center ez:gap-2 ez:text-center">
        <BrandMark name={data.name} logo={data.logo} size="xl" />
        <span className="ez:font-display ez:text-site-body ez:font-title">{data.name}</span>
        <span className="ez:font-display ez:text-site-note ez:text-primary ez:break-keep">{data.title}</span>
      </Layer>
      <Layer x={80} y={292} width={160} height={40} className="ez:grid ez:place-items-center">
        <span className="ez:text-site-note ez:font-semibold ez:text-on-primary">{data.cta ?? data.name}</span>
      </Layer>
    </>
  );
}

const SCENES: Record<BrandSceneKind, (props: { data: BrandArtData }) => ReactNode> = {
  card: CardScene,
  box: BoxScene,
  post: PostScene,
  sign: SignScene,
};

export function BrandScene({ data, kind }: { data: BrandArtData; kind: BrandSceneKind }) {
  const [w, h] = BRAND_ART_SIZE.scene;
  const Scene = SCENES[kind];
  return (
    <Canvas width={w} height={h} label={`${data.name} ${SCENE_LABEL[kind]}`}>
      <Scene data={data} />
    </Canvas>
  );
}
