// Fetches Korean restaurant name + location data from OpenStreetMap (via the Overpass API).
// Free, no API key, ODbL-licensed data that is safe to store permanently (with attribution).
// Usage: node scripts/fetch-korean-restaurants.mjs
//
// A single whole-country query times out on the public Overpass instance, so this
// queries state-by-state (sequentially, with a delay — per Overpass's fair-use policy).

import { writeFile } from 'node:fs/promises'

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

// States with the largest Korean-American populations / Koreatowns.
// Extend this list to cover more states if needed.
const STATES = [
  'US-CA', 'US-NY', 'US-NJ', 'US-TX', 'US-IL', 'US-GA', 'US-WA',
  'US-VA', 'US-MD', 'US-DC', 'US-NV', 'US-PA', 'US-MA', 'US-CO',
  'US-FL', 'US-MI', 'US-OH', 'US-MN', 'US-OR', 'US-HI',
]

function buildQuery(isoCode) {
  return `
[out:json][timeout:90];
area["ISO3166-2"="${isoCode}"]->.a;
(
  node["amenity"="restaurant"]["cuisine"~"korean",i](area.a);
  way["amenity"="restaurant"]["cuisine"~"korean",i](area.a);
);
out center tags;
`
}

async function queryState(isoCode) {
  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: '*/*',
      'User-Agent': 'obang-korean-food-site/0.1 (personal project)',
    },
    body: 'data=' + encodeURIComponent(buildQuery(isoCode)),
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  const json = await res.json()
  if (json.remark) {
    throw new Error(json.remark)
  }
  return json.elements ?? []
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const seen = new Map()

  for (const isoCode of STATES) {
    process.stdout.write(`${isoCode} 조회 중... `)
    try {
      const elements = await queryState(isoCode)
      let added = 0

      for (const el of elements) {
        const tags = el.tags ?? {}
        const name = tags.name
        if (!name) continue

        const lat = el.type === 'node' ? el.lat : el.center?.lat
        const lon = el.type === 'node' ? el.lon : el.center?.lon
        if (lat == null || lon == null) continue

        const addressParts = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ')
        const city = tags['addr:city'] ?? ''
        const state = tags['addr:state'] ?? isoCode.replace('US-', '')

        const key = `${name.toLowerCase()}|${lat.toFixed(4)}|${lon.toFixed(4)}`
        if (seen.has(key)) continue

        seen.set(key, {
          osmId: `${el.type}/${el.id}`,
          name,
          lat,
          lon,
          address: addressParts || undefined,
          city: city || undefined,
          state: state || undefined,
          phone: tags.phone ?? tags['contact:phone'] ?? undefined,
          website: tags.website ?? tags['contact:website'] ?? undefined,
        })
        added++
      }
      console.log(`${elements.length}건 원본 → ${added}건 신규`)
    } catch (err) {
      console.log(`실패 (${err.message}) — 건너뜀`)
    }

    await sleep(1500) // Overpass fair-use: don't hammer the shared public instance
  }

  const results = Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name))

  const outPath = new URL('./output/korean-restaurants-osm.json', import.meta.url)
  await writeFile(outPath, JSON.stringify(results, null, 2), 'utf-8')

  console.log(`\n총 ${results.length}곳 수집 완료 → scripts/output/korean-restaurants-osm.json`)

  const byState = results.reduce((acc, r) => {
    const key = r.state || '(정보 없음)'
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})
  console.log('\n주(state)별 분포:')
  for (const [state, count] of Object.entries(byState).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${state}: ${count}`)
  }
}

main().catch((err) => {
  console.error('실패:', err.message)
  process.exit(1)
})
