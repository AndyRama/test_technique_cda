import React from 'react'
import { cn } from '../../utils/helpers'
import LoadingSpinner from './LoadingSpinner'

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  ...props
}, ref) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    outline: 'btn border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={cn(
        variants[variant],
        sizes[size],
        isDisabled && 'opacity-50 cursor-not-allowed',
        loading && 'relative',
        className
      )}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <span className={loading ? 'invisible' : ''}>
        {children}
      </span>
    </button>
  )
})

Button.displayName = 'Button'

export default Button