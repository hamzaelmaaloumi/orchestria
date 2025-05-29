import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest){
    try{
        const books: any = await prisma.$queryRaw`select * from books`;
        if(books.length === 0) return NextResponse.json({error: 'no book found'}, {status: 404});
        return NextResponse.json(books, {status:200});
    } catch(error){
        return NextResponse.json({error: 'database error'}, {status: 404})
    }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { isbn, title, author, publicationPlace, publicationDate } = body;
    if (!isbn || !title || !author) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    const old = await prisma.book.findUnique({
      where:{
        isbn: isbn,
      }
    })

    if(old){
      return NextResponse.json({error: 'isbn already taken'}, {status: 400})
    }


    await prisma.book.create({
      data: {
        isbn,
        title,
        author,
        publicationPlace: publicationPlace || null,
        publicationDate: publicationDate ? new Date(publicationDate) : null,
      },
    });

    return NextResponse.json({ success: 'Inserted successfully' }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal database error' }, { status: 500 });
  }
}


export async function PUT(request: NextRequest){
  try {
    const body = await request.json();
    const { isbn, title, author, publicationPlace, publicationDate } = body;
    if (!isbn) return NextResponse.json({ error: 'Missing required field' }, { status: 400 });
    const old = await prisma.book.findUnique({
      where:{
        isbn: isbn,
      }
    })

    if(!old){
      return NextResponse.json({error: 'book not found'}, {status: 404})
    }

    await prisma.book.update({
      where: {
        isbn: isbn
      },
      data: {
        title: title || old.isbn,
        author: author || old.author,
        publicationPlace: publicationPlace || old.publicationPlace,
        publicationDate: publicationDate || old.publicationDate,
      },
    });

    return NextResponse.json({ success: 'updated successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal database error' }, { status: 500 });
  }
}



