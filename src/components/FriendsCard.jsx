import React from 'react'
import { Link } from 'react-router-dom'
import {profile} from '../assets'
const FriendsCard = ({friends}) => {
  return (
    <div>
      <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5 mb-10'>
         <div className='flex items-center justify-between text-ascent-1 pb-2 border-b border-[#66666645]'>          
             <span>Friends</span>
             <span>{friends?.length}</span>
         </div>

         <div className='w-full flex flex-col gap-4 pt-4'>
               {
                friends?.map((friend)=>(
                    <Link to={"/profile/" +friend?._id}
                     key={friend?._id}
                     className='wfull flex gap-4 items-center cursor-pointer'
                    >
                       <img src={friend?.profileUrl ? friend.profileUrl : profile} 
                        alt={friend.firstName}
                        className='h-10 w-10 rounded-full object-cover'
                       />
                       
                       <div className='flex flex-col '>
                           <p className='font-medium text-ascent-1'>  {friend.firstName}  {friend.lastName}</p>
                           <span className='text-sm text-ascent-2'> {friend?.profession ? friend.profession :"No profession"}</span>
                       </div>
                    </Link>
                ))
               }
         </div>
      </div>
    </div>
  )
}

export default FriendsCard
