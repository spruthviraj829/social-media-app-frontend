import React, { useState } from 'react'
import { TbSocial } from 'react-icons/tb'
import Textinput from '../components/Textinput'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Loading from '../components/Loading'
import CustomButton from '../components/CustomButton'
import BgImg from '../assets/img.jpeg'
import { AiOutlineInteraction } from 'react-icons/ai'
import { ImConnection } from 'react-icons/im'
import { BsShare } from 'react-icons/bs'
import { UserLogin } from '../redux/userSlice'
import { apiRequest } from '../utils'
const Login = () => {
  const { register,handleSubmit, formState: { errors }, } = useForm({ mode: "onChange",});

const [errMsg  ,setErrMsg] = useState("");
const [isSubmiting , setIsSubmiting] = useState(false);
const dispatch = useDispatch();

const onSubmit = async( data)=>{
  setIsSubmiting(true);
  try {
    const res = await apiRequest({
      url : "/auth/login",
      data :data,
      method :"POST",
    });

    if(res.status=== "failed"){
     setErrMsg(res);
    }else{
       setErrMsg("");
        const newData = {token : res?.token , ...res?.user};
        dispatch(UserLogin(newData));
        window.location.replace("/") 
    }
     setIsSubmiting(false);
  } catch (error) {
        console.log(error)
        setIsSubmiting(false);
        }
}


  return (
    <div className='h-[100vh] w-full bg-bgColor flex items-center justify-center p-6'>
       <div className='w-full md:w2/3  h-fit lg:h-full  2xl:h-5/6 py-8 lg:p-0
        flex bg-primary rounded-xl overflow-hidden shadow-xl'>

          {/* LEFT */}
          <div  className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col 
          justify-center '>

              <div className='w-full flex gap-2 items-center mb-6'>
                    <div  className='p-2 bg-[#065ad8] rounded text-white'>
                    <TbSocial />
                    </div> 
                  <span className='text-2xl text-[#065ad8] font-semibold'>ShareFun</span>
              </div>

              <p className='text-ascent-1 text-base font-semibold'>Log in to your account</p>
              <span className='text-sm mt-2 text-ascent-2'>Welcome Back</span>

              <form className='py-8 flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
                 <Textinput
                  name='email'
                  placeholder='email@example.com'
                  label='Email Address'
                  type='email'
                  register={register("email", {
                    required: "Email Address is required",
                  })}
                  styles='w-full rounded-full'
                  labelStyle='ml-2'
                  error={errors.email ? errors.email.message : ""}
                  />

                <Textinput
                  name='password'
                  label='Password'
                  placeholder='Password'
                  type='password'
                  styles='w-full rounded-full'
                  labelStyle='ml-2'
                  register={register("password", {
                    required: "Password is required!",
                  })}
                  error={errors.password ? errors.password?.message : ""}
                />
                 
                <Link to="/reset-password" className='text-blue text-right font-semibold text-sm'>Forgot password?</Link> 

                   {
                      errMsg?.message && ( 
                       <span className={`text-sm ${ 
                         errMsg?.status == "failed"  
                         ? "text-[#f64949fe]"
                          : "text-[#2ba150fe]"
                       } mt-o.5` }>
                        {errMsg?.message}
                       </span>
                    ) 
                   }

                {
                  isSubmiting ? <Loading/> : <CustomButton
                  type='submit'
                  title="Login"
                  containerStyles='bg-blue  py-3 rounded-md flex justify-center px-8 text-sm text-white font-medium outline-none'/>
                }
              </form>

            <p className='text-ascent-2 text-sm text-center'
            >Don't have an account? {" "}  
              <Link to='/register'
              className='text-[#065ad8] font-semibold ml-2 cursor-pointer'
                  >Create Account 
              </Link>
             </p> 
            
          </div>

            {/* RIGHT */}
          <div className='hidden  w-1/2 h-full lg:flex flex-col  items-center bg-blue justify-center '>
              <div className='relative w-full flex items-center justify-center'>
                      <img
                       src={BgImg} 
                       alt="bg Image"
                       className='w-48  2xl:w-64 h-48 2xl:h-64 rounded-full object-cover'
                       />

                    <div className='absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full'>
                      <BsShare size={14} />
                      <span className='text-xs font-medium'>Share</span>
                    </div>

                    <div className='absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full'>
                      <ImConnection />
                      <span className='text-xs font-medium'>Connect</span>
                    </div>

                    <div className='absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full'>
                      <AiOutlineInteraction/>
                      <span className='text-xs font-medium'>Interact</span>
                    </div>
              </div>

             <div className='mt-16 text-center'>
                  <p className='text-white text-base'>
                    Connect with friedns & have share for fun
                  </p>
                  <span className='text-sm text-white/80'>
                    Share memories with friends and the world.
                  </span>
            </div>
          </div>
       </div>
    </div>
  )
}

export default Login