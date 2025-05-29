import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest){
    try{
        const history: any = await prisma.$queryRaw`select borrow_books.*,books.title,
        books.author, books.isbn, users.name, users.email from borrow_books, books, users
        where borrow_books.userId=users.id and borrow_books.bookId=books.id`;
        if (history.length === 0) return NextResponse.json({error: 'no history to view'}, {status: 404})
        return NextResponse.json(history, {status: 200});
    }catch{
        return NextResponse.json({error: 'internal database error'}, {status: 404})
    }
}
