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
      include: {
        userOne: { select: { id: true, name: true, email: true, image: true, role: true } },
        userTwo: { select: { id: true, name: true, email: true, image: true, role: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ userOneId: user.id }, { userTwoId: user.id }],
      },
      include: {
        userOne: { select: { id: true, name: true, email: true, image: true, role: true } },
        userTwo: { select: { id: true, name: true, email: true, image: true, role: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return NextResponse.json(conversations);
}

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user as any;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { participantId } = await request.json();
  if (!participantId) return NextResponse.json({ error: "participantId required" }, { status: 400 });

  const [userOneId, userTwoId] = [user.id, participantId].sort();

  const existing = await prisma.conversation.findUnique({
    where: { userOneId_userTwoId: { userOneId, userTwoId } },
    include: {
      userOne: { select: { id: true, name: true, email: true, image: true, role: true } },
      userTwo: { select: { id: true, name: true, email: true, image: true, role: true } },
    },
  });

  if (existing) return NextResponse.json(existing);

  const conversation = await prisma.conversation.create({
    data: { userOneId, userTwoId },
    include: {
      userOne: { select: { id: true, name: true, email: true, image: true, role: true } },
      userTwo: { select: { id: true, name: true, email: true, image: true, role: true } },
    },
  });

  return NextResponse.json(conversation);
}
