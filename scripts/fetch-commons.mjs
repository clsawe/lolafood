import { writeFileSync } from 'node:fs'

const QUERIES = {
  hotdog1: 'hot dog bun sausage',
  hotdog2: 'two hot dogs',
  hotdogKanad1: 'hot dog cheese sauce',
  hotdogKanad2: 'cheese dog',
  kfc05: 'fried chicken pieces',
  kfc1: 'fried chicken bucket',
  kfc05kg: 'fried chicken drumstick',
  kfc1kg: 'fried chicken plate',
  friOddiy: 'french fries paper cup',
  friZakaznoy: 'french fries portion',
  cola: 'Coca-Cola bottle',
  fanta: 'Fanta bottle',
  sprite: 'Sprite bottle',
  icetea: 'iced tea bottle',
  suv: 'bottled water plastic',
  mors: 'fruit drink glass compote',
  energo: 'energy drink can',
}

const out = {}

for (const [key, q] of Object.entries(QUERIES)) {
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json' +
    '&generator=search&gsrnamespace=6&gsrlimit=4&prop=imageinfo&iiprop=url|mime|size' +
    `&iiurlwidth=640&origin=*&gsrsearch=${encodeURIComponent('filetype:bitmap ' + q)}`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'LolaLavashMenu/1.0' } })
    const json = await res.json()
    const pages = Object.values(json.query?.pages ?? {})
    out[key] = pages
      .filter((p) => p.imageinfo?.[0]?.mime?.startsWith('image/'))
      .map((p) => ({
        title: p.title,
        url: p.imageinfo[0].thumburl,
        w: p.imageinfo[0].width,
        h: p.imageinfo[0].height,
      }))
  } catch (e) {
    out[key] = [{ title: 'ERROR ' + e.message, url: '' }]
  }
}

writeFileSync('scripts/candidates.json', JSON.stringify(out, null, 2))
console.log('keys:', Object.keys(out).length)
for (const [k, v] of Object.entries(out)) console.log(k, v.length, v[0]?.title)
