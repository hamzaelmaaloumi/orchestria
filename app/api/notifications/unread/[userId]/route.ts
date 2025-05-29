import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";





export async function GET(request: NextRequest, {params: {userId}}: {params: {userId: string}}){
    try{
        const result: any = await prisma.$queryRaw`select count(*) as count from notifications
        where userId=${userId} and isRead=0`;
        if(result[0].count === 0n) return NextResponse.json({success: 'no unread notifications'}, {status: 200});
        return NextResponse.json({success: 'there are unread notifications'}, {status: 200})
    }catch(error){
        console.log('------->', error)
        return NextResponse.json({error: 'internal database error'}, {status: 500})
    }
}