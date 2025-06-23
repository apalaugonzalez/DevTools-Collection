import { NextResponse } from 'next/server'
import fs from 'fs/promises'

export async function GET() {
  try {
    const content = await fs.readFile('email_logs.txt', 'utf8')
    return NextResponse.json({ logs: content.split('\n') })
  } catch {
    return NextResponse.json({ logs: [] })
  }
}