import React, { createContext, ReactNode } from 'react'
import { useState } from 'react'


interface User{
    isAdmin: boolean
}
interface UserContextValue {
    user: User
    setUser: React.Dispatch<React.SetStateAction<User>>;
}


export const userContext = createContext<undefined | UserContextValue>(undefined)


const UserProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User>({
        isAdmin: false
    })

  return (
    <userContext.Provider value={{user, setUser}}>
        {children}
    </userContext.Provider>
  )
}

export default UserProvider