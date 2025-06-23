import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const emailsDirectory = path.join(process.cwd(), "emails");
    const files = await fs.readdir(emailsDirectory);
    const templates = files
      .filter((file) => file.endsWith(".html"))
      .map((file) => file.replace(/\.html$/, ""));

    return NextResponse.json(templates);
  } catch (err: unknown) {
    // Use 'unknown' instead of 'any'
    // Now, check if the error is an actual Error object
    if (err instanceof Error) {
      // If it is, we can safely access its 'message' property
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    // If it's not an Error object, handle it gracefully
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
