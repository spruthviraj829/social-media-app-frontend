import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import TextInput from '../components/Textinput';
import Loading from '../components/Loading';
import CustomButton from '../components/CustomButton';
import { apiRequest } from '../utils';

const ResetPassword = () => {

  const [errMsg ,setErrMsg] =useState("");
  const [isSubmiting , setIsSubmiting] = useState(false);

  const {register , handleSubmit ,getValues, formState :{ errors}} = useForm({mode:"onChange"})

 const onSubmit =async (data)=>{
      try {
        const res = await apiRequest({
          url : "/users/request-passwordreset",
          data :data,
          method :"POST",
        });

        if(res.status=== "failed"){
        setErrMsg(res);
        }else{
          setErrMsg(res);
        }
      setIsSubmiting(false);

      } catch (error) {
      console.log(error)
      setIsSubmiting(false);
      }
 }

 const {email} = getValues();
 console.log(email);

  return (
    <div className='w-full h-[100vh] bg-bgColor  flex justify-center items-center p-6'>
        <div className='bg-primary w-full md:w-1/3 2xl:w-1/4  px-6 py-6 shadow-md rounded-lg'>
           <p className='text-ascent-1 text-lg font-semibold'>Email Address</p>
           <span className='text-sm text-ascent-2'> Enter email address used during registration </span>

            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col  gap-5 py-4'>
                 <TextInput 
                 name= "email"
                 type="email"
                 styles = "w-full rounded-lg"
                 labelStyle ='ml-2'
                 placeholder="Enter your email"
                 register={register("email" , {
                  required : "email is required"
                 })}
                 errors={errors.email ? errors.email.message : ""}
                 
                 />
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
                  title="Submit"
                  containerStyles='bg-blue  py-3 rounded-md flex justify-center px-8 text-sm text-white font-medium outline-none'/>
                }
                
            </form>
        </div>
    </div>
  )
}

export default ResetPassword
