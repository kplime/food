// Maps common Korean dish/menu-category names to the romanized spellings that
// actually show up in US restaurant names (OSM data is almost entirely romanized,
// not Hangul), so a Korean-script search term like "칼국수" can still match
// a restaurant literally named "Hangari Kalguksu".
export const DISH_SYNONYMS: { ko: string[]; en: string[] }[] = [
  { ko: ['칼국수'], en: ['kalguksu', 'kal guksu', 'kal-guksu', 'kalgooksoo'] },
  { ko: ['순대국', '순댓국', '순대국밥'], en: ['sundae guk', 'sundaeguk', 'sundae gook', 'sundae gukbap'] },
  { ko: ['냉면'], en: ['naengmyeon', 'naeng myeon', 'nengmyun'] },
  { ko: ['삼겹살'], en: ['samgyeopsal', 'sam gyup sal', 'samgyupsal'] },
  { ko: ['갈비'], en: ['galbi', 'kalbi'] },
  { ko: ['비빔밥'], en: ['bibimbap', 'bi bim bap'] },
  { ko: ['김밥'], en: ['gimbap', 'kimbap'] },
  { ko: ['떡볶이'], en: ['tteokbokki', 'ddukbokki', 'dukbokki', 'topokki'] },
  { ko: ['순두부', '순두부찌개'], en: ['sundubu', 'soon tofu', 'soontofu', 'soft tofu'] },
  { ko: ['감자탕'], en: ['gamjatang', 'kamjatang'] },
  { ko: ['곱창'], en: ['gopchang', 'kopchang'] },
  { ko: ['족발'], en: ['jokbal', 'jokbal', 'pig feet'] },
  { ko: ['보쌈'], en: ['bossam', 'bo ssam'] },
  { ko: ['잡채'], en: ['japchae', 'jap chae'] },
  { ko: ['김치찌개'], en: ['kimchi jjigae', 'kimchi stew'] },
  { ko: ['된장찌개'], en: ['doenjang jjigae', 'doenjang stew'] },
  { ko: ['부대찌개'], en: ['budae jjigae', 'budae stew', 'army stew'] },
  { ko: ['닭갈비'], en: ['dak galbi', 'dakgalbi', 'dak-galbi'] },
  { ko: ['치킨'], en: ['chicken'] },
  { ko: ['국밥'], en: ['gukbap', 'kukbap'] },
  { ko: ['설렁탕'], en: ['seolleongtang', 'sulleongtang'] },
  { ko: ['곰탕'], en: ['gomtang', 'komtang'] },
  { ko: ['육개장'], en: ['yukgaejang', 'yook gae jang'] },
  { ko: ['만두'], en: ['mandu', 'mandoo', 'dumpling'] },
  { ko: ['파전', '해물파전'], en: ['pajeon', 'pa jun', 'seafood pancake'] },
  { ko: ['짜장면'], en: ['jjajangmyeon', 'jjajangmyun', 'black bean noodle'] },
  { ko: ['짬뽕'], en: ['jjamppong', 'jjambbong'] },
  { ko: ['우동'], en: ['udon'] },
  { ko: ['라면'], en: ['ramyeon', 'ramyun', 'ramen'] },
  { ko: ['포차', '소주방'], en: ['pocha', 'poja', 'soju bar'] },
  { ko: ['횟집', '회'], en: ['sashimi', 'hoe'] },
  { ko: ['두부'], en: ['tofu', 'dubu'] },
  { ko: ['콩나물국밥'], en: ['kongnamul gukbap', 'bean sprout soup'] },
  { ko: ['아구찜', '아귀찜'], en: ['agujjim', 'monkfish'] },
  { ko: ['닭볶음탕', '닭도리탕'], en: ['dakbokkeumtang', 'dak dori tang', 'spicy braised chicken'] },
  { ko: ['미역국'], en: ['miyeokguk', 'seaweed soup'] },
  { ko: ['삼계탕'], en: ['samgyetang', 'sam gye tang', 'ginseng chicken soup'] },
  { ko: ['빙수'], en: ['bingsu', 'patbingsu', 'shaved ice'] },
  { ko: ['호떡'], en: ['hotteok', 'hodduk'] },
  { ko: ['불고기'], en: ['bulgogi'] },
  { ko: ['제육볶음'], en: ['jeyuk bokkeum', 'jeyook', 'spicy pork'] },
  { ko: ['김치'], en: ['kimchi'] },
]

// Common city abbreviations people actually type, mapped to the full city name
// stored in the OSM addr:city tag (e.g. "LA" -> the data says "Los Angeles").
export const CITY_ALIASES: Record<string, string> = {
  la: 'los angeles',
  nyc: 'new york',
  ny: 'new york',
  sf: 'san francisco',
  dc: 'washington',
  atl: 'atlanta',
  chi: 'chicago',
  philly: 'philadelphia',
  vegas: 'las vegas',
  atx: 'austin',
  msp: 'minneapolis',
  sd: 'san diego',
}

// Given a search token, return every string it should also match against
// (itself, plus any romanized dish aliases or city-name aliases it maps to).
export function expandSearchToken(token: string): string[] {
  const t = token.toLowerCase().trim()
  if (!t) return []

  const expansions = new Set<string>([t])

  const city = CITY_ALIASES[t]
  if (city) expansions.add(city)

  for (const entry of DISH_SYNONYMS) {
    const koMatch = entry.ko.some((k) => k.includes(t) || t.includes(k))
    const enMatch = entry.en.some((e) => e.includes(t) || t.includes(e))
    if (koMatch || enMatch) {
      for (const alias of entry.en) expansions.add(alias)
      for (const alias of entry.ko) expansions.add(alias)
    }
  }
  return Array.from(expansions)
}
