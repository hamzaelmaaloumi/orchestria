import React from 'react'

const Loading = () => {
    return (
        <div className='fixed inset-0 flex justify-center items-center'>
            <svg fill="currentColor" viewBox="0 0 1792 1792" className="text-green-500 w-10 h-10 animate-spin"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z" />
            </svg>
        </div>
    )
}

export default Loading