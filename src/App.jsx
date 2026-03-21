import React, { lazy, Suspense, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { AnimatePresence } from 'framer-motion'

// Critical path - eagerly loaded
import HomePage from './pages/HomePage'
import StartupPage from './pages/StartupPage'

// Non-critical - lazy loaded (not in the initial bundle)
const Login = lazy(() => import('./pages/LoginPage'))
const Signup = lazy(() => import('./pages/SignupPage'))
const WikiPage = lazy(() => import('./pages/WikiPage'))
const BuildOn = lazy(() => import('./pages/BuildOn'))
const AvailableOnPage = lazy(() => import('./pages/AvailableOnPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const ExplorePage = lazy(() => import('./pages/ExplorePage'))
const RoomsPage = lazy(() => import('./pages/RoomsPage'))
const RoomDetailPage = lazy(() => import('./pages/RoomDetailPage'))
const BotAdminLogin = lazy(() => import('./pages/BotAdminLogin'))
const BotAdminDashboard = lazy(() => import('./pages/BotAdminDashboard'))

const PageFallback = () => (
  <div className="flex items-center justify-center py-32">
    <div className="w-10 h-10 border-4 border-dbd-red rounded-full border-t-transparent animate-spin"></div>
  </div>
)

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/wiki" element={<WikiPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/user/:userId" element={<UserProfilePage />} />
        <Route path="/builds" element={<BuildOn />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/room/:roomId" element={<RoomDetailPage />} />
        <Route path="/available-on" element={<AvailableOnPage />} />
        
        {/* Classified AI Bot Admin Panel */}
        <Route path="/botadmin04" element={<BotAdminLogin />} />
        <Route path="/botadmin04/dashboard" element={<BotAdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isStarting, setIsStarting] = useState(true)

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
          <Suspense fallback={<PageFallback />}>
            <AnimatedRoutes />
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App