import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import path from "node:path";
import { assetManifest } from "../src/assets/assetManifest";

const ROOT = process.cwd();

const main = async () => {
  let removed = 0;

  for (const asset of assetManifest) {
    const outputPath = path.join(ROOT, "public", asset.file);
    if (!existsSync(outputPath)) continue;
    await rm(outputPath);
    removed += 1;
    console.log(`[removed] ${asset.file}`);
  }

  console.log(`Done. Removed ${removed} generated asset${removed === 1 ? "" : "s"}.`);
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[assets:clean] ${message}`);
  process.exitCode = 1;
});
