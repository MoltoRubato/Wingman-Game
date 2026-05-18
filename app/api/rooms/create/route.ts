import { NextResponse } from "next/server";
import { z } from "zod";
import { createRoom } from "@/lib/server/game";

const Body = z.object({ sessionId: z.string().uuid() });

export async function POST(req: Request) {
  let body;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  try {
    const { code } = await createRoom(body.sessionId);
    return NextResponse.json({ code });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
