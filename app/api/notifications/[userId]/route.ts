import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface myp{
    params : {userId: string }
}


export async function GET(request: NextRequest, {params: {userId}} : myp){
    try{
        const notifications: any = await prisma.$queryRaw`select * from notifications
        where userId=${userId}`;
        if (notifications.length === 0) return NextResponse.json({success: 'no notification to view'}, {status: 200})
        return NextResponse.json(notifications, {status: 200});
    }catch{
        return NextResponse.json({error: 'internal database error'}, {status: 500})
    }
}

export async function PUT(request: NextRequest, {params: {userId}} : myp){
    try{
        const notifications: any = await prisma.$executeRaw`update notifications set isRead=1
        where userId=${userId}`;
        return NextResponse.json({success: 'notifications now are read'}, {status: 200})
    }catch{
        return NextResponse.json({error: 'internal server error'}, {status: 500})
    }
}
