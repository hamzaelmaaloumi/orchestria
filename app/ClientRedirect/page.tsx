'use client'
import { Session } from 'next-auth'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'


interface myp{
  session: Session | null;
}

const ClientRedirect = ({session}: myp) => {
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