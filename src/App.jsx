import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Outlet ,Navigate , Route , Routes , useLocation } from 'react-router-dom'
import { Login ,Register , Home , Profile , ResetPassword } from './pages'
import './App.css'
import { useSelector } from 'react-redux'
import { setTheme } from './redux/theme'
import EditProfile from './components/EditProfile'

function Layout(){
  const {user} = useSelector(state=> state.user) ;
  console.log(user)
  const location = useLocation();
  
  return user?.token?<Outlet/>:<Navigate to="/login" state={{from:location}} replace/>
}

function App() {
  const {theme} = useSelector((state)=>state.theme)

  return (
    <div data-theme ={ theme} className='w-full min-h-[100vh]'>
     
    <Routes>
         <Route element={< Layout/>}>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/profile/:id?' element={<Profile/>}></Route>
            <Route path='/edit-profile' element={<EditProfile/>}></Route>
         </Route>
         <Route path='/register' element={<Register/>}></Route>
         <Route path='/login' element={<Login/>}></Route>
         <Route path='/reset-password' element={<ResetPassword/>}></Route>
    </Routes>
     
    </div>
  )
}

export default App
