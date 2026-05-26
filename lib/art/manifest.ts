import {
  assetManifest,
  assetUrl,
  routeAssetIds,
  type AssetId,
} from "@/src/assets/assetManifest";

export { assetManifest };

export type RouteAssetKey = keyof typeof routeAssetIds;

const mappedAssetUrl = <TKey extends string>(
  ids: Record<TKey, AssetId>,
  key: TKey,
): string | null => assetUrl(ids[key]);

export const routeAssetUrl = (key: RouteAssetKey): string | null =>
  mappedAssetUrl(routeAssetIds, key);
