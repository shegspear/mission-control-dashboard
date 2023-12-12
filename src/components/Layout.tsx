import Link from 'next/link'
import React from 'react'

const Layout = ({children}:{children:any}) => {
  return (
    <div
        className='flex flex-row items-center'
    >
        <div
            className='w-2/12 flex flex-col'
        >
            <Link
                href={'/'}
                className='mb-2'
            >
                Static data
            </Link>

            <Link
                href={'/live'}
                className='mb-2'
            >
                Live data
            </Link>
        </div>

        <div
            className='w-10/12'
        >
            {children}
        </div>
    </div>
  )
}

export default Layout