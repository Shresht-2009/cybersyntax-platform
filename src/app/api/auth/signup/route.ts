import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password, role, educatorKey } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    if (role === "MENTOR") {
      const validKey = process.env.EDUCATOR_KEY || "CYBERSYNTAX2025";
      if (educatorKey !== validKey) {
        return NextResponse.json({ error: "Invalid educator key" }, { status: 403 });
      }
    }

    const hashedPassword = await hash(password, 12);
    const verificationToken = uuidv4();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role,
        verificationToken,
        emailVerified: true,
      },
    });

    if (role === "MENTOR") {
      await prisma.mentorProfile.create({
        data: {
          userId: user.id,
          educatorKey: process.env.EDUCATOR_KEY || "CYBERSYNTAX2025",
        },
      });
    } else {
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          status: "PENDING",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      redirectTo: role === "MENTOR" ? "/mentor/dashboard" : "/student/apply",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
