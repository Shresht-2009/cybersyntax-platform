import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const user = session?.user as any;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const groups = await prisma.groupChat.findMany({
    where: { members: { some: { userId: user.id } } },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true, image: true, role: true } } },
      },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      createdBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(groups);
}

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, memberIds } = await request.json();
  if (!name || !memberIds?.length) return NextResponse.json({ error: "name and memberIds required" }, { status: 400 });

  const members = await prisma.user.findMany({
    where: { id: { in: memberIds } },
    select: { id: true, role: true },
  });

  const group = await prisma.groupChat.create({
    data: {
      name,
      createdById: user.id,
      members: {
        create: [
          { userId: user.id, role: "MENTOR" },
          ...members.map((m) => ({ userId: m.id, role: m.role })),
        ],
      },
    },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true, image: true, role: true } } },
      },
      createdBy: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(group);
}
