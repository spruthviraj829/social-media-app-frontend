import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import {profile} from '../assets'
import moment from 'moment';
import { BiComment, BiLike, BiSolidLike } from 'react-icons/bi';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { DiVim } from 'react-icons/di';
import { useForm } from 'react-hook-form';
import TextInput from './Textinput';
import Loading from './Loading';
import CustomButton from './CustomButton';
import {postComments} from "../assets/data"
import { apiRequest } from '../utils';
// import Noprofile from "../assets/index"


const getPostComments =async (id)=>{
    try {
         const res = await apiRequest({
          url :"/posts/comments/" + id,
          method : "GET",
         })
   
         return res?.data;
    } catch (error) {
      console.log(error)
    }
}

const CommentForm = ({id , user , getComments ,replyAt})=>{
    const [loading , setLoading] =useState(false);
    const [errMsg , setErrMsg] = useState('');
    const { register , handleSubmit , reset , formState :{errors}} = useForm({mode: "onchange"})

    const onSubmit = async(data)=>{
        setLoading(true);
        setErrMsg("");
        try {
             const URL =!replyAt ? "/posts/comment/" + id : "/posts/reply-comment/" + id ;

             const newData ={
               comment : data?.comment,
               from : user?.firstName + " " + user.lastName,
               replyAt : replyAt,
             }
             const res = await apiRequest({
              url : URL,
              data : newData ,
              token : user?.token,
              method : "POST"
             })

             if(res?.status === "failed"){
              setErrMsg(res);
             }else{
                 reset({
                  comment : "",
                 });
                 setErrMsg("");
                 await getComments(id);
             }
            setLoading(false)

        } catch (error) {
          console.log(error)
        }
    }

 return(
        <form onSubmit={handleSubmit(onSubmit)}
          className='w-full border-b border-[#66666645]'>

            <div className='flex w-full items-center gap-2 py-3'>
                <img src={user?.profileUrl ?? profile} alt="" className='h-8 w-8 rounded-full object-cover' />
                <TextInput
                    name='comment'
                    styles='w-full rounded-full py-3'
                    placeholder={replyAt ? `Reply @${replyAt}` : "Comment this post"}
                    register={register("comment", {
                        required: "Comment can not be empty",
                    })}
                    error={errors.comment ? errors.comment.message : ""}
                />
            </div>
            {errMsg?.message && (
                <span
                role='alert'
                className={`text-sm ${
                    errMsg?.status === "failed"
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
                } mt-0.5`}
                >
                {errMsg?.message}
                </span>
            )}

            <div className='flex items-end justify-end pb-2'>
                {loading ? (
                <Loading />
                ) : (
                <CustomButton
                    title='Submit'
                    type='submit'
                    containerStyles='bg-[#0444a4] text-white py-1 px-3 rounded-full font-semibold text-sm'
                />
                 )}
          </div>
        </form>
    )
}


const ReplyCard = ({ reply, user, handleLike }) => {
    return (
      <div className='w-full py-3'>
        <div className='flex gap-3 items-center mb-1'>
          <Link to={"/profile/" + reply?.userId?._id}>
            <img
              src={reply?.userId?.profileUrl ?? profile}
              alt={reply?.userId?.firstName}
              className='w-8 h-8 rounded-full object-cover'
            />
          </Link>
  
          <div>
            <Link to={"/profile/" + reply?.userId?._id}>
              <p className=' text-[0.9rem] text-ascent-1'>
                {reply?.userId?.firstName} {reply?.userId?.lastName}
              </p>
            </Link>
            <span className='text-ascent-2 text-sm'>
              {moment(reply?.createdAt).fromNow()}
            </span>
          </div>
        </div>
  
        <div className='ml-12'>
          <p className='text-ascent-1 text-[0.9rem] '>{reply?.comment}</p>
          <div className='mt-2 flex gap-6'>
            <p
              className='flex gap-2 items-center text-base text-ascent-2 cursor-pointer'
              onClick={handleLike}
            >
              {reply?.likes?.includes(user?._id) ? (
                <BiSolidLike size={20} color='blue' />
              ) : (
                <BiLike size={15} />
              )}
              {reply?.likes?.length} Likes
            </p>
          </div>
        </div>
      </div>
    );
  };

 

const PostCard = ({post , user , deletePost , likePost}) => {
    const [showAll, setShowAll] = useState(0);
    // const [showAll, setShowAll] = useState(false);
    const [showReply, setShowReply] = useState(0);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [replyComments, setReplyComments] = useState(0);
    const [showComments, setShowComments] = useState(0);

    const getComments =async(id)=>{ 
            setReplyComments(0);
            const result  = await getPostComments(id); 
            setComments(result)
            setLoading(false)
          }
    const handleLike = async (uri) => {
            await likePost(uri);
            await getComments(post?._id);
        };
  
return (
    <div className='mb-2 bg-primary p-4  rounded-xl'>
        <div className=' flex gap-3 items-center mb-2'>
            <Link to={'/profile/' + post?.userId?._id} >
               <img src={post?.userId?.profileUrl ? post?.userId?.profileUrl : profile} alt={post?.userId?.firstName}
                 className='w-10 h-10 rounded-full object-cover' 
              />
            </Link>

           <div className='flex w-full justify-between'>
                <div className=''>
                        <Link to={'/profile/' + post?.userId?._id}>
                            <p className='font-medium  text-ascent-1'> {post?.userId?.firstName} {post?.userId?.lastName}</p>
                            {/* <span className='text-ascent-2'>{user.profession ?? "No Profession"}</span> */}
                        </Link>
                        <p className='text-ascent-2 text-sm'> {post?.userId?.location}</p>
                </div>

                <span className='text-ascent-2 text-sm'>
                    {moment(post?.createdAt ?? "2023-05-25").fromNow()}
                </span>
           </div>
        </div>

        <div>
            <p className='text-ascent-2 text-[0.95rem]'>
                {
                    showAll === post?._id ? post?.description : post?.description.slice(0 ,200)+"..."
                }
                {
                    post?.description?.length > 201 &&
                     (
                        showAll === post?._id ? 
                        <span className='text-blue font-medium  cursor-pointer' onClick={()=>setShowAll(0)}> Show less </span> :
                         <span className='text-blue font-medium  cursor-pointer' onClick={()=>setShowAll(post?._id)}> Show More</span>
                     )
                }
                  {/* {
                    showAll  ? post?.description : post?.description.slice(0 ,300)+"..."
                }
                {
                    post?.description?.length > 301 &&
                     (
                        showAll  ? 
                        <span className='text-blue font-medium  cursor-pointer' onClick={()=>setShowAll(false)}> Show less </span> :
                         <span className='text-blue font-medium  cursor-pointer' onClick={()=>setShowAll(true)}> Show More</span>
                     )
                } */}
            </p>

           {
            post?.image &&
           (
             <img src={post?.image} alt="Post image" width={70} height={70}
             className='w-full mt-2 rounded-lg max-h-[400px] ' />
            )
           }
        </div>

        <div className='mt-4 flex justify-between items-center px-3 py-2 text-ascent-2 text-base border-t border-[#66666645]'>
            <p className='flex gap-1 text-base cursor-pointer' 
             onClick={()=> handleLike("/posts/like/"+post?._id)}>
                {post?.likes?.includes(user?._id) ? <BiSolidLike size={20} color='blue' /> :(<BiLike size={20}/>)}
                {post?.likes?.length} Likes
            </p>

            <p 
             className='flex items-center gap-1 text-base cursor-pointer'
             onClick={()=>{
                setShowComments(showComments === post?._id ? null  : post._id)
                getComments(post?._id)
             }}
             >
                <BiComment size={20}/>
                {post?.comments?.length} Comments
            </p>

            {
                post?.userId?._id === user?._id && (
                <div className='flex items-center gap-1 text-balance text-ascent-1 cursor-pointer'
                 onClick={()=>deletePost(post?._id)}
                >
                    <MdOutlineDeleteOutline size={20}/>
                    <span> Delete</span>
                 </div>
                )
            }
        </div>

        {/* COMMENTS  */}
         {
          showComments === post?._id && (
          <div className='w-full mt-4 border-t border-[#66666645] pt-3'>
                <CommentForm
                id={post?._id}
                user={user}
                getComments = {getComments}
                />

                {
                  loading ? <Loading/>
                   : comments?.length > 0 ?( 
                         comments?.map((comment)=>(
                            <div className='w-full py-2 ' key={comment?._id}>
                                <div className='flex gap-3 items-center mb-1'>
                                       <Link to={"/profile/" + comment?.userId?._id}>
                                         <img src={comment?.userId?.profileUrl ?? profile} 
                                           alt= {comment?.userId?.firstName}
                                           className='rounded-full object-cover w-8 h-8'  />
                                       </Link>

                                       <div className='flex -gap-1 flex-col'>
                                            <Link to={"/profile/" + comment?.userId?._id}>
                                                <p className=' text-[0.9rem] text-ascent-1'>
                                                    {comment?.userId?.firstName} {comment?.userId?.lastName}
                                                </p>
                                            </Link>
                                            <span className='hidden md:flex text-ascent-2 text-sm'>
                                                {moment(comment?.createdAt ?? "2023-05-25").fromNow()}
                                            </span>
                                       </div>
                                </div>

                                <div className='ml-12'>
                                    <p className='text-ascent-1 text-sm'>{comment?.comment}</p>
                                    <div className='mt-1 flex gap-6'>
                                        <p className='flex gap-2 items-center text-[0.9rem] text-ascent-2 cursor-pointer'
                                          onClick={()=>handleLike("/posts/like-comment/"+ comment?._id)}
                                        >
                                            {
                                             comment?.likes?.includes(user?._id) ? (
                                                <BiSolidLike size={15} color='blue'/>
                                             ) : (
                                                <BiLike size={15}/>
                                             )
                                            }
                                            {comment?.likes?.length} Likes
                                        </p>

                                        <span className='text-blue cursor-pointer text-[0.9rem]'
                                          onClick={()=> setReplyComments( comment?._id)}
                                        >
                                            Reply
                                        </span>
                                    </div>

                                    {
                                        replyComments === comment?._id && (
                                            <CommentForm
                                             user={user}
                                             id={comment?._id}
                                             replyAt={comment?.from}
                                             getComments={ ()=> getComments(post?._id)}
                                            />
                                        )
                                    }
                                </div>

                                {/* REPLIES  */}
                                    <div className='py-2 px-8 mt-1 '>
                                         {comment?.replies?.length > 0 &&(
                                            <p
                                             className='text-[0.9rem] text-ascent-1 cursor-pointer'
                                             onClick={()=>setShowReply( showReply === comment?.replies?._id ? 0 : comment?.replies?._id)}
                                            >
                                                Show Replies ({comment?.replies?.length})
                                            </p>
                                         )}

                                         {
                                            showReply === comment?.replies?._id &&  
                                            comment?.replies?.map((reply)=>(
                                                <ReplyCard 
                                                 reply={reply} 
                                                  user={user}  
                                                  key={reply?._id}
                                                  handleLike = {()=>handleLike("/posts/like-comment" + comment?._id + "/" + reply?._id)}
                                                />
                                            ))
                                         }
                                    </div>

                            </div>
                         ))
                  )   
                   : (
                        <span className='flex text-sm py-4 text-ascent-2 text-center'>
                            No Comments , be fist to comment
                        </span>
                     )                    
                }
          </div>
          )}
    </div>
  );
};

export default PostCard;
