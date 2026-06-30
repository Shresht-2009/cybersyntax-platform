import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "STUDENT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { program, resume, resumeType } = await request.json();

  const profile = await prisma.studentProfile.update({
    where: { userId: user.id },
    data: { program, resume, resumeType, status: "PENDING" },
  });

  return NextResponse.json(profile);
}
