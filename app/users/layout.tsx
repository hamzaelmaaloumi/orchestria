import React, { ReactNode } from 'react'

interface myp{
    children: ReactNode;
}

const layout = ({children}: myp) => {
  return (
    <div>
        <main>{children}</main>
    </div>
  )
}

export default layout