"use client";

import { BRAND_ART_SIZE, BRAND_SCENES, BrandScene, Canvas, CoverBody, Layer, SCENE_LABEL, type BrandArtData, type BrandSceneKind } from "./brand-art";

export function BrandKit({ data, onScene }: { data: BrandArtData; onScene?: (kind: BrandSceneKind) => void }) {
  const [w, h] = BRAND_ART_SIZE.kit;
  const cover = 236;
  const pad = 12;
  const gap = 8;
  const thumb = (w - pad * 2 - gap * 3) / 4;
  return (
    <Canvas width={w} height={h} label={`${data.name} 브랜드`} group>
      <rect width={w} height={h} className="ez:fill-surface" />
      <CoverBody data={data} width={w} height={cover} compact />
      {BRAND_SCENES.map((kind, i) => (
        <Layer key={kind} x={pad + i * (thumb + gap)} y={cover + pad} width={thumb} height={h - cover - pad} className="ez:flex ez:flex-col ez:gap-1">
          <button
            type="button"
            aria-label={SCENE_LABEL[kind]}
            onClick={() => onScene?.(kind)}
            className="ez:block ez:w-full ez:cursor-pointer ez:overflow-hidden ez:rounded-md ez:border-0 ez:bg-transparent ez:p-0"
          >
            <BrandScene data={data} kind={kind} />
          </button>
          <span className="ez:text-center ez:text-site-note ez:text-muted">{SCENE_LABEL[kind]}</span>
        </Layer>
      ))}
    </Canvas>
  );
}
