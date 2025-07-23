import React from 'react'
import { FaSpinner } from 'react-icons/fa'

const Loading = () => {
  return (
    <div className='w-full flex justify-center items-center py-2'>
        <FaSpinner className='animate-spin text-violet-600' size={28} />        
    </div>
  )
}

export default Loading