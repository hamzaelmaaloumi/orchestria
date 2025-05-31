'use client'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'




const ClientRedirect = () => {
  const {status, data: session} = useSession()
  const router = useRouter()
  useEffect(() => {
      if (session && session?.user?.role === "user") {
        router.push("/books");
      }
    }, [session, router]);
  return (
    <div>ClientRedirect</div>
  )
}

export default ClientRedirect