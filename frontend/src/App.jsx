import React, { useEffect } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/LoginPage'
import Signup from './pages/SignUpPage'
import SettingPage from './pages/SettingPage'
import ProfilePage from './pages/ProfilePage'
import Navbar from './components/Navbar'
import {useAuthStore} from './store/useAuthStore'
import {Loader} from 'lucide-react'
import { Toaster } from 'react-hot-toast'
const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth])
  
  console.log({authUser});

  if(isCheckingAuth && !authUser){
    <div className='flex items-center justify-center h-sreen'>
      <Loader className='size-10 animate-spin text-blue-500' />
    </div>
  }
  return (
    <div className='bg-blue-800 min-h-screen'>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login"/> } />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to="/" /> } />
        <Route path='/setting' element={ <SettingPage /> } />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster position='top-center' />
    </div>
  )
}

export default App
