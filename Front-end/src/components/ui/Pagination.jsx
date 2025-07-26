import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/helpers'

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showInfo = true,
  totalItems,
  itemsPerPage
}) => {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex items-center justify-between">
      {showInfo && totalItems && (
        <div className="text-sm text-gray-700">
          Affichage de <span className="font-medium">{startItem}</span> à{' '}
          <span className="font-medium">{endItem}</span> sur{' '}
          <span className="font-medium">{totalItems}</span> résultats
        </div>
      )}

      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
          )}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Précédent
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    page === currentPage
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                  )}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
          )}
        >
          Suivant
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  )
}

export default Pagination