import { NextRequest } from "next/server";
import middleware from "next-auth/middleware"

export default middleware;

export const config = {
    //* protect zero or more
    //+ protect one or more
    //? protect zero or one
    matcher: [
        '/users/:path*',
        '/admin/:path*',
        '/borrowed/:path*',
        '/notifications/:path*',
        '/books/:path+'
    ]

}
//Only let logged-in people go to these special pages

