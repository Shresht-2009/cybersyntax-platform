import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = session?.user as any;
  if (!user || user.role !== "MENTOR") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { grade, feedback } = await request.json();

  const submission = await prisma.submission.update({
    where: { id },
    data: {
      grade: grade !== undefined ? grade : null,
      feedback: feedback !== undefined ? feedback : null,
      status: grade !== undefined ? "GRADED" : "SUBMITTED",
    },
  });

  return NextResponse.json(submission);
}
