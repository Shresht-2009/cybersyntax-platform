import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  const user = session?.user as any;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const role = url.searchParams.get("role");

  let conversations;
  if (role === "MENTOR" && user.role === "MENTOR") {
    conversations = await prisma.conversation.findMany({
      where: { mentorId: user.id },
      include: {
        student: { select: { id: true, name: true, email: true, image: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    conversations = await prisma.conversation.findMany({
      where: { studentId: user.id },
      include: {
        mentor: { select: { id: true, name: true, email: true, image: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return NextResponse.json(conversations);
}
