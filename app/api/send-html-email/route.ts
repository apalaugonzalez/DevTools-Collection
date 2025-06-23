import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  // 1) Parse JSON
  let body: unknown
  try {
    body = await request.json()
  } catch (err) {
    console.error('[send-email] JSON parse error:', err)
    return NextResponse.json(
      { error: 'Invalid JSON payload', details: String(err) },
      { status: 400 }
    )
  }

  // 2) Validate payload
  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      { error: 'Payload must be an object' },
      { status: 400 }
    )
  }
  const payload = body as Record<string, unknown>
  const toVal = payload.to
  const subjectVal = payload.subject
  const templateVal = payload.template
  const messageVal = payload.message

  if (
    typeof toVal !== 'string' ||
    typeof subjectVal !== 'string' ||
    typeof templateVal !== 'string'
  ) {
    return NextResponse.json(
      { error: 'Missing or invalid fields: to, subject, template' },
      { status: 400 }
    )
  }

  const to = toVal.trim()
  const subject = subjectVal.trim()
  const template = templateVal.trim()

  // 3) Load template file (fallback to message body)
  let htmlBody = typeof messageVal === 'string' ? messageVal : ''
  try {
    htmlBody = await fs.readFile(
      path.join(process.cwd(), 'emails', `${template}.html`),
      'utf8'
    )
  } catch {
    // Use provided message if template file doesn't exist
  }

  // 4) Handle environment variables with fallback for cache issue
  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.purelymail.com',
    user: process.env.SMTP_USER || 'admin@apalaugonzalez.com',
    pass: process.env.SMTP_PASS === 'kg*93!hpm76@NQD' 
      ? 'kg*93$u!hpm76$3B@NQD'  // Correct password when env is cached
      : process.env.SMTP_PASS || 'kg*93$u!hpm76$3B@NQD',
    from: process.env.EMAIL_FROM || 'admin@apalaugonzalez.com'
  }

  // 5) Create transporter
  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: 587,
    secure: false,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
  })

  // 6) Send emails
  const recipients = to
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  try {
    for (const addr of recipients) {
      await transporter.sendMail({
        from: smtpConfig.from,
        to: addr,
        subject,
        html: htmlBody,
      })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[send-email] Error:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: 'Failed to send emails', details: msg },
      { status: 500 }
    )
  }
}