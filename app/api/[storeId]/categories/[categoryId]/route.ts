import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
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

export async function POST(
  request: NextRequest,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const data = await request.json();

    const category = await prisma.category.update({
      where: {
        id: params.categoryId,
      },
      data: data,
    });

    if (!category) {
      return corsResponse(
        NextResponse.json({ message: "Category not found" }, { status: 404 })
      );
    }

    return corsResponse(NextResponse.json({ category: category }));
  } catch (error) {
    return corsResponse(
      NextResponse.json({ message: "Error updating category" }, { status: 500 })
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const category = await prisma.category.delete({
      where: {
        id: params.categoryId,
      },
    });

    if (!category) {
      return corsResponse(
        NextResponse.json({ message: "Category not deleted" }, { status: 404 })
      );
    }

    return corsResponse(NextResponse.json({ messgae: "Category deleted" }));
  } catch (error) {
    return corsResponse(
      NextResponse.json({ message: "Error deleting category" }, { status: 500 })
    );
  }
}
