import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseFeed, isRelevant, similar, toPost, slugify } from '../src/news.ts'

const rss = `<?xml version="1.0"?><rss><channel>
<item><title>How SAP and Microsoft Innovate Together to Deliver AI Value for the Enterprise</title>
<link>https://news.sap.com/2026/11/sap-microsoft-ai/</link><pubDate>Mon, 23 Nov 2026 10:00:00 +0000</pubDate>
<description><![CDATA[SAP and Microsoft expand Joule &amp; Copilot integration on SAP BTP.]]></description></item>
<item><title><![CDATA[SAP sponsors tennis finals in Turin]]></title><link>https://news.sap.com/2026/11/tennis/</link>
<pubDate>Mon, 23 Nov 2026 09:00:00 +0000</pubDate><description>Fans get live stats at the tennis finals.</description></item>
</channel></rss>`
const atom = `<feed><entry><title>Oracle cuts cloud prices</title><link rel="alternate" href="https://example.com/oracle"/>
<published>2026-11-23T08:00:00Z</published><summary>Oracle database pricing changes.</summary></entry>
<entry><title>SAP customers face S/4HANA migration deadline</title><link rel="alternate" href="https://example.com/s4"/>
<published>2026-11-22T08:00:00Z</published><summary>&lt;p&gt;ECC support ends in 2027.&lt;/p&gt;&lt;p&gt;Second para.&lt;/p&gt;</summary></entry></feed>`

test('parses RSS and keeps SAP tech news, drops sponsorship', () => {
  const items = parseFeed(rss, 'SAP News Center')
  assert.equal(items.length, 2)
  assert.equal(items[0].summary, 'SAP and Microsoft expand Joule & Copilot integration on SAP BTP.')
  assert.equal(items[0].link, 'https://news.sap.com/2026/11/sap-microsoft-ai/')
  assert.deepEqual(items.map((i) => isRelevant(i, true)), [true, false])
})

test('parses Atom; general press needs an SAP mention', () => {
  const items = parseFeed(atom, 'Press')
  assert.deepEqual(items.map((i) => isRelevant(i)), [false, true])
  const p = toPost(items[1])
  assert.equal(p.excerpt, 'ECC support ends in 2027.')
  assert.deepEqual(p.body, ['Second para.'])
  assert.equal(p.slug, 'sap-customers-face-s4hana-migration-deadline')
})

test('dedups the same story across outlets', () => {
  assert.ok(similar('SAP and Microsoft expand AI partnership', 'Microsoft and SAP expand AI partnership for enterprise'))
  assert.ok(!similar('SAP Q3 earnings beat forecasts', 'SAP releases new ABAP Cloud tools'))
  assert.equal(slugify('Café: S/4HANA!'), 'cafe-s4hana')
})
