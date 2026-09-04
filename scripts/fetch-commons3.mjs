import { readFileSync, writeFileSync } from 'node:fs'

const QUERIES = {
  kfc05kg: 'fried chicken wings',
  kfc1kg: 'fried chicken platter',
  icetea: 'ice tea bottle plastic',
  energo: 'energy drink can table',
  hotdogKanad2: 'hot dogs with cheese',
}

const prev = JSON.parse(readFileSync('scripts/candidates.json', 'utf8'))
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

for (const [key, q] of Object.entries(QUERIES)) {
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json' +
    '&generator=search&gsrnamespace=6&gsrlimit=4&prop=imageinfo&iiprop=url|mime|size' +
    `&iiurlwidth=640&origin=*&gsrsearch=${encodeURIComponent('filetype:bitmap ' + q)}`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'LolaLavashMenu/1.0 (menu image research)' },
    })
    const json = await res.json()
    const pages = Object.values(json.query?.pages ?? {})
    const items = pages
      .filter((p) => p.imageinfo?.[0]?.mime?.startsWith('image/'))
      .map((p) => ({
        title: p.title,
        url: p.imageinfo[0].thumburl,
        w: p.imageinfo[0].width,
        h: p.imageinfo[0].height,
      }))
    if (items.length) prev[key] = items
  } catch (e) {
    console.log(key, 'ERR', e.message)
  }
  await sleep(1500)
}

writeFileSync('scripts/candidates.json', JSON.stringify(prev, null, 2))
console.log('updated', Object.keys(QUERIES).join(', '))
