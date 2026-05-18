import { NextResponse } from "next/server";
import { z } from "zod";
import { handleAction } from "@/lib/server/game";

const Body = z.object({
  sessionId: z.string().uuid(),
  action: z.object({ type: z.string() }).passthrough(),
});

export async function POST(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  let body;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const result = await handleAction(code.toUpperCase(), body.sessionId, body.action);
  if ("error" in result) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}
