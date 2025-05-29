import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";






export async function POST(request: NextRequest){
    const body: any = await request.json();
    const {userId, bookId} = body;
    if(!userId || !bookId) return NextResponse.json({error: 'missing required fields'}, {status: 400});


    try{
    const now = new Date()
    const activeBorrow: any = await prisma.$queryRaw`
        SELECT * FROM borrow_books 
        WHERE bookId = ${bookId} AND (status = 'borrowed' OR status = 'extended') AND returnDate IS NULL
        ORDER BY requestDate DESC
        LIMIT 1;
    `;

    //you reserve the book when it is already borrowed or extended
    if (activeBorrow.length > 0) {
        await prisma.borrowBook.create({
            data: {
                userId,               
                bookId,     
                requestDate: now,
                status: "requested",
            }
        })
        return NextResponse.json({ success: "book requested successfully" }, { status: 201 });
    }

    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 14);

    //you borrow the book
    await prisma.borrowBook.create({
        data:{
            userId,
            bookId,              
            requestDate: now,
            borrowDate: now,
            dueDate,
            status: "borrowed"
        }
    })

    return NextResponse.json({ success: "book borrowed successfully" }, { status: 201 });
    }catch(error: any){
        console.log(error.message)
        return NextResponse.json({ error: "internal server error" }, { status: 500 });
    }
}



export async function GET(request: NextRequest){
    try{
        const records: any = await prisma.$queryRaw`select * from borrow_books`;
        if(records.length === 0) return NextResponse.json({error: 'no record found'}, {status: 404});
        return NextResponse.json(records, {status:200});
    } catch(error){
        return NextResponse.json({error: 'internal server error'}, {status: 404})
    }
}