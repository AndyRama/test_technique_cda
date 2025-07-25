import React, { useState } from 'react'
import { Search } from 'lucide-react'

const SearchInput = ({ placeholder, value, onChange, onSearch, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState(value || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch && onSearch(searchTerm)
  }

  const handleChange = (e) => {
    setSearchTerm(e.target.value)
    onChange && onChange(e)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      />
      <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
    </form>
  )
}

export default SearchInput