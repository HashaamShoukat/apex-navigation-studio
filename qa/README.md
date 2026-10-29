# QA harness

Renders Universal Theme 26.1 pages from the real `.apx` templates (Universal Theme's and Navigation Studio's) with the real
UT 26.1 CSS and JavaScript, so the designs can be checked without an APEX instance. Used for every screenshot, thumbnail and check.

## Setup (once)

1. **APEX 26.1 static files** - download `apex_26.1_en.zip` from Oracle, unzip `apex/images`, and link it as `qa/www/i`:
   `ln -s /path/to/apex/images qa/www/i`
2. **Universal Theme in APEXlang** - from SQLcl 26.x: unzip `mmd/26.1.0+3102/apexlang.zip` from `sqlcl/lib/ext/apexlang-compiler.jar`, unzip it,
   and set `UT_APEXLANG` to its `apexlangmeta/central-themes/8842.261/shared-components/themes/universal-theme` folder.
3. `npm install` in the repository root (terser for the build; Playwright with Chromium for the checks).

## Run

```bash
cd apexlang && node _src/build.mjs && node _src/pages.mjs && node _src/studio-pages.mjs && cd ..
node qa/pages.mjs                 # harness pages: www/side*.html, www/top*.html (Redwood / Vita, LTR / RTL)
node qa/server.cjs 8642 &         # serves www/, maps f?p=APP:PAGE:SESSION URLs to the harness pages
node qa/sweep.cjs                 # every design on six screens: horizontal scroll, menu control visible, console errors
node qa/contrast.cjs side         # every design x accent x scheme: text contrast >= 4.5:1
node qa/contrast.cjs top
node qa/thumbs.cjs                # gallery/<id>.jpg (full-size shots shrunk in a canvas)
node qa/studio-mock.mjs && node qa/studio-test.cjs   # Gallery and Designer logic against the demo pages
node qa/docs-pages.mjs && node qa/docs-images.cjs    # README images
node qa/gif.cjs && python3 qa/gif.py   # preview.gif
```

The look under test travels in the URL hash like in the Designer: `side.html#ns=<menu options>&nb=<bar options>&nsx=expanded|collapsed`.
