import { getServerSession } from "next-auth";
import Link from "next/link";
import { resolve } from "path";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {

  const session = await getServerSession(authOptions)

  return (
    <div>
      <h1 className="text-pink-700 font-bold">Hello {session ? <span>{session.user!.name}</span>:<span>world</span>}</h1>
      <Link href="/users?orderby=name"><button>go to Users</button></Link>
    </div>
  );
}
