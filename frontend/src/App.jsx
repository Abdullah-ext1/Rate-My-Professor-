import './App.css'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Chat from './pages/Chat'
import Feed from './pages/Feed'
import Professors from './pages/Professors'
import Attendance from './pages/Attendance'
import PYQ from './pages/PYQ'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize from localStorage on first load
    return localStorage.getItem('isLoggedIn') === 'true'
  })

  useEffect(() => {
    // Save login state to localStorage whenever it changes
    localStorage.setItem('isLoggedIn', isLoggedIn)
  }, [isLoggedIn])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  return (
    <BrowserRouter>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/professors" element={<Professors />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/pyq" element={<PYQ />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App
