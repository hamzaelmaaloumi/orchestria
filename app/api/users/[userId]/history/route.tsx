import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface myp{
    params : {userId: string }
}


export async function GET(request: NextRequest, {params: {userId}} : myp){
    try{
        const history: any = await prisma.$executeRaw`select * from borrow_books
        where userId=${userId} and status = 'borrowed'`;
        if (history.length === 0) return NextResponse.json({error: 'no history to view'}, {status: 404})
        return NextResponse.json(history, {status: 200});
    }catch{
        return NextResponse.json({error: 'internal database error'}, {status: 404})
    }
}
