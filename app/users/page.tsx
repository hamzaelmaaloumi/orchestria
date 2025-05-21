import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface user{
  id: number;
  name: string;
  email: string;
}

const users = async () => { 


  try{
    const res = await axios.get('https://jsonplaceholder.typicode.com/users');
    const users: user[] = res.data;


    return (
      <div>
        <h1 className='text-xl font-manrope text-pink-600'>list of users</h1>
        <table>
          <tbody>
            {users.map(user => <tr><td>{user.name}</td><td>{user.email}</td></tr>)}
          </tbody>
        </table>
        <div className="text-blue-500 text-sm font-normal">
          <Link href="/"><button>back home</button></Link>
        </div>
      </div>
    )




  }catch{
    return (
      <div>
        <h1 className='text-xl text-pink-600'>0 users found here</h1>
      </div>
    )
  }
  

  
}

export default users