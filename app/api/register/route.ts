import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'


export async function POST(request: NextRequest){
    try{
        const body = await request.json();
        if(!body.email || !body.password) return NextResponse.json({error: 'invalid credentials'}, {status: 400});
        const result:any = await prisma.$queryRaw`select * from users where email=${body.email}`;
        if(result.length !== 0) return NextResponse.json({error: 'email already in use'}, {status: 400});
        const hashedPassword = await bcrypt.hash(body.password, 10)
        const newUser = await prisma.user.create({
            data:{
                email: body.email,
                hashedPassword
            }
        })
        return NextResponse.json({success: 'user registered'}, {status: 200})
    }catch(error:any){
        console.log(error?.message)
        return NextResponse.json({error: 'database error'}, {status: 400});
    }
}