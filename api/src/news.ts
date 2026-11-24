// SAP news auto-blog: pulls real articles from RSS/Atom feeds, keeps only SAP technology news,
// and publishes each one as a short post that quotes the source's own summary and links back to it.
// No text is generated: title and summary are the publisher's words, so nothing is made up.

export interface Feed { name: string; url: string; sapOnly?: boolean }

// Only feeds whose robots rules allow automated reading (SAP Community, The Register and Google News do not).
// sapOnly = every item is about SAP already (SAP's own feeds); others must mention SAP explicitly.
export const feeds: Feed[] = [
  { name: 'SAP News Center', url: 'https://news.sap.com/feed/', sapOnly: true },
  { name: 'diginomica', url: 'https://diginomica.com/feed' },
  { name: 'Computer Weekly', url: 'https://www.computerweekly.com/rss/All-Computer-Weekly-content.xml' },
]

export interface Item { title: string; link: string; summary: string; published: Date; source: string }

const SAP_TERM = /\bSAP\b|S\/4\s?HANA|\bBTP\b|\bABAP\b|\bFiori\b|SuccessFactors|\bAriba\b|\bConcur\b|\bHANA\b|\bJoule\b|\bSignavio\b|\bLeanIX\b|Business ByDesign|Business One|RISE with SAP|GROW with SAP/
// Must also be about work/technology (filters SAP brand, sponsorship and lifestyle pieces).
const TECH_TERM = /\b(ERP|cloud|AI|artificial intelligence|machine learning|agent|data|analytics|database|integration|platform|software|release|update|upgrade|migration|implementation|developer|API|security|vulnerabilit|patch|CVE|S\/4\s?HANA|BTP|ABAP|Fiori|HANA|finance|procurement|supply chain|HR|HCM|payroll|CRM|customer|partner|license|licen[cs]ing|subscription|earnings|revenue|quarter|acquisition|acquire|launch|announce|automation|ECC|on-premise|hyperscaler|AWS|Azure|Google Cloud|consult|module|configuration|S\/4)\b/i
const OFF_TOPIC = /\b(sport|sports|tennis|football|soccer|NBA|NHL|NFL|Formula 1|F1|golf|sailing|olympic|stadium|athlete|sponsor|sponsorship|charity|volunteer|philanthrop|concert|music|recipe|celebrity|fashion|horoscope|giveaway|sweepstake|contest)\b/i

export function isRelevant(it: Item, sapOnly = false): boolean {
  const text = `${it.title} ${it.summary}`
  if (OFF_TOPIC.test(text)) return false
  if (!sapOnly && !SAP_TERM.test(text)) return false
  return TECH_TERM.test(text)
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', ndash: '–', mdash: '—' }
const decode = (s: string) => s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e: string) =>
  e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENTITIES[e.toLowerCase()] ?? m)
const cdata = (s: string) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')

// HTML → plain paragraphs. Drops scripts/styles/figures and the "The post X appeared first on Y" footer WordPress adds.
export function toParagraphs(html: string): string[] {
  // Decode first too: Atom/RSS often carry escaped HTML (&lt;p&gt;).
  const text = decode(decode(cdata(html))
    .replace(/<(script|style|figure|figcaption)[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/(p|div|li|h\d)>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ''))
  return text.split(/\n+/).map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => p && !/^The post .* appeared first on /i.test(p) && !/^(Read more|Continue reading)\b/i.test(p))
}

const tag = (xml: string, name: string) => xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'))?.[1] ?? ''

// shortcut: regex parser for RSS 2.0 and Atom only, enough for well-formed news feeds; swap for an XML library if a feed breaks it.
export function parseFeed(xml: string, source: string): Item[] {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/gi) ?? []
  return blocks.map((b) => {
    const atomLink = b.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i)?.[1] ?? b.match(/<link[^>]*href=["']([^"']+)["']/i)?.[1]
    const link = decode(cdata(tag(b, 'link')).trim() || atomLink || '')
    const date = tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated') || tag(b, 'dc:date')
    return {
      title: toParagraphs(tag(b, 'title')).join(' '),
      link,
      summary: toParagraphs(tag(b, 'description') || tag(b, 'summary') || tag(b, 'content')).join('\n'),
      published: new Date(cdata(date).trim()),
      source,
    }
  }).filter((it) => it.title && /^https?:\/\//.test(it.link) && !isNaN(it.published.getTime()))
}

export const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-').slice(0, 80).replace(/-$/, '')

const words = (s: string) => new Set(s.toLowerCase().match(/[a-z0-9/]{3,}/g) ?? [])
// Same story from two outlets: most title words shared.
export function similar(a: string, b: string): boolean {
  const x = words(a), y = words(b)
  if (!x.size || !y.size) return false
  let shared = 0
  for (const w of x) if (y.has(w)) shared++
  return shared / Math.min(x.size, y.size) >= 0.7
}

// Excerpt is the publisher's first paragraph; the body holds any further paragraphs of their summary.
export const toPost = (it: Item) => {
  const [excerpt = it.title, ...rest] = it.summary.split('\n').filter(Boolean)
  return {
    slug: slugify(it.title),
    title: it.title,
    excerpt,
    body: rest,
    readMinutes: Math.max(1, Math.round(`${excerpt} ${rest.join(' ')}`.split(/\s+/).length / 200)),
  }
}

async function fetchFeed(f: Feed): Promise<Item[]> {
  const res = await fetch(f.url, { signal: AbortSignal.timeout(20_000), headers: { 'user-agent': 'Config2Consult-NewsBot/1.0 (+https://config2consult.store)', accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const xml = await res.text()
  return parseFeed(xml.slice(0, 5_000_000), f.name).filter((it) => isRelevant(it, f.sapOnly))
}

const MAX_AGE_DAYS = Number(process.env.NEWS_MAX_AGE_DAYS ?? 7)
const MAX_PER_RUN = Number(process.env.NEWS_MAX_PER_RUN ?? 5)

export async function runNewsOnce(): Promise<number> {
  // Loaded here so the parsing helpers can be tested without a database.
  const [{ q }, { redis }] = await Promise.all([import('./db.js'), import('./redis.js')])
  // One run at a time, even with several API containers.
  if (!(await redis.set('news:lock', '1', 'EX', 600, 'NX'))) return 0
  try {
    const cutoff = Date.now() - MAX_AGE_DAYS * 86_400_000
    const items: Item[] = []
    for (const f of feeds) {
      try { items.push(...await fetchFeed(f)) } catch (e) { console.warn(`news: ${f.name} skipped (${(e as Error).message})`) }
    }
    const { rows: recent } = await q<{ title: string; source_url: string | null }>(
      `SELECT title, source_url FROM blog_posts WHERE published_at > now() - interval '60 days'`)
    const seenTitles = recent.map((r) => r.title)
    const seenUrls = new Set(recent.map((r) => r.source_url))

    let added = 0
    for (const it of items.filter((i) => i.published.getTime() > cutoff).sort((a, b) => b.published.getTime() - a.published.getTime())) {
      if (added >= MAX_PER_RUN) break
      if (seenUrls.has(it.link) || seenTitles.some((t) => similar(t, it.title))) continue
      const p = toPost(it)
      if (!p.slug) continue
      const r = await q(
        `INSERT INTO blog_posts (slug, title, excerpt, category, author, read_minutes, body, published_at, source_url, source_name)
         VALUES ($1,$2,$3,'SAP News',$4,$5,$6,$7,$8,$4) ON CONFLICT DO NOTHING`,
        [p.slug, p.title, p.excerpt, it.source, p.readMinutes, p.body, it.published, it.link])
      seenTitles.push(it.title); seenUrls.add(it.link)
      added += r.rowCount ?? 0
    }
    if (added) { await redis.del('blogs:all'); console.log(`news: published ${added} SAP news posts`) }
    return added
  } finally {
    await redis.del('news:lock')
  }
}

export function startNewsScheduler() {
  const hours = Number(process.env.NEWS_INTERVAL_HOURS ?? 6)
  if (!(hours > 0)) return console.log('news: auto-publishing off (NEWS_INTERVAL_HOURS=0)')
  const run = () => runNewsOnce().catch((e) => console.error('news: run failed', e))
  setTimeout(run, 30_000)
  setInterval(run, hours * 3_600_000)
  console.log(`news: auto-publishing every ${hours}h`)
}
