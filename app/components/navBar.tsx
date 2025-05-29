'use client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const NavBar = () => {
  const {status, data: session} = useSession();
  const [notif, setNotif] = useState(false)



  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/api/notifications/unread/${session?.user.id}`);
        if (res.data.success === 'no unread notifications') {
          setNotif(false);
          console.log("no new messages");
        } else if (res.data.success === 'there are unread notifications') {
          setNotif(true);
          console.log("there are new messages");
        }
      } catch (error: any) {
        console.log("here is the error: ", error.message);
      }
    };
    fetchNotifications(); // run once right away
  
    const interval = setInterval(() => {
      fetchNotifications(); // run every 15 seconds (you can adjust)
    }, 15000);
    return () => clearInterval(interval); // clean up on unmount
  }, [session?.user.id]);




  

  if(status === 'loading') return;

  return (
    <div className="relative top-0 w-full z-50 backdrop-blur-xl bg-slate-950/90 border-b border-indigo-500/20 shadow-lg shadow-indigo-500/5">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-black pointer-events-none"></div>
      
      <div className="relative px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo Section */}
        <Link 
          href={"/"}
          className='flex items-center space-x-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 hover:from-indigo-300 hover:via-blue-300 hover:to-cyan-300 transition-all duration-500 transform hover:scale-105'
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span className="tracking-wide">Orchestria</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-1">
          <Link 
            href="/" 
            className="group relative px-4 py-2 text-slate-300 hover:text-indigo-300 text-sm font-medium transition-all duration-300"
            aria-current="page"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-600/10 to-indigo-600/0 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-blue-400 group-hover:w-8 transition-all duration-300"></div>
            <span className="relative z-10">Home</span>
          </Link>
          
          <Link 
            href="/books" 
            className="group relative px-4 py-2 text-slate-300 hover:text-indigo-300 text-sm font-medium transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-600/10 to-indigo-600/0 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-blue-400 group-hover:w-8 transition-all duration-300"></div>
            <span className="relative z-10">Books</span>
          </Link>

          <Link 
            href="/borrowed" 
            className="group relative px-4 py-2 text-slate-300 hover:text-indigo-300 text-sm font-medium transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-600/10 to-indigo-600/0 rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-blue-400 group-hover:w-8 transition-all duration-300"></div>
            <span className="relative z-10">My Borrowing</span>
          </Link>
        </div>

        

        {/* Authentication Section */}
        <div className="flex items-center space-x-3">
          {/* Notification Bell */}
          {status === 'authenticated' && (
            <Link href={'/notifications'}  className="flex items-center">
              <button className="group relative p-2 text-slate-300 hover:text-indigo-300 transition-all duration-300 transform hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-600/10 to-indigo-600/0 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Notification badge */}
                {notif && <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-red-400 rounded-full border-2 border-slate-950 animate-pulse"></div>}
              </button>
            </Link>
          )}
          {status === 'unauthenticated' ? (
            <Link 
              href="/api/auth/signin"   
              className="group relative overflow-hidden px-6 py-2.5 text-sm font-medium text-slate-200 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-indigo-600 hover:to-blue-600 rounded-xl border border-slate-600/50 hover:border-indigo-400/50 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <span className="relative z-10 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Login</span>
              </span>
            </Link>
          ) : (
            <>
              <div className="px-4 py-2 text-sm text-slate-300 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <span className="text-indigo-400">Welcome, </span>
                <span className="font-medium">{session?.user!.name}</span>
              </div>
              <Link 
                href="/api/auth/signout"  
                className="group relative overflow-hidden px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-gradient-to-r from-slate-700 to-slate-600 hover:from-red-600 hover:to-red-500 rounded-lg border border-slate-600/50 hover:border-red-400/50 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-500/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <span className="relative z-10">Logout</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavBar