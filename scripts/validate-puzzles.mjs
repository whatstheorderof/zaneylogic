import { PACKS, buildPuzzle, countSolutions, normalizeSeed } from "../src/puzzle-engine.js";

const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const limit = limitArg ? normalizeSeed(limitArg.split("=")[1]) : 5000;
const allPacks = process.argv.includes("--all-packs");
const start = Date.now();
const failures = [];
let checked = 0;

const packs = allPacks ? PACKS : [undefined];

for (const pack of packs) {
  for (let seed = 1; seed <= limit; seed += 1) {
    const puzzle = buildPuzzle(seed, pack?.id);
    const count = countSolutions(puzzle, puzzle.clues, 2);
    checked += 1;
    if (count !== 1) {
      failures.push({ id: puzzle.id, seed, pack: puzzle.pack, count });
      if (failures.length >= 10) break;
    }
  }
  if (failures.length >= 10) break;
}

if (failures.length) {
  console.error("Puzzle validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure.id} (${failure.pack}): ${failure.count} solutions`);
  }
  process.exit(1);
}

const elapsed = ((Date.now() - start) / 1000).toFixed(2);
console.log(
  `Validated ${checked.toLocaleString()} Zaney Logic puzzles${allPacks ? " across every pack" : ""}: every case has exactly one solution. (${elapsed}s)`
);
