import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const files = await fs.readdir(path.join(process.cwd(), "emails"));
    const templates = files
      .filter((f) => f.endsWith(".html"))
      .map((f) => f.replace(/\.html$/, ""));
    return NextResponse.json(templates);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
