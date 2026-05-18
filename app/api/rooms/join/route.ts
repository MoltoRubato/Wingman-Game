import { NextResponse } from "next/server";
import { z } from "zod";
import { joinRoom } from "@/lib/server/game";

const Body = z.object({
  sessionId: z.string().uuid(),
  code: z.string().regex(/^[A-HJ-NP-Y2-9]{4}$/i),
});

export async function POST(req: Request) {
  let body;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const result = await joinRoom(body.code.toUpperCase(), body.sessionId);
  if ("error" in result) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}
