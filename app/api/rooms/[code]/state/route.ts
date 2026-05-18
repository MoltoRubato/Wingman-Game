import { NextResponse } from "next/server";
import { z } from "zod";
import { getRoomView } from "@/lib/server/game";

const Query = z.object({ sid: z.string().uuid() });

export async function GET(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const url = new URL(req.url);
  let parsed;
  try {
    parsed = Query.parse({ sid: url.searchParams.get("sid") });
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  try {
    const view = await getRoomView(code.toUpperCase(), parsed.sid);
    return NextResponse.json(view);
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
