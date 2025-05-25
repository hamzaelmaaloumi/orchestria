import { NextRequest } from "next/server";
import middleware from "next-auth/middleware"

export default middleware;

export const config = {
    //* zero or more
    //+ one or more
    //? zero or one
    matcher: ['/users/:id*']
}
//Only let logged-in people go to these special pages

