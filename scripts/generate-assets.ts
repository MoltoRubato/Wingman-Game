import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { assetManifest, type GeneratedAsset } from "../src/assets/assetManifest";

type Args = {
  category?: GeneratedAsset["category"];
  only?: string;
  force: boolean;
  dryRun: boolean;
  limit?: number;
};

const ROOT = process.cwd();
const GENERATED_PREFIX = "/assets/generated/";
const DEFAULT_MODEL = "gpt-image-2";

const parseArgs = (): Args => {
  const args = process.argv.slice(2);
  const getValue = (name: string) => {
    const inline = args.find((arg) => arg.startsWith(`${name}=`));
    if (inline) return inline.slice(name.length + 1);
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : undefined;
  };

  const limit = getValue("--limit");

  return {
    category: getValue("--category") as Args["category"],
    only: getValue("--only"),
    force: args.includes("--force"),
    dryRun: args.includes("--dry-run"),
    limit: limit ? Number(limit) : undefined,
  };
};

const loadDotenvLocal = async () => {
  const envPath = path.join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;

  const contents = await readFile(envPath, "utf8");
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const match = line.match(/^([\w.-]+)\s*=\s*(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key]) continue;

    const value = rawValue
      .replace(/^['"]|['"]$/g, "")
      .replace(/\\n/g, "\n");
    process.env[key] = value;
  }
};

const outputPathFor = (asset: GeneratedAsset) => {
  if (!asset.file.startsWith(GENERATED_PREFIX)) {
    throw new Error(`Asset "${asset.id}" must write under ${GENERATED_PREFIX}`);
  }
  return path.join(ROOT, "public", asset.file);
};

const selectAssets = (args: Args) => {
  let selected = [...assetManifest];

  if (args.category) {
    selected = selected.filter((asset) => asset.category === args.category);
  }

  if (args.only) {
    const wanted = new Set(args.only.split(",").map((id) => id.trim()).filter(Boolean));
    selected = selected.filter((asset) => wanted.has(asset.id));
  }

  if (args.limit !== undefined) {
    if (!Number.isInteger(args.limit) || args.limit < 1) {
      throw new Error("--limit must be a positive integer");
    }
    selected = selected.slice(0, args.limit);
  }

  return selected;
};

const fetchGeneratedImage = async (asset: GeneratedAsset): Promise<Buffer> => {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_IMAGE_MODEL ?? DEFAULT_MODEL,
      prompt: asset.prompt,
      size: asset.size,
      quality: asset.quality ?? "medium",
      output_format: asset.outputFormat ?? "webp",
      output_compression: asset.outputFormat === "webp" ? 88 : undefined,
      background: "auto",
    }),
  });

  const json = await response.json().catch(() => null) as
    | { data?: Array<{ b64_json?: string; url?: string }>; error?: { message?: string } }
    | null;

  if (!response.ok) {
    throw new Error(json?.error?.message ?? `OpenAI image request failed with HTTP ${response.status}`);
  }

  const first = json?.data?.[0];
  if (first?.b64_json) return Buffer.from(first.b64_json, "base64");

  if (first?.url) {
    const imageResponse = await fetch(first.url);
    if (!imageResponse.ok) {
      throw new Error(`Generated image URL failed with HTTP ${imageResponse.status}`);
    }
    return Buffer.from(await imageResponse.arrayBuffer());
  }

  throw new Error("OpenAI image response did not include b64_json or url data");
};

const main = async () => {
  const args = parseArgs();
  await loadDotenvLocal();

  const selected = selectAssets(args);
  const missingKey = !process.env.OPENAI_API_KEY;

  console.log(`Asset manifest: ${assetManifest.length} total assets`);
  console.log(`Selected: ${selected.length} asset${selected.length === 1 ? "" : "s"}`);

  if (args.dryRun) {
    for (const asset of selected) {
      const outputPath = outputPathFor(asset);
      const state = existsSync(outputPath) ? "exists" : "missing";
      console.log(`[dry-run] ${asset.id} -> ${asset.file} (${state})`);
    }
    return;
  }

  if (missingKey) {
    throw new Error("OPENAI_API_KEY is missing. Add it to .env.local or export it before running assets:generate.");
  }

  let generated = 0;
  let skipped = 0;

  for (const asset of selected) {
    const outputPath = outputPathFor(asset);

    if (existsSync(outputPath) && !args.force) {
      skipped += 1;
      console.log(`[skip] ${asset.id} already exists at ${asset.file}`);
      continue;
    }

    console.log(`[generate] ${asset.id} (${asset.size})`);
    await mkdir(path.dirname(outputPath), { recursive: true });
    const image = await fetchGeneratedImage(asset);
    await writeFile(outputPath, image);
    generated += 1;
    console.log(`[saved] ${asset.file}`);
  }

  console.log(`Done. Generated ${generated}, skipped ${skipped}.`);
  console.log("To use generated art in the app, set NEXT_PUBLIC_USE_GENERATED_ASSETS=true in .env.local and restart Next.js.");
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[assets:generate] ${message}`);
  process.exitCode = 1;
});
