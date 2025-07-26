import React from 'react'
import Button from './Button'

const ErrorMessage = ({ title, message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="text-red-600 mb-2">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="error" size="sm" className="mt-4">
          Réessayer
        </Button>
      )}
    </div>
  )
}

export default ErrorMessage