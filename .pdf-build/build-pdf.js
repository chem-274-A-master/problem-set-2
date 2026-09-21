#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const katex = require("katex");
const { marked } = require("marked");
const puppeteer = require("puppeteer");

const buildDirectory = __dirname;
const projectDirectory = path.resolve(buildDirectory, "..");
const markdownPath = path.join(projectDirectory, "instructions.md");
const pdfPath = path.join(projectDirectory, "instructions.pdf");
const temporaryHtmlPath = path.join(buildDirectory, ".rendered.html");
const checkOnly = process.argv.includes("--check");
const createPreview = process.argv.includes("--preview");

const mathExtension = {
  extensions: [
    {
      name: "displayMath",
      level: "block",
      start(source) {
        return source.indexOf("$$");
      },
      tokenizer(source) {
        const match = /^\$\$[ \t]*(?:\n)?([\s\S]+?)(?:\n)?\$\$[ \t]*(?:\n|$)/.exec(source);
        if (!match) return undefined;
        return { type: "displayMath", raw: match[0], text: match[1].trim() };
      },
      renderer(token) {
        return `${katex.renderToString(token.text, {
          displayMode: true,
          output: "html",
          strict: "error",
          throwOnError: true,
        })}\n`;
      },
    },
    {
      name: "inlineMath",
      level: "inline",
      start(source) {
        return source.indexOf("$");
      },
      tokenizer(source) {
        const match = /^\$([^$\n]+?)\$/.exec(source);
        if (!match) return undefined;
        return { type: "inlineMath", raw: match[0], text: match[1] };
      },
      renderer(token) {
        return katex.renderToString(token.text, {
          displayMode: false,
          output: "html",
          strict: "error",
          throwOnError: true,
        });
      },
    },
  ],
};

marked.use(mathExtension);
marked.setOptions({ gfm: true, headerIds: true, mangle: false });

function buildHtml(markdown) {
  const katexCssPath = path.join(buildDirectory, "node_modules/katex/dist/katex.min.css");
  const katexFontDirectoryUrl = pathToFileURL(
    path.join(buildDirectory, "node_modules/katex/dist/fonts") + path.sep,
  ).href;
  const katexCss = fs
    .readFileSync(katexCssPath, "utf8")
    .replaceAll("url(fonts/", `url(${katexFontDirectoryUrl}`);
  const content = marked.parse(markdown);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Problem Set 2</title>
  <style>
    ${katexCss}
    :root {
      color: #1f2937;
      font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 10.5pt;
      line-height: 1.48;
    }
    @page { size: Letter; margin: 0.55in 0.65in 0.6in; }
    * { box-sizing: border-box; }
    body { margin: 0; background: white; }
    main { max-width: 7.2in; margin: 0 auto; }
    h1, h2, h3 { color: #17365d; line-height: 1.2; break-after: avoid; }
    h1 { margin: 0 0 0.5em; padding-bottom: 0.28em; border-bottom: 2px solid #6baed6; font-size: 23pt; }
    h2 { margin: 1.25em 0 0.45em; padding-bottom: 0.18em; border-bottom: 1px solid #b8d8eb; font-size: 16pt; }
    h3 { margin: 1.05em 0 0.35em; font-size: 12.5pt; }
    p { margin: 0.52em 0; orphans: 3; widows: 3; }
    a { color: #0969da; text-decoration: none; }
    code { padding: 0.08em 0.28em; border-radius: 3px; background: #f1f5f9; font-size: 0.92em; }
    ol, ul { margin: 0.45em 0; padding-left: 1.55em; }
    li { margin: 0.28em 0; }
    li > p { margin: 0.28em 0; }
    img { max-width: 100%; height: auto; }
    center { break-inside: avoid; margin: 0.8em 0; }
    .callout {
      margin: 0.75em 0 1.25em;
      padding: 0.75em 1em;
      border: 1px solid #f0d98b;
      border-left: 5px solid #d6a514;
      border-radius: 5px;
      background: #fff7d6;
      color: #624b08;
      break-inside: avoid;
    }
    .callout p { margin: 0.35em 0 0.65em; }
    .callout p:last-child { margin-bottom: 0; }
    .callout-note {
      border-color: #a8cde5;
      border-left-color: #3b82b6;
      background: #eaf4fb;
      color: #173f5f;
    }
    .callout-note h2 {
      margin-top: 0.2em;
      color: #173f5f;
      border-bottom-color: #a8cde5;
    }
    .katex-display { margin: 0.72em 0; break-inside: avoid; }
    .katex { font-size: 1.08em; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      a { color: #0969da; }
    }
  </style>
</head>
<body><main>${content}</main></body>
</html>`;
}

async function main() {
  const markdown = fs.readFileSync(markdownPath, "utf8");
  const html = buildHtml(markdown);

  if (html.includes("$$")) {
    throw new Error("Unrendered display-math delimiter found in generated HTML.");
  }
  const documentIds = new Set(
    Array.from(html.matchAll(/\sid="([^"]+)"/g), (match) => match[1]),
  );
  const missingInternalTargets = Array.from(
    html.matchAll(/href="#([^"]+)"/g),
    (match) => match[1],
  ).filter((target) => !documentIds.has(target));
  if (missingInternalTargets.length > 0) {
    throw new Error(
      `Internal links have no matching heading: ${missingInternalTargets.join(", ")}`,
    );
  }
  if (checkOnly) {
    console.log("Markdown and all equations rendered successfully.");
    return;
  }

  fs.writeFileSync(temporaryHtmlPath, html);
  let browser;
  try {
    const localLibraryDirectory = path.join(
      buildDirectory,
      ".cache/system-libs/usr/lib/x86_64-linux-gnu",
    );
    const launchEnvironment = { ...process.env };
    if (fs.existsSync(localLibraryDirectory)) {
      launchEnvironment.LD_LIBRARY_PATH = [
        localLibraryDirectory,
        process.env.LD_LIBRARY_PATH,
      ]
        .filter(Boolean)
        .join(path.delimiter);
    }
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--allow-file-access-from-files", "--no-sandbox"],
      env: launchEnvironment,
    });
    const page = await browser.newPage();
    await page.goto(pathToFileURL(temporaryHtmlPath).href, { waitUntil: "networkidle0" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images, (image) =>
          image.complete
            ? Promise.resolve()
            : new Promise((resolve, reject) => {
                image.addEventListener("load", resolve, { once: true });
                image.addEventListener("error", reject, { once: true });
              }),
        ),
      );
    });
    if (createPreview) {
      const previewPath = path.join(os.tmpdir(), "chem274a-instructions-preview.png");
      await page.screenshot({ path: previewPath, fullPage: true });
      console.log(`Wrote visual preview to ${previewPath}`);
    }
    await page.pdf({
      path: pdfPath,
      format: "Letter",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    });
    console.log(`Built ${path.relative(projectDirectory, pdfPath)}`);
  } finally {
    if (browser) await browser.close();
    fs.rmSync(temporaryHtmlPath, { force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
