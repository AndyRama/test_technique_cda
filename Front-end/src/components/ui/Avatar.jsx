import React from 'react'
import { User } from 'lucide-react'
import { cn } from '../../utils/helpers'
import { getInitials } from '../../utils/helpers'

const Avatar = ({ 
  src, 
  alt, 
  name,
  size = 'md',
  className,
  ...props 
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={cn(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }

  const initials = name ? getInitials(name) : null

  return (
    <div
      className={cn(
        'rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium',
        sizes[size],
        className
      )}
      {...props}
    >
      {initials || <User className="w-1/2 h-1/2" />}
    </div>
  )
}

export default Avatar