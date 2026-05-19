import { NextResponse } from "next/server";
import { readJson, writeJson, getStylePath } from "@/lib/file-storage";
import { StyleConfig, DEFAULT_STYLE } from "@/types/style";

export async function GET() {
  const style = await readJson<StyleConfig>(getStylePath());
  return NextResponse.json(style ?? DEFAULT_STYLE);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json() as StyleConfig;
    const updated: StyleConfig = { ...body, updatedAt: new Date().toISOString() };
    await writeJson(getStylePath(), updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
