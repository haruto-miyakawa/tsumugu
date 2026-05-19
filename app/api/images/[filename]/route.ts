import fs from "fs/promises";
import { NextResponse } from "next/server";
import { getImagePath } from "@/lib/file-storage";

export async function GET(_req: Request, ctx: RouteContext<"/api/images/[filename]">) {
  const { filename } = await ctx.params;
  try {
    const buffer = await fs.readFile(getImagePath(filename));
    const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
    const contentType =
      ext === "png" ? "image/png" :
      ext === "gif" ? "image/gif" :
      ext === "webp" ? "image/webp" :
      "image/jpeg";
    return new Response(buffer, { headers: { "Content-Type": contentType } });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
