import { readFileSync, writeFileSync } from 'node:fs'

const data = JSON.parse(readFileSync('scripts/candidates.json', 'utf8'))
const keys = Object.keys(data)
const CHUNK = 6

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

for (let c = 0; c * CHUNK < keys.length; c++) {
  const group = keys.slice(c * CHUNK, c * CHUNK + CHUNK)
  const rows = group
    .map((key) => {
      const cells = data[key]
        .map(
          (it, i) => `
        <figure>
          <img src="${it.url}" alt="" loading="eager" />
          <figcaption><b>${key}#${i}</b><br />${esc(it.title)}</figcaption>
        </figure>`,
        )
        .join('')
      return `<section><h2>${key}</h2><div class="row">${cells}</div></section>`
    })
    .join('')
  writeFileSync(
    `scripts/verify${c + 1}.html`,
    `<!doctype html><meta charset="utf-8" />
<style>
body{font:12px/1.4 monospace;margin:8px;background:#fff}
section{margin-bottom:10px;border-bottom:2px solid #d6001f}
h2{margin:4px 0;font-size:14px}
.row{display:flex;gap:6px;flex-wrap:wrap}
figure{margin:0;width:150px}
img{width:150px;height:150px;object-fit:cover;border:1px solid #ccc;background:#eee}
figcaption{font-size:10px}
</style>
${rows}`,
  )
}
console.log('pages:', Math.ceil(keys.length / CHUNK))
