import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface myp{
    params : {id: string}
}

//fetch all borrowed books (thier properties with joining the title of the book) per one user
export async function GET(request: NextRequest, {params: {id}} : myp){
    try{
        const borrowed_books: any = await prisma.$queryRaw`
        SELECT borrow_books.*, books.title
        FROM borrow_books
        JOIN books ON borrow_books.bookId = books.id
        WHERE borrow_books.userId = ${id}
          AND (borrow_books.status = 'borrowed' OR borrow_books.status = 'extended')
      `;
        return NextResponse.json(borrowed_books, {status: 200});
    }catch(error){
        console.log(error)
        return NextResponse.json({error: 'internal database error'}, {status: 400})
    }
}

//fetch specific borrowed book per one user
export async function POST(request: NextRequest){
    try{
        const {userId, bookId} = await request.json();
        const borrowed_book: any = await prisma.$queryRaw`select * from borrow_books
        where userId=${userId} and bookId=${bookId}`;
        if (borrowed_book.length === 0) return NextResponse.json({error: 'no borrowed books to view'}, {status: 404})
        return NextResponse.json(borrowed_book, {status: 200});
    }catch(error){
        console.log(error)
        return NextResponse.json({error: 'internal database error'}, {status: 400})
    }
}

