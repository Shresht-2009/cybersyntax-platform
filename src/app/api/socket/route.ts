import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const socketId = searchParams.get("socketId");
  return new Response(`Socket server placeholder. Socket ID: ${socketId}`, { status: 200 });
}
