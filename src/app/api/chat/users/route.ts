import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const user = session?.user as any;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let users;
  if (user.role === "MENTOR") {
    users = await prisma.user.findMany({
      where: { id: { not: user.id } },
      select: { id: true, name: true, email: true, image: true, role: true },
      orderBy: { name: "asc" },
    });
  } else {
    users = await prisma.user.findMany({
      where: { id: { not: user.id }, role: "MENTOR" },
      select: { id: true, name: true, email: true, image: true, role: true },
      orderBy: { name: "asc" },
    });
  }

  const existingConversations = await prisma.conversation.findMany({
    where: {
      OR: [{ userOneId: user.id }, { userTwoId: user.id }],
    },
    select: { userOneId: true, userTwoId: true },
  });

  const convUserIds = new Set<string>();
  existingConversations.forEach((c) => {
    convUserIds.add(c.userOneId === user.id ? c.userTwoId : c.userOneId);
  });

  const result = users.map((u) => ({
    ...u,
    hasExistingConversation: convUserIds.has(u.id),
  }));

  return NextResponse.json(result);
}
