import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest){
    try{
        const body: any = await request.json();
        const {userId, bookId, extendDays} = body;  
        if(!userId || !bookId || !extendDays) return NextResponse.json({error: 'missing required fields'}, {status: 400});
        if (typeof extendDays !== 'number' || extendDays <= 0) return NextResponse.json({ error: 'extendDays must be a positive number' }, { status: 400 });

        const DueDate: any = await prisma.$queryRaw`select dueDate from borrow_books where userId=${userId} and bookId=${bookId}`;
        if (!DueDate || DueDate.length === 0) {
            return NextResponse.json({ error: 'Borrowed book record not found' }, { status: 404 });
        }
        const timeExtend: any = await prisma.$queryRaw`select * from borrow_books where userId=${userId} and bookId=${bookId}`
        if(timeExtend[0].borrowingTimeExtended !== null) return NextResponse.json({ error: 'book loan period had been already renewed' }, { status: 400 });

        const currentDueDate = new Date(DueDate[0].dueDate);
        const newDueDate = new Date(currentDueDate.setDate(currentDueDate.getDate() + extendDays));


        const result: any = await prisma.$executeRaw`update borrow_books
        set status='extended', borrowingTimeExtended=true, dueDate=${newDueDate} 
        where userId=${userId} and bookId=${bookId}`;

        if (result===0) return NextResponse.json({ error: "unknow error" }, { status: 500 });
        return NextResponse.json({ success: "book extended successfully" }, { status: 200 });

    }catch{
        return NextResponse.json({ error: "internal server error" }, { status: 500 });
    }
}