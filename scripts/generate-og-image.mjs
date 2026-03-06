import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../client/public");
const svgBuffer = readFileSync(resolve(publicDir, "og-image.svg"));

await sharp(svgBuffer)
  .resize(1200, 630)
  .png()
  .toFile(resolve(publicDir, "og-image.png"));

console.log("Generated og-image.png (1200x630)");
