import axios from "axios"
import { SetPost } from "../redux/postSlice";

const APP_URL = "https://social-media-app-backend-chko.onrender.com"
// "http://localhost:4000"

export const API = axios.create({
    baseURL :APP_URL ,
    responseType : "json",
})

// const res = axios.get()  

export const apiRequest = async ({url , token , data , method})=>{
    try {

        const result = await API(url , {
          method : method || "GET",
          data : data ,
          headers : {
            "Content-Type" : "application/json",
            Authorization : token ? `Bearer ${token}`  : "",
          },
        });
       
        return result?.data;
        
    } catch (error) {
         const err = error.response.data ;
         console.log(err);
         return {status:err.sucess , message : err.message} 

    }
}

export const handleFileUpload = async (uploadFile)=>{
      const formData = new FormData();
      formData.append("file" ,uploadFile);
      formData.append("upload_preset" ,"socialmedia");
      console.log("insdie handle filepload");
      try{
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/dqhkucvmm/image/upload/`,
            formData
        );
        console.log(response)
        return response.data.secure_url;
      }
      catch(err){
        console.log(err);
      }

}

export const fetchPosts = async(token, dispatch, uri, data) => {
    try {
        const res= await apiRequest({
            url : uri || "/posts",
            token : token,
            method: "POST",
            data : data || {},
        });
        dispatch(SetPost(res?.data))
    } catch (err) {
            console.log(err)
    }
}

export const likePost = async ({uri , token})=>{
    try {
          const res = await apiRequest({
            url : uri,
            token : token,
            method : "POST",
          });
          return res;
    } catch (error) {
        console.log(error)
    }
}

export const deletePost = async({id ,token})=>{
    try {
         const res = await apiRequest({
            url : "/posts/" +id ,
            token : token ,
            method : "DELETE"
         })
         return ;
    } catch (error) {
         console.log(error)
    }
}


export const getUserInfo = async({token ,id})=>{
    try {
         const uri =  id === undefined ? "/users/get-user" : "/users/get-user/"+id;
         const res = await apiRequest({
            url : uri,
            token : token ,
            method : "POST"
         })

     if(res?.message === "Authentication failde"){
          localStorage.removeItem("user");
          window.alert("user session expired . Login again.");
          window.location.replace("/login");
     }
         return  res?.user;
    } catch (error) {
         console.log(error)
    }
}


export const sendFriendRequset = async ({token , id})=>{
       try {
         console.log(token );
             const res = await apiRequest({
                url : "users/friend-request" ,
                token : token ,
                method : "POST",
                data:{ requestTo : id}
             });
             return ;
        } catch (error) {
             console.log(error)
        }
}

export const viewUserProfile = async ({token , id})=>{
    try {
        const res = await apiRequest({
           url : "/users/profile-view"  ,
           token : token ,
           method : "POST",
           data :{id}
        })
        return ;
   } catch (error) {
        console.log(error)
   }
}


