import { TriangleAlertIcon } from 'lucide-react'
import React from 'react'

const Error = ({ message }) => {
  return (
    <div className='text-sm text-red-400 flex items-center mb-2'>
      <span><TriangleAlertIcon size={12} className='mr-2'/></span>
      <span>{message}</span>
    </div>
  )
}

export default Error