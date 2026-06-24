// Kiểm tra pipeline render Markdown (marked) + công thức (KaTeX).
const puppeteer = require('puppeteer-core');
const path = require('path');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(__dirname, '..');
const url = 'file:///' + path.join(ROOT, 'frontend', 'index.html').replace(/\\/g, '/');
(async () => {
  const b = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.goto(url, { waitUntil: 'networkidle0' });
  const r = await p.evaluate(() => {
    const out = { marked: typeof marked, katex: typeof renderMathInElement };
    const d = document.createElement('div');
    document.body.appendChild(d);
    renderMarkdown("Cho $f(x)=x^2$ thì $f'(x)=2x$.\n\n## Tiêu đề\n\n- mục 1", d);
    out.katexCount = d.querySelectorAll('.katex').length;
    out.hasH2 = !!d.querySelector('h2');
    return out;
  });
  console.log(JSON.stringify(r, null, 2));
  await b.close();
})();
