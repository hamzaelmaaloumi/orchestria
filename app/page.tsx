import Link from "next/link";
import { resolve } from "path";

export default async function Home() {

  await new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });

  return (
    <div>
      <h1 className="text-pink-700 font-bold">Hello world how is it going on today</h1>
      <Link href="/users?orderby=name"><button>go to Users</button></Link>
    </div>
  );
}
