import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { userId: targetUserId } = await request.json();

  const group = await prisma.groupChat.findUnique({ where: { id } });
  if (!group || group.createdById !== user.id) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, name: true, email: true, image: true, role: true },
  });
  if (!targetUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await prisma.groupChatMember.upsert({
    where: { groupId_userId: { groupId: id, userId: targetUserId } },
    update: {},
    create: { groupId: id, userId: targetUserId, role: targetUser.role },
  });

  return NextResponse.json(targetUser);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const url = new URL(request.url);
  const targetUserId = url.searchParams.get("userId");

  if (!targetUserId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const group = await prisma.groupChat.findUnique({ where: { id } });
  if (!group || group.createdById !== user.id) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  await prisma.groupChatMember.deleteMany({
    where: { groupId: id, userId: targetUserId },
  });

  return NextResponse.json({ success: true });
}
