import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(request: NextRequest){
    try{
        const body: any = await request.json();
        const {userId, bookId} = body;  
        if(!userId || !bookId) return NextResponse.json({error: 'missing required fields'}, {status: 400});

        const now = new Date();
        const updated = await prisma.$executeRaw`
        UPDATE borrow_books 
        SET status = 'returned', returnDate = ${now} 
        WHERE userId = ${userId} AND bookId = ${bookId} 
        AND status IN ('borrowed', 'extended') 
        AND returnDate IS NULL
        `;

        if (updated === 0) {
        return NextResponse.json({ error: "no active borrowed book found to return" }, { status: 404 });
        }


        const activeRequest: any = await prisma.$queryRaw`select * from borrow_books
        where bookId=${bookId} and status='requested' order by requestDate limit 1`;

        if(activeRequest.length === 0) return NextResponse.json({ success: "book returned successfully (no pending requests)" }, { status: 200 });
        
        const dueDate = new Date(now);
        dueDate.setDate(dueDate.getDate() + 14);

        const result = await prisma.borrowBook.update({
            where:{ 
                id: activeRequest[0].id
            },
            data:{
                borrowDate: now,
                dueDate,
                status: 'borrowed'
            }
        })

        const book: any = await prisma.$queryRaw`select title from books where id=${bookId}`;
        const res = await prisma.notification.create({
            data: {
                userId: activeRequest[0].userId,
                message: `the book ${book[0].title}, that you requested at ${activeRequest[0].requestDate} is now available`,    
                isRead: false,
                createdAt: now
            }
        })

        return NextResponse.json({ success: "book returned and assigned to next requester" }, { status: 200 });
    }catch(error){
        console.log("----------->", error)
        return NextResponse.json({ error: "internal server error" }, { status: 500 });
    }
}


