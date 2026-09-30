import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const script = await readFile(new URL("../script.js", import.meta.url), "utf8");
const styles = await readFile(new URL("../style.css", import.meta.url), "utf8");

test("exposes the knob as a vertical slider with its initial value", () => {
  const knob = html.match(/<div(?=[^>]*\bid="knob")[^>]*>/)?.[0];

  assert.ok(knob, "expected the volume knob slider");
  assert.match(knob, /role="slider"/);
  assert.match(knob, /tabindex="0"/);
  assert.match(knob, /aria-orientation="vertical"/);
  assert.match(knob, /aria-valuemin="0"/);
  assert.match(knob, /aria-valuemax="100"/);
  assert.match(knob, /aria-valuenow="0"/);
  assert.match(knob, /aria-valuetext="0 percent"/);
  assert.match(knob, /aria-describedby="sliderInstructions"/);
});

test("documents and handles the standard slider keys", () => {
  for (const key of [
    "ArrowUp",
    "ArrowRight",
    "ArrowDown",
    "ArrowLeft",
    "PageUp",
    "PageDown",
    "Home",
    "End",
  ]) {
    assert.match(script, new RegExp(`(?:${key}:|key === ["']${key}["'])`));
  }

  assert.match(script, /event\.preventDefault\(\)/);
  assert.match(script, /addEventListener\("keydown", handleKnobKeydown\)/);
});

test("keeps the accessible value synchronized and honors reduced motion", () => {
  assert.match(script, /setAttribute\("aria-valuenow", String\(volume\)\)/);
  assert.match(script, /setAttribute\("aria-valuetext", `\$\{volume\} percent`\)/);
  assert.match(styles, /\.knob:focus-visible/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.shake\s*{\s*animation: none;/);
});
