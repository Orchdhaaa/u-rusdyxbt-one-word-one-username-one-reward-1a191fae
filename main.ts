import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = "orchdhaaa";

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

function validateEntry(value) {
  const bytes = Buffer.from(value, "utf8");
  if (bytes.length < 1 || bytes.length > 30) {
    fail("entry must be 1-30 bytes");
  }
  if (bytes.length !== value.length) {
    fail("entry must be plain ASCII");
  }
  if (/\s/.test(value)) {
    fail("entry must be a single word with no whitespace");
  }
  return bytes;
}

const entryBytes = validateEntry(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });

const target = join(outDir, "entry.txt");
writeFileSync(target, ENTRY, "utf8");

const back = readFileSync(target);
if (!back.equals(entryBytes)) {
  fail("read-back mismatch after writing entry.txt");
}

console.log(`wrote ${target} (${ENTRY.length} chars)`);
