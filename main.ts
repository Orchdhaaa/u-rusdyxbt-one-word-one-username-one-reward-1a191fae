import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// One word, one username: the entrant's own make.fun handle, nothing else.
// The judge's first criterion is that the entry is a real make.fun username,
// the entrant's own handle sent as one word, so the word is fixed: orchdhaaa.
const WORD = "orchdhaaa";

function resolveOutDir(): string {
  return (
    process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output"
  );
}

function writeEntry(word: string, outDir: string): string {
  // The gate only accepts UTF-8 text of 1 to 30 characters that is not
  // whitespace-only, and the entry must be exactly one word, so verify the
  // word meets the gate and holds no whitespace before writing it.
  const codePoints = [...word].length;
  if (codePoints < 1 || codePoints > 30 || word.trim().length === 0) {
    throw new Error(
      `entry word is ${codePoints} code points, outside the 1-30 gate`,
    );
  }
  if (/\s/.test(word)) {
    throw new Error("entry must be exactly one word with no whitespace");
  }
  mkdirSync(outDir, { recursive: true });
  const outFile = `${outDir}/entry.txt`;
  writeFileSync(outFile, word, "utf8");
  const back = readFileSync(outFile, "utf8");
  if (back !== word) {
    throw new Error("read-back mismatch: written file differs from the word");
  }
  return outFile;
}

const outFile = writeEntry(WORD, resolveOutDir());
console.log(`wrote ${[...WORD].length} code points to ${outFile}`);
