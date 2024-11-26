import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface UserType {
  name: string;
  email: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

function corsResponse(response: NextResponse) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export async function OPTIONS() {
  return corsResponse(
    new NextResponse(null, {
      status: 204,
    })
  );
}

export async function GET() {
  try {
    const users = await prisma.client.findMany();
    return corsResponse(NextResponse.json(users));
  } catch (error) {
    return corsResponse(
      NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: UserType = await req.json();

    const user = await prisma.client.create({
      data: {
        name: body.name,
        email: body.email,
      },
    });

    if (user) {
      return corsResponse(NextResponse.json(user, { status: 201 }));
    }

    return corsResponse(
      NextResponse.json({ error: "User not created" }, { status: 400 })
    );
  } catch (error) {
    return corsResponse(
      NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    );
  }
}
