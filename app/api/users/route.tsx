import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";


export async function GET(request: NextRequest){
    const users = await prisma.$queryRaw`select * from user`;
    return NextResponse.json(users, {status: 202});
}

export async function POST(request: NextRequest){
    try{
        const body = await request.json();
        if(!body.name || !body.email) return NextResponse.json({error: 'Both name and email are required'}, {status: 400})
        const res: any = await prisma.$queryRaw`select * from user where email = ${body.email}`;
        console.log(res);
        if(res.length !== 0){
            return NextResponse.json({error: "user already exists"}, {status: 400});
        }

        await prisma.$queryRaw`insert into user (email, name) values (${body.email}, ${body.name})`;
        return NextResponse.json({success: "user inserted successfully"}, {status: 201});
    }catch{
        return NextResponse.json({error: 'an error happened'}, {status: 400});
    }
}