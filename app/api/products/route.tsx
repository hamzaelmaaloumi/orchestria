import { NextRequest, NextResponse } from "next/server";

const products = [
    {
        id: 1,
        name: "Milk", 
        price: 2.4
    }, 
    {
        id: 2,
        name: "bread",
        price: 3.5
    }
]

export function GET(request: NextRequest){
    return NextResponse.json(products)
}


export async function POST(request: NextRequest){
    const body = await request.json();
    if (!body.name || !body.price){
        return NextResponse.json({error: 'invalid request'}, {status: 400});
    }
    products.unshift(body);
    return NextResponse.json(products)
}