import React, { useEffect } from 'react'
import { TbSocial } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import TextInput from './Textinput'
import { useForm } from 'react-hook-form'
import CustomButton from './CustomButton'
import { BsMoon, BsSunFill } from 'react-icons/bs'
import { setTheme } from '../redux/theme'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { Logout } from '../redux/userSlice'
import { fetchPosts } from '../utils'
import {logo} from "../assets"
import slogo from "../assets/sharify_logo.png"

const TopBar = () => {
    const {theme} =useSelector((state)=> state.theme)
    const {user} =useSelector((state)=> state.user)
    const dispatch = useDispatch();
    const { register, getValues,handleSubmit, formState: { errors }, } = useForm();

    const handleTheme=()=>{
        const themeValue = theme === "light" ? "dark" : "light"; 
        console.log(theme) 
            dispatch(setTheme("themeValue"));
    }
   
  const handleSearch= async(data)=>{
       await fetchPosts(user.token , dispatch , "", data)

  }

  return (
    <div className='topbar w-full flex items-center justify-between max-h-20 rounded-lg py-3 md:py-6 px-4 bg-primary'>
        <Link to='/' className='flex gap-2 items-center'>
        <div className='p-1 md:p-2  rounded text-white'>
        <img src={slogo} alt="" height={50} width={50} className='rounded-md' />
          {/* <TbSocial /> */}
        </div>
        <span className='text-xl md:text-2xl text-[#065ad8] font-semibold'>
          Sharify
        </span>
      </Link>

      <form onSubmit={handleSubmit(handleSearch)} className='hidden md:flex items-center justify-end'>
        <TextInput
        placeholder="Search here...."
        styles = 'w-[18rem] lg:w-[38rem] rounded-l-full py-3'
        register = {register("search")}
        />
        <CustomButton
        title="search"
        type='submit'
        containerStyles='bg-[#0444a4] border border-[#0444a4] text-white px-6 py-2.5 mt-2 rounded-r-full'
        ></CustomButton>
        
      </form>

{/* FOR THEME */}
      <div className='flex gap-4 items-center justify-center text-ascent-1 text-md md:text-xl'>
             <button onClick={()=>{
                    if(theme==="light") dispatch(setTheme("dark"));
                    else dispatch(setTheme("light"))
                     }}
            >{ theme==="light" ? <BsMoon/> : <BsSunFill/>}</button>
             <div className='hidden lg:flex'>
                <IoMdNotificationsOutline/>
             </div>
              
              <div>
                 <CustomButton
                 onClick={()=>dispatch(Logout())}
                 title='Log Out'
                 containerStyles='text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full'
                 ></CustomButton>
              </div>
      </div>
    </div>
  )
}

export default TopBar
