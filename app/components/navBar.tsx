'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const NavBar = () => {
  const {status, data: session} = useSession();

  if(status === 'loading') return;


  return (
    <div className="relative top-0 w-full z-50 backdrop-blur-lg bg-zinc-900/75 border-b border-slate-800/50 px-4 sm:px-6 lg:px-8 flex items-center justify-end h-16 space-x-8">
      <Link 
        href={"/"}
        className='absolute left-12 text-xl font-bold flex-start hover:text-sky-300 transition-all duration-300'
      >
        Orchestria
      </Link>
      <Link 
        href="/" 
        className="relative text-slate-300 hover:text-sky-300 px-3 py-2 text-sm font-medium transition-colors duration-300 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-sky-400 after:left-1/2 after:transform after:-translate-x-1/2 after:-bottom-0.5 after:transition-all after:duration-300 hover:after:w-full"
        aria-current="page"
      >
        Home
      </Link>
      <Link 
        href="/users" 
        className="relative text-slate-300 hover:text-sky-300 px-3 py-2 text-sm font-medium transition-colors duration-300 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-sky-400 after:left-1/2 after:transform after:-translate-x-1/2 after:-bottom-0.5 after:transition-all after:duration-300 hover:after:w-full"
      >
        Users
      </Link>
      {status === 'unauthenticated' ?
            <Link 
            href="/api/auth/signin"   
            className="relative inline-flex items-center text-slate-200 hover:text-white px-4 py-2 text-sm font-medium rounded-md border border-slate-700 hover:border-sky-500 bg-slate-800/60 hover:bg-sky-600/20 transition-all duration-300 hover:shadow-[0_0_18px_rgba(14,165,233,0.35)] transform hover:-translate-y-px"
            >
              Login
            </Link> 
      :
            <Link 
              href="" 
              className="relative inline-flex items-center text-slate-200 hover:text-white px-4 py-2 text-sm font-medium rounded-md border border-slate-700 hover:border-sky-500 bg-slate-800/60 hover:bg-sky-600/20 transition-all duration-300 hover:shadow-[0_0_18px_rgba(14,165,233,0.35)] transform hover:-translate-y-px"
            >
              {session?.user!.name}
            </Link> 
      }
      {status === 'authenticated' && <Link href="/api/auth/signout"  className="relative inline-flex items-center text-slate-200 hover:text-white px-4 py-2 text-sm font-medium rounded-md border border-slate-700 hover:border-sky-500 bg-slate-800/60 hover:bg-sky-600/20 transition-all duration-300 hover:shadow-[0_0_18px_rgba(14,165,233,0.35)] transform hover:-translate-y-px">logout</Link>}
    </div>
  )
}

export default NavBar