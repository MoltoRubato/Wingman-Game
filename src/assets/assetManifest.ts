export type AssetCategory = "hero" | "route";
export type AssetSize = "1024x1024" | "1536x1024" | "2048x1152";
export type AssetFormat = "webp" | "png" | "jpeg";

export type GeneratedAsset = {
  id: string;
  file: `/assets/generated/${string}.${AssetFormat}`;
  prompt: string;
  size: AssetSize;
  category: AssetCategory;
  placeholderFile?: string;
  quality?: "low" | "medium" | "high" | "auto";
  outputFormat?: AssetFormat;
};

const ART_DIRECTION =
  "Painterly 2D digital game art for Rival Hearts, a romantic court intrigue game. Warm candlelit lighting, elegant late-baroque inspired palace details, clean readable silhouettes, rich fabric texture, dramatic but cozy mood, tasteful storybook illustration, consistent brushwork and palette: burgundy, teal, plum, cream parchment, antique gold, and deep midnight blue. Avoid photorealism, flat vector art, UI chrome, typography, captions, watermarks, logos, speech bubbles, and text inside the image.";

const prompt = (description: string) =>
  `${ART_DIRECTION}\n\nAsset request: ${description}\n\nComposition must remain readable at game UI sizes. No text in the image. No watermark.`;

export const assetManifest = [
  {
    id: "hero_background",
    file: "/assets/generated/hero-background.png",
    category: "hero",
    size: "1536x1024",
    quality: "medium",
    outputFormat: "png",
    prompt: prompt(
      "A moonlit palace court at night with a writing desk, sealed love letter, candle glow, velvet curtains, distant garden archways, and a sense of secrecy and romance. Wide hero background with generous center space for the game logo.",
    ),
  },
  {
    id: "route_fast",
    file: "/assets/generated/route-fast-garden.png",
    category: "route",
    size: "1536x1024",
    quality: "medium",
    outputFormat: "png",
    prompt: prompt(
      "Fast Route: a moonlit palace garden shortcut with gravel path, hedges, roses, lantern posts, archway in the distance, romantic danger, wide environmental background with no characters.",
    ),
  },
  {
    id: "route_safe",
    file: "/assets/generated/route-safe-gallery.png",
    category: "route",
    size: "1536x1024",
    quality: "medium",
    outputFormat: "png",
    prompt: prompt(
      "Safe Route: a public palace portrait gallery with polished parquet floor, gold frames, chandeliers, soft candlelight, readable central walkway, wide environmental background with no characters.",
    ),
  },
  {
    id: "route_secret",
    file: "/assets/generated/route-secret-corridor.png",
    category: "route",
    size: "1536x1024",
    quality: "medium",
    outputFormat: "png",
    prompt: prompt(
      "Secret Route: hidden palace service corridor with narrow perspective, half-open door spilling warm light, stacked letters, concealed passage atmosphere, wide environmental background with no characters.",
    ),
  },
] as const satisfies readonly GeneratedAsset[];

export type AssetId = (typeof assetManifest)[number]["id"];

export const assetsById = Object.fromEntries(
  assetManifest.map((asset) => [asset.id, asset]),
) as unknown as Record<AssetId, GeneratedAsset>;

export const USE_GENERATED_ASSETS =
  process.env.NEXT_PUBLIC_USE_GENERATED_ASSETS !== "false";

export const assetUrl = (id: AssetId, useGenerated = USE_GENERATED_ASSETS): string | null => {
  const asset = assetsById[id];
  if (useGenerated) return asset.file;
  return asset.placeholderFile ?? null;
};

export const assetCssUrl = (id: AssetId, useGenerated = USE_GENERATED_ASSETS): string | undefined => {
  const url = assetUrl(id, useGenerated);
  return url ? `url(${JSON.stringify(url)})` : undefined;
};

export const routeAssetIds = {
  fast: "route_fast",
  safe: "route_safe",
  secret: "route_secret",
} as const satisfies Record<string, AssetId>;
