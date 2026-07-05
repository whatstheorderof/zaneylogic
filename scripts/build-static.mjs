import { cp, mkdir, rm, stat } from "node:fs/promises";

const outputDir = "public";
const entries = ["index.html", "styles.css", "site.webmanifest", "assets", "src"];

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const entry of entries) {
  await cp(entry, `${outputDir}/${entry}`, { recursive: true });
}

const index = await stat(`${outputDir}/index.html`);
if (!index.isFile()) {
  throw new Error("Static build failed: public/index.html was not created.");
}

console.log(`Built Zaney Logic static output in ${outputDir}/`);
