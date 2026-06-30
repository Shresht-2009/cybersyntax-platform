import { auth } from "./auth";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return session.user;
}

export async function requireRole(role: "MENTOR" | "STUDENT") {
  const user = await getCurrentUser();
  if (!user || (user as any).role !== role) return null;
  return user;
}

export async function getMentorProfile(userId: string) {
  return prisma.mentorProfile.findUnique({
    where: { userId },
    include: { user: true },
  });
}

export async function getStudentProfile(userId: string) {
  return prisma.studentProfile.findUnique({
    where: { userId },
    include: { user: true },
  });
}
