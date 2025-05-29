import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";



interface myp{
    params: {id: string}
}

//get a specific book
export async function GET(request: NextRequest, {params:{id}}: myp){
    try{
        const book: any = await prisma.$queryRaw`select * from books where id = ${id}`
        if(book.length === 0) return NextResponse.json({error: 'book not found'}, {status: 404});
        return NextResponse.json(book, {status: 200});
    } catch {
        return NextResponse.json({error: 'internal server error'}, {status: 400});
    }
}

  


export async function DELETE(request: NextRequest, {params:{id}}: myp){
  try {
    if (!id) return NextResponse.json({ error: 'Missing required field' }, { status: 400 });
    const old = await prisma.book.findUnique({
      where:{
        isbn: id,
      }
    })

    if(!old){
      return NextResponse.json({error: 'book not found'}, {status: 404})
    }

    await prisma.book.delete({
      where: {
        id,
      }
    })

    return NextResponse.json({ success: 'deleted successfully' }, { status: 200 });
  } catch (err) {
    console.log('------------>',err);
    return NextResponse.json({ error: 'Internal database error' }, { status: 500 });
  }
}
