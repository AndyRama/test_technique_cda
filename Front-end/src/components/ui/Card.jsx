import React from 'react'
import { cn } from '../../utils/helpers'

const Card = ({ 
  children, 
  className, 
  hover = false,
  padding = true,
  ...props 
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-200',
        hover && 'hover:shadow-md transition-shadow duration-200',
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card