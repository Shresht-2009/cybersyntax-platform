import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mentor = await prisma.mentorProfile.findUnique({
    where: { userId: user.id },
    include: { transactions: { orderBy: { createdAt: "desc" } } },
  });

  if (!mentor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    balance: mentor.totalFunds,
    transactions: mentor.transactions,
  });
}

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mentor = await prisma.mentorProfile.findUnique({ where: { userId: user.id } });
  if (!mentor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { amount, description, type } = await request.json();

  await prisma.transaction.create({
    data: { mentorId: mentor.id, amount, description, type },
  });

  const updatedMentor = await prisma.mentorProfile.update({
    where: { id: mentor.id },
    data: {
      totalFunds: type === "CREDIT"
        ? { increment: amount }
        : { decrement: amount },
    },
    include: { transactions: { orderBy: { createdAt: "desc" } } },
  });

  return NextResponse.json({
    balance: updatedMentor.totalFunds,
    transactions: updatedMentor.transactions,
  });
}
