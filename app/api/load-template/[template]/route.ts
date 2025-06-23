// app/api/load-template/[template]/route.ts
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: Request,
  context: { params: Promise<{ template: string }> }
) {
  // await the params object first
  const { template } = await context.params
  try {
    const html = await fs.readFile(path.join(process.cwd(), 'emails', `${template}.html`), 'utf8')
    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch {
    return NextResponse.json({ error: `Template "${template}" not found.` }, { status: 404 })
  }
}