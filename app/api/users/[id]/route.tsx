import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface myp{
    params : {id: string }
}


export async function GET(request: NextRequest, {params: {id}} : myp){
    const user: any = await prisma.$queryRaw`select * from user where id = ${id}`;
    if(!user[0]){
        return NextResponse.json({error: `user not found`}, {status: 404});
    }else{
        return NextResponse.json(user, {status: 202});
    }
}


export async function PUT(request: NextRequest, {params: {id}}: myp){
    try{
        const body = await request.json();
        if(!body.name ||!body.email){
            return NextResponse.json({error: "invalid properties"}, {status: 400});
        }
        const res: any = await prisma.$queryRaw`select * from user where id=${parseInt(id)}`;
        if(res.length !== 0){
            const result = await prisma.$executeRaw`update user set name=${body.name}, email=${body.email} where id=${parseInt(id)}`
            if(result===0) return NextResponse.json({error: 'unknow error happened'}, {status: 400})
            return NextResponse.json({success: 'user updated successfully'}, {status: 200})
        }
        else{
            return NextResponse.json({error: 'user doesnt exists'}, {status: 400})
        }
    }catch(error){
        return NextResponse.json({error: 'something bad happendedd'}, {status: 400})
    }
}


export async function DELETE(request: NextRequest, {params: {id}}: myp){
    try{
        const result: any = await prisma.$queryRaw`select * from user where id=${parseInt(id)}`;
        if(result.length===0) return NextResponse.json({error: 'user doenst exist'}, {status: 404});
        const res : any = await prisma.$executeRaw`delete from user where id=${parseInt(id)}`;
        if(res===0) return NextResponse.json({error: 'unknow error happened'}, {status: 400})
        return NextResponse.json({success: 'user deleted successfully'}, {status: 200})
    }catch(error: any){
        return NextResponse.json({error: error.message}, {status: 400})
    }
}