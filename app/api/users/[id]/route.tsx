import { NextRequest, NextResponse } from "next/server";

interface myp{
    params : {id: number}
}

export function GET(request: NextRequest, {params: {id}} : myp){
    if(id>10){
        return NextResponse.json({error: 'user not found'}, {status: 404});
    }else{
        return NextResponse.json({id:1, name:"hamza"}, {status:200});
    }
}


export async function PUT(request: NextRequest, {params: {id}}: myp){
    const body = await request.json();
    if(!body.name){
        return NextResponse.json({error: "invalid name"}, {status: 400});
    }
    if(id>10){
        return NextResponse.json({error: "not found"}, {status: 404});
    }
    else{
        return NextResponse.json({id: 1, name: "hamza"});
    }
}


export async function DELETE(request: NextRequest, {params: {id}}: myp){
    const body = await request.json();
    if(!body.name) return NextResponse.json({error: "invalid name"}, {status: 400});
    if(id > 10) return NextResponse.json({error: 'id not found'}, {status: 404});
    else return NextResponse.json({id: 1, name: "hamza"});
}