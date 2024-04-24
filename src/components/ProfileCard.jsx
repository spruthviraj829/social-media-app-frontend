import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
// import NoProfile from '../assets/userprofile.png'
import moment from 'moment'
import {profile} from '../assets'
import { LiaEditSolid } from 'react-icons/lia'
import { updatepdateProfile } from '../redux/userSlice'
import { BsBriefcase, BsFacebook, BsInstagram, BsLinkedin, BsPersonFillAdd, BsTwitter } from 'react-icons/bs'
import { CiLocationOn } from 'react-icons/ci'
import EditProfile from './EditProfile'
// import { Navigate } from 'react-router-dom'

const ProfileCard = ({user}) => {
    const {user:data , edit} = useSelector((state)=>state.user)
    const dispatch =useDispatch()
    // console.log(user.user.email)
  //  const {navigate} = useNavigate()
    //  const navigate = useNavigate();
  return (
    <div>
       <div className='w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4'>
        <div className='w-full  flex items-center justify-between  border-b pb-5 border-[#66666645]'>
               <Link to={"/profile/"+user?._id} className='flex gap-2'>
                <img src={user?.profileUrl ? user?.profileUrl : profile} alt={user?.email}
                 className='w-14 h-14 rounded-full object-cover' />
                 <div className='flex flex-col justify-center'>
                    <p className='font-medium text-lg text-ascent-1'> {user?.firstName} {user?.lastName}</p>
                    <span className='text-ascent-2'>{user?.profession ?? "No Profession"}</span>
                 </div>
               </Link>
               
            <div>
                {user?._id === data?._id ?
                 <LiaEditSolid  
                size={22}  
                className='text-blue cursor-pointer' 
                onClick={()=> {dispatch(updatepdateProfile(true))
                    
                 }}     
                 />
                :
                <button 
                onClick={()=>{}}
                className='bg-[#0444a430] text-sm text-white p-1 rounded'
                >
                  <BsPersonFillAdd size={20} className='text-[#0f52b6]'/>
                </button>
                }
            </div>
        </div>
           
        <div className='w-full flex flex-col gap-2 py-4 border-b border-[#66666645]'>
             <div className='flex gap-2 items-center text-ascent-2'>
                     <CiLocationOn className='text-xl text-ascent-1'/>
                     <span>{user?.location ?? "Add Location"}</span>
             </div>
             <div className='flex gap-2 items-center text-ascent-2'>
                 <BsBriefcase className='text-lg text-ascent-1'/>
                 <span>{user?.profession ?? "Add Profession"}</span>
             </div>
        </div>

        <div className='w-full flex flex-col gap-2 py-4 border-b border-[#66666645]'>
            <span className='text-xl text-ascent-1 font-semibold'
            >{user?.friends?.length} Friends</span>

            <div className='flex items-center justify-between'>
                <span className='text-ascent-2'>Who Viewed your profile</span>
                <span className='text-ascent-1 text-lg'> {user?.views?.length}</span>
            </div>
             
             <span className='text-base text-blue' >
                { user?.verified? "Verified Account" : "Not Verified"}
             </span>

             <div className='flex items-center justify-between'>
               <span className='text-ascent-2 '>Joined </span>
               <span className='text-ascent-1 text-base'> {moment(user?.createdAt).fromNow()}</span>
             </div>
        </div>
         
         <div className='w-full flex flex-col gap-4 py-4 pb-6'>
                <p className='text-ascent-1 text-lg font-semibold'>Social Profile</p>

                <div className='flex items-center gap-2 text-ascent-2'>
                  <BsInstagram className='text-xl text-ascent-1'/>
                  <span>Instagram</span>
                </div>
                <div className='flex items-center gap-2 text-ascent-2'>
                  <BsTwitter className='text-xl text-ascent-1'/>
                  <span>Twitter</span>
                </div>
                <div className='flex items-center gap-2 text-ascent-2'>
                  <BsFacebook className='text-xl text-ascent-1'/>
                  <span>Facebook</span>
                </div>
         </div>       
       </div>
       {/* {
         edit &&  <EditProfile />
       } */}
    </div>
  )
}

export default ProfileCard
