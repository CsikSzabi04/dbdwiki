import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import Login from './pages/LoginPage'
import Signup from './pages/SignupPage'
import StartupPage from './pages/StartupPage'
import WikiPage from './pages/WikiPage'
import BuildOn from './pages/BuildOn'
import AvailableOnPage from './pages/AvailableOnPage'
import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'

import ProfilePage from './pages/ProfilePage'
import NewsPage from './pages/NewsPage'

function App() {
  const [isStarting, setIsStarting] = useState(true)

  // Ha az oldal nem a gyökéren (/) tölt be (tehát frissítettek pl a /wiki-n),
  // akkor azonnal cseréljük le az URL-t a főoldalra még mielőtt a Router betöltene,
  // így garantálva a Startup screen és a kezdőlap betöltését az F5 után is.
  if (typeof window !== 'undefined' && window.location.pathname !== '/') {
    window.history.replaceState(null, '', '/');
  }

  if (isStarting) {
    return <StartupPage onComplete={() => setIsStarting(false)} />
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-obsidian text-white">
          <Toaster position="bottom-right" />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/wiki" element={<WikiPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/builds" element={<BuildOn />} />
            <Route path="/available-on" element={<AvailableOnPage />} />

            {/* Catch-all route to redirect any unknown/refresh path back to root */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App