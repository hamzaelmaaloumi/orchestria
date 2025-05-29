import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const body: any = await request.json();
    const { userId, bookId } = body;

    if (!userId || !bookId) {
      return NextResponse.json({ error: 'missing required fields' }, { status: 400 });
    }

    const res: any = await prisma.$queryRaw`
      SELECT * FROM borrow_books 
      WHERE userId = ${userId} AND bookId = ${bookId} AND status = 'requested'
    `;

    if (res.length === 0) {
      return NextResponse.json({ error: 'no active request found to cancel' }, { status: 404 });
    }

    await prisma.borrowBook.delete({
      where: { id: res[0].id }
    });

    return NextResponse.json({ success: 'request canceled successfully' }, { status: 200 });

  } catch(error) {
    console.log(error)
    return NextResponse.json({ error: 'internal server error' }, { status: 500 });
  }
}




