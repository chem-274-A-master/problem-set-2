# PDF build

Requires Node.js 18 or newer. On minimal Debian/Ubuntu installations, Chromium
may also require `libnss3` (`sudo apt-get install libnss3`).

Install dependencies and generate `instructions.pdf` from `instructions.md`:

```bash
cd .pdf-build
npm ci
npm run build
```

The build renders equations locally with KaTeX and uses Puppeteer to print the
document with background colors enabled. Its intermediate HTML file is removed
automatically.

For a temporary full-document PNG preview, run `npm run build -- --preview`.
The preview is written to the operating system's temporary directory.
