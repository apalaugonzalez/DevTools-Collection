// src/app/api/find-emails/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { chromium } from 'playwright'    // or 'playwright-chromium'

const EMAIL_REGEX = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g

export async function POST(request: Request) {
  let raw: unknown
  try {
    raw = (await request.json()).url
  } catch {
    raw = null
  }
  if (typeof raw !== 'string' || !raw.trim()) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 })
  }
  const url = raw.trim().startsWith('http') ? raw.trim() : `https://${raw.trim()}`

  try {
    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.goto(url, { timeout: 20_000 })
    const html = await page.content()
    const hrefs = await page.$$eval(
      'a[href]',
      (els: HTMLAnchorElement[]) => els.map(el => el.href)
    )
    await browser.close()

    const text = html + ' ' + hrefs.join(' ')
    const emails = Array.from(new Set(text.match(EMAIL_REGEX) ?? []))
    return NextResponse.json({ emails })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}