import React from'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<h1>Accueil</h1>} />
            <Route path="/movies" element={<h1>Films</h1>} />
            <Route path="/users" element={<h1>Utilisateurs</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App