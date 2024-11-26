import { CategorySchema } from "@/app/(routes)/admin/_components/categories/CategoryForm";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

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

export async function GET(req: Request) {
  try {
    const categories = await prisma.category.findMany();

    return corsResponse(
      NextResponse.json({ categories: categories }, { status: 200 })
    );
  } catch (error) {
    return corsResponse(
      NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      )
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: z.infer<typeof CategorySchema> = await req.json();

    const category = await prisma.category.create({
      data: {
        name: body.name,
        link: body.link,
        url: body.url,
        key: body.key,
      },
    });

    if (category) {
      return corsResponse(
        NextResponse.json({ category: category }, { status: 200 })
      );
    }

    return corsResponse(
      NextResponse.json({ error: "Category not created" }, { status: 400 })
    );
  } catch (error) {
    console.log(error);
    return corsResponse(
      NextResponse.json({ error: "Failed to create category" }, { status: 500 })
    );
  }
}
