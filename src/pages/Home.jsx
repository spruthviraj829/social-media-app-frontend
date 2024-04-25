import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TopBar from '../components/TopBar'
import ProfileCard from '../components/ProfileCard'
import FriendsCard from '../components/FriendsCard'
// import { friends ,requests ,suggest } from '../assets/data'
import {profile} from '../assets' 
import { Link } from 'react-router-dom'
import CustomButton from '../components/CustomButton'
import { BsPersonFillAdd } from 'react-icons/bs'
import TextInput from '../components/Textinput'
import { useForm } from 'react-hook-form'
import { BiGift, BiImages, BiVideo } from 'react-icons/bi'
import Loading from '../components/Loading'
import PostCard from '../components/PostCard'
import EditProfile from '../components/EditProfile'
import { apiRequest, deletePost, fetchPosts, getUserInfo, handleFileUpload, likePost, sendFriendRequset } from '../utils'
import { UserLogin } from '../redux/userSlice'
import { FaHourglassEnd } from "react-icons/fa";  

const Home = () => {
  
  const [tick , setTick] =useState(null)

  const {user ,edit} = useSelector((state)=>state.user)
  const dispatch = useDispatch(); 
  const {posts}= useSelector((state)=>state.post)
      
  const [friendRequest , setFriendRequest] = useState([])
  const [suggestedFriend , setSuggestedFriend] = useState([])
  const {register , handleSubmit ,reset , formState :{errors}} = useForm();
  const [errMsg ,setErrMsg] = useState("");
  const [file ,setFile] = useState(null);
  const [posting , setPosting] = useState(false);
  const [loading ,setLoading] = useState(false);
  const [requested ,setRequested] = useState(null);
  
const handlePostSubmit = async(data)=>{
       setPosting(true);
       setErrMsg("");
       try {
            const uri = file ? ( await handleFileUpload(file)) : ""
            console.log(uri);
            const newData = uri ? {...data , image: uri} : data;
            console.log(newData)
            const res = await  apiRequest({
                  url : "posts/create-post",
                  data : newData ,
                  token : user?.token ,
                  method : "POST"
            })

            if(res.status=== "failed"){
              setErrMsg(res);
             }else{
              reset({ description : ""})
                setFile(null);
                setErrMsg("");
              await  fetchPost()
             }
            setPosting(false);
       } catch (error) {
        
       }
  }

  const fetchPost = async()=>{
     await fetchPosts(user?.token , dispatch);
     setLoading(false);
}; 

const handleLikePost = async(uri)=>{
  await likePost({uri : uri,token : user?.token} );
    fetchPost();
}

const handleDelete = async(id)=>{
  await deletePost({id : id,token : user?.token} );
  await  fetchPost();
}

const fetchFriendRequests = async()=>{
  try {
         const res = await apiRequest({
           url : "/users/get-friend-request",
           token : user?.token ,
           method :"POST"
         });
         setFriendRequest(res?.data)
  } catch (error) {
    console.log(error)
  }
}

const fetchSuggestedFriends = async()=>{
  try {
    const res = await apiRequest({
      url : "/users/suggested-friends",
      token : user?.token ,
      method :"POST"
    });
    setSuggestedFriend(res?.data)
  } catch (error) {
    console.log(error)
  }
}

const handeleFriendRequest = async (id)=>{
   try {  
       const res = await sendFriendRequset({token:user.token ,id : id})
       console.log(res)
      await   fetchSuggestedFriends();
   } catch (error) {
     console.log(error)
   }
}

const acceptFriendRequest = async (id ,status)=>{
    try {
       const res= await apiRequest({
         url : "/users/accept-request",
         token : user?.token,
         method : "POST",
         data : {rid : id , status}
       })
    } catch (error) {
      console.log(error)
    }
}

const getUser = async ()=>{
  const res = await getUserInfo({token:user?.token})
  const newData = { token : user?.token , ...res}
  dispatch(UserLogin(newData))
}

useEffect(()=>{
    setLoading(true);
    fetchPost();
    getUser();
    fetchFriendRequests();
    fetchSuggestedFriends();
},[ ])


return (
    <div>
       <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor
       lg:rounded-lg h-screen overflow-hidden'>
       <TopBar></TopBar>

       <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-20  bg-bgColor
         lg:rounded-lg h-screen overflow-hidden'>
           {/* LEFT  */}
              <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
                <ProfileCard user={user}/>
                <FriendsCard friends={user?.friends}/>
                <div className='flex lg:hidden w-full bg-primary  flex-col items-center shadow-sm rounded-xl px-6 mb-3 py-4'>
                       <div className=' w-full  h-full flex flex-col gap-8 overflow-y-auto'>
                          {/* FRIEND REQUESTS  */}
                          <div className='w-full bg-primary  shadow-sm rounded-lg px-3 py-5'>
                                <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                                    <span>Friend Requests</span>
                                    <span>{friendRequest.length}</span>
                                </div>

                                <div className='w-full flex flex-col gap-4 pt-4'>
                                    {
                                    friendRequest?.map(({_id , requestFrom:req})=>{
                                      return  <div key={_id} className='flex items-center justify-between'>

                                                  <Link to={"/profile/" +req._id} className='w-full flex gap-4 items-center cursor-pointer'>
                                                      <img src={req?.profileUrl ? req?.profileUrl : profile} 
                                                      alt={req?.firstName} 
                                                      className='h-10 w-10 rounded-full object-cover'/>

                                                      <div className='flex flex-col '>
                                                      <p className='font-sm text-ascent-1'>  {req.firstName}  {req.lastName}</p>
                                                      <span className='text-sm text-ascent-2'> {req?.profession ? req.profession :"No profession"}</span>
                                                      </div>
                                                  </Link> 

                                                  <div className='flex gap-1' >
                                                    <CustomButton
                                                    title='Accept'
                                                    onClick={()=> acceptFriendRequest(_id , "Accepted")}
                                                    containerStyles='bg-[#0444a4] py-1 rounded-full text-xs text-white px-1.5'
                                                    />
                                                    <CustomButton
                                                    title='Deny'
                                                    onClick={()=> acceptFriendRequest(_id , "Denied")}
                                                    containerStyles='border border-[#666] py-1 rounded-full text-xs text-ascent-1 px-1.5'
                                                    />
                                                  </div>  

                                            </div>
                                    })
                                    }
                                </div>
                          </div>

                          {/* SUGGESTED  FRIENDS*/}
                          <div className='w-full bg-primary  shadow-sm rounded-lg px-3 py-5'>
                                <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                                  <span>Friend Suggestion</span>
                                </div>

                                <div className='w-full flex flex-col gap-4 pt-4'>
                                {
                                    suggestedFriend?.map((sug)=>{
                                      return  <div key={sug._id} className='flex items-center justify-between'>

                                                  <Link to={"/profile/" +sug._id} className='w-full flex gap-4 items-center cursor-pointer'>
                                                      <img src={sug?.profileUrl ? sug?.profileUrl : profile} 
                                                      alt={sug?.firstName} 
                                                      className='h-10 w-10 rounded-full object-cover'/>

                                                      <div className='flex flex-col '>
                                                      <p className='font-sm text-ascent-1'>  {sug.firstName}  {sug.lastName}</p>
                                                      <span className='text-sm text-ascent-2'> {sug?.profession ? sug.profession :"No profession"}</span>
                                                      </div>
                                                  </Link> 

                                                  <div className='flex gap-1' >
                                                      <button
                                                      className='bg-[#0444a430] text-sm text-white p-1 rounded'
                                                      onClick={()=>handeleFriendRequest(sug?._id)}
                                                      >   
                                                          <BsPersonFillAdd size={20} className='text-[#0f52b6]'></BsPersonFillAdd>
                                                          { tick === sug?._id  &&
                                                          ( <>send</>)
                                                          }
                                                      </button>
                                                    
                                                  </div>  

                                            </div>
                                        })
                                    } 
                                </div>
                          </div>

                       </div>
                </div>
              </div>

            {/* CENTER  */}
             <div className='flex-1 h-full bg-primary px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
                  <form 
                  onSubmit={handleSubmit(handlePostSubmit)}
                  className='bg-primary px-4 rounded-lg'>
                         <div className='w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
                              <img src={user?.profileUrl ? user.profileUrl : profile} 
                              className='rounded-full h-12 object-cover w-12'
                              alt="" />

                              <TextInput 
                              styles='w-full rounded-full py-3'
                              type= "text"
                              placeholder='Whats on your mind?'
                              name ="description" 
                              register ={ register("description" ,{
                                    required:"Write something about post"})}
                              error ={errors.description? errors.description.message : ""}
                              />
                         </div>
                         {
                         errMsg?.message && ( 
                            <span className={`text-sm ${ errMsg?.status == "failed" ? "text-[#f64949fe]": "text-[#2ba150fe]"} mt-o.5` }>
                              {errMsg?.message}
                            </span>
                          ) 
                        }

                   <div className='flex justify-between items-center py-4'>
                       <label htmlFor="imgUpload" className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'>
                           <input type="file"
                            onChange={(e)=>{ setFile(e.target.files[0])}}
                            className='hidden'
                            id='imgUpload'
                            data-max-size ='5120'
                            accept='.jpg , .png , .jpeg' />
                            <BiImages />
                            <span>Image</span>
                        </label>

                        <label htmlFor="vidUpload" className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'>
                           <input type="file"
                            onChange={(e)=>{ setFile(e.target.files[0])}}
                            className='hidden'
                            id='vidUpload'
                            data-max-size ='5120'
                            accept='.mp4 , .wav' />
                            <BiVideo />
                            <span>Video</span>
                        </label>

                        <label htmlFor="gifUpload" className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'>
                           <input type="file"
                            onChange={(e)=>{ setFile(e.target.files[0])}}
                            className='hidden'
                            id='gifUpload'
                            data-max-size ='5120'
                            accept='.gif' />
                            <BiGift />
                            <span>Gif</span>
                        </label>

                       <div>
                          {
                              posting ?<Loading/>
                              :(<CustomButton
                                  title="post"
                                  type='submit'
                                  containerStyles=' bg-[#0444a4] font-semibold text-sm text-white py-1 px-6 rounded-full'
                                />
                              )
                            }
                       </div>
                       </div>
                  </form>

                  
                {
                  loading ? <Loading/>
                  : posts?.length > 0 
                  ? (posts.map((post)=>(
                      <PostCard post={post} user={user} 
                      deletePost= {handleDelete}
                      likePost= {handleLikePost}
                      />
                    ))) 
                  : (
                    <div className='flex w-full items-center justify-center'>
                      <p className='text-lg text-ascent-2'>No Post Available</p>
                    </div>
                  )
                }
             </div>

            {/* RIGHT  */}
            <div className='hidden w-1/4  h-full lg:flex flex-col gap-8 overflow-y-auto'>
               {/* FRIEND REQUESTS  */}
               <div className='w-full bg-primary  shadow-sm rounded-lg px-3 py-5'>
                    <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                         <span>Friend Requests</span>
                         <span>{friendRequest.length}</span>
                    </div>

                    <div className='w-full flex flex-col gap-4 pt-4'>
                        {
                         friendRequest?.map(({_id , requestFrom:req})=>{
                           return  <div key={_id} className='flex items-center justify-between'>

                                      <Link to={"/profile/" +req._id} className='w-full flex gap-4 items-center cursor-pointer'>
                                          <img src={req?.profileUrl ? req?.profileUrl : profile} 
                                          alt={req?.firstName} 
                                          className='h-10 w-10 rounded-full object-cover'/>

                                          <div className='flex flex-col '>
                                          <p className='font-sm text-ascent-1'>  {req.firstName}  {req.lastName}</p>
                                          <span className='text-sm text-ascent-2'> {req?.profession ? req.profession :"No profession"}</span>
                                          </div>
                                      </Link> 

                                      <div className='flex gap-1' >
                                        <CustomButton
                                         title='Accept'
                                         onClick={()=> acceptFriendRequest(_id , "Accepted")}
                                         containerStyles='bg-[#0444a4] py-1 rounded-full text-xs text-white px-1.5'
                                        />
                                         <CustomButton
                                         title='Deny'
                                         onClick={()=> acceptFriendRequest(_id , "Denied")}
                                         containerStyles='border border-[#666] py-1 rounded-full text-xs text-ascent-1 px-1.5'
                                        />
                                      </div>  

                                 </div>
                         })
                        }
                    </div>
               </div>

               {/* SUGGESTED  FRIENDS*/}
               <div className='w-full bg-primary  shadow-sm rounded-lg px-3 py-5'>
                    <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                       <span>Friend Suggestion</span>
                    </div>
                    <div className='w-full flex flex-col gap-4 pt-4'>
                    {
                         suggestedFriend?.map((sug)=>{
                           return  <div key={sug._id} className='flex items-center justify-between'>

                                      <Link to={"/profile/" +sug._id} className='w-full flex gap-4 items-center cursor-pointer'>
                                          <img src={sug?.profileUrl ? sug?.profileUrl : profile} 
                                          alt={sug?.firstName} 
                                          className='h-10 w-10 rounded-full object-cover'/>

                                          <div className='flex flex-col '>
                                          <p className='font-sm text-ascent-1'>  {sug.firstName}  {sug.lastName}</p>
                                          <span className='text-sm text-ascent-2'> {sug?.profession ? sug.profession :"No profession"}</span>
                                          </div>
                                      </Link> 

                                      <div className='flex gap-1' >
                                          <button
                                          className='bg-[#0444a430] text-sm text-white p-1 rounded'
                                          onClick={()=>{handeleFriendRequest(sug?._id)
                                            setRequested(sug?._id) 
                                          }}
                                          >                                   
                                            { requested === sug?._id  ? <FaHourglassEnd /> : 
                                             <BsPersonFillAdd size={20} className='text-[#0f52b6]'></BsPersonFillAdd>
                                              
                                             }
                                          </button>
                                        
                                      </div>  

                                 </div>
                            })
                        } 
                    </div>
               </div>

            </div>

       </div>   
     </div>
     
     {
         edit &&  <EditProfile />
       }

  </div>
  )
}

export default Home
