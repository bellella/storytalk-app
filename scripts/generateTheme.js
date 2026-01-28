// scripts/generate-colors-and-variables.js
//
// Usage:
//   node scripts/generate-colors-and-variables.js material-theme.json ../theme/colors.generated.js
//
// Output (ESM):
//   export const Colors = { scheme: { light: {...}, dark: {...} } }          // schemes only, HEX (RN friendly)
//   export const ColorVariables = { light: {...}, dark: {...} }              // schemes ALL keys + palettes ALL (0/50/.../950) in "--color-*", RAW OKLCH
//
// Rules (per your spec):
// - Tailwind object is NOT generated (for now)
// - Colors uses ONLY schemes.light/dark, includes ALL keys (HEX)
// - ColorVariables includes:
//     (A) ALL scheme keys -> "--color-<kebab(key)>" = RAW OKLCH
//     (B) ALL palettes.*  -> "--color-<paletteName>-<0|50|...|950>" = RAW OKLCH (Material->Tailwind step remap)
// - All variable names MUST start with "--color-"
// - RAW OKLCH format: "L% C h" (no oklch(), no alpha)

const fs = require("node:fs");
const path = require("node:path");

// ---------- Material(0/5/10/..100) -> Tailwind(0/50/..950) step mapping ----------
const TAILWIND_STEPS = [
  0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
];
const STEP_MAP = {
  0: "98",
  50: "95",
  100: "90",
  200: "80",
  300: "70",
  400: "60",
  500: "50",
  600: "40",
  700: "35",
  800: "30",
  900: "25",
  950: "20", // fallback to "100" if missing
};

// ---------- utils ----------
function assertHex(hex, ctx) {
  if (!/^#([0-9a-fA-F]{6})$/.test(hex)) {
    throw new Error(`Invalid HEX at ${ctx}: ${hex}`);
  }
}

function sortKeys(obj) {
  return Object.keys(obj)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .reduce((acc, k) => {
      acc[k] = obj[k];
      return acc;
    }, {});
}

function camelToKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

// ---------- build Colors (schemes only, ALL keys, HEX) ----------
function buildColorsFromSchemes(schemes) {
  const light = schemes.light;
  const dark = schemes.dark;
  if (!light || !dark) throw new Error("Missing schemes.light or schemes.dark");

  const outLight = {};
  for (const [k, hex] of Object.entries(light)) {
    assertHex(hex, `schemes.light.${k}`);
    outLight[k] = hex; // ✅ HEX 그대로
  }

  const outDark = {};
  for (const [k, hex] of Object.entries(dark)) {
    assertHex(hex, `schemes.dark.${k}`);
    outDark[k] = hex; // ✅ HEX 그대로
  }

  return {
    scheme: {
      light: sortKeys(outLight),
      dark: sortKeys(outDark),
    },
  };
}

// ---------- build ColorVariables (schemes ALL keys + palettes ALL mapped to 0/50/.../950, HEX) ----------
function buildVariables(schemes, palettes) {
  const light = schemes.light;
  const dark = schemes.dark;
  if (!light || !dark) throw new Error("Missing schemes.light or schemes.dark");

  const varsLight = {};
  const varsDark = {};

  // (A) schemes -> --color-<kebab(key)> = HEX
  for (const [k, hex] of Object.entries(light)) {
    assertHex(hex, `schemes.light.${k}`);
    varsLight[`--color-${camelToKebab(k)}`] = hex;
  }
  for (const [k, hex] of Object.entries(dark)) {
    assertHex(hex, `schemes.dark.${k}`);
    varsDark[`--color-${camelToKebab(k)}`] = hex;
  }

  // (B) palettes.* -> --color-<paletteName>-<0|50|...|950> = HEX
  if (!palettes || typeof palettes !== "object") {
    throw new Error("Missing palettes object in Material JSON");
  }

  for (const [paletteName, scale] of Object.entries(palettes)) {
    if (!scale || typeof scale !== "object") continue;

    for (const twStep of TAILWIND_STEPS) {
      const materialKey = STEP_MAP[twStep];

      // prefer mapped key; fallback to 100 if missing
      const hex = scale[materialKey] ?? scale["100"];
      if (!hex) {
        throw new Error(
          `palettes.${paletteName} missing "${materialKey}" and fallback "100"`
        );
      }

      assertHex(hex, `palettes.${paletteName}.${materialKey}`);

      const varName = `--color-${paletteName}-${twStep}`;
      // palettes는 보통 1세트라 light/dark 동일값으로 등록 (원하면 나중에 분리 가능)
      varsLight[varName] = hex;
      varsDark[varName] = hex;
    }
  }

  return {
    light: sortKeys(varsLight),
    dark: sortKeys(varsDark),
  };
}

// ---------- main ----------
function main() {
  const inputPath = process.argv[2] || "scripts/material-theme.json";
  const outputPath = process.argv[3] || "theme/colors.generated.ts";
  if (!inputPath) throw new Error("Input JSON path required");

  const material = JSON.parse(fs.readFileSync(inputPath, "utf8"));

  const schemes = material.schemes;
  if (!schemes?.light || !schemes?.dark) {
    throw new Error(
      "Material JSON must contain schemes.light and schemes.dark"
    );
  }

  const palettes = material.palettes;

  const Colors = buildColorsFromSchemes(schemes);
  const ColorVariables = buildVariables(schemes, palettes);

  const out = `/* eslint-disable */
// AUTO-GENERATED — DO NOT EDIT
// Source: Material Theme Builder
//
// Exports:
// - Colors: schemes only, HEX (RN friendly)
// - ColorVariables: schemes ALL keys + palettes ALL (0/50/.../950), RAW OKLCH in "--color-*"
//
// Notes:
// - palettes are exported as vars for BOTH light/dark (Material export typically provides one palette set)

export const Colors = ${JSON.stringify(Colors, null, 2)};

export const ColorVariables = ${JSON.stringify(ColorVariables, null, 2)};
`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, out, "utf8");
  console.log(`✅ Generated ${outputPath}`);
}

main();
