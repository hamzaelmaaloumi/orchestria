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
        WHERE bookId = ${bookId} AND userId = ${userId}
        order by requestDate desc limit 1
    `;

    console.log(activeBorrow[0].status)

    if (activeBorrow.length > 0) {
        if(activeBorrow[0].status === "requested") return NextResponse.json({ success: "book already requested" }, { status: 201 });
        if(activeBorrow[0].status === "borrowed" || activeBorrow[0].status === "extended") return NextResponse.json({ success: "book already borrowed" }, { status: 201 });
    }

    return NextResponse.json({ success: "book is fresh" }, { status: 201 });

    }catch(error: any){
        console.log(error)
        return NextResponse.json({ error: "internal server error" }, { status: 500 });
    }
}