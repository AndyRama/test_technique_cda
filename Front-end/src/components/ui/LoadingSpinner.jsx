import React from 'react'
import { cn } from '../../utils/helpers'

const LoadingSpinner = ({ size = 'md', className, ...props }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-orange-600',
        sizes[size],
        className
      )}
      {...props}
    />
  )
}

export default LoadingSpinner