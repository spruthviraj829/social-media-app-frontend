import { createSlice } from "@reduxjs/toolkit"
import { Login } from "../pages";
import { user } from "../assets/data";

const initialState = {
    user : JSON.parse(window?.localStorage.getItem("user")) ?? { },
    edit : false,
}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        login : (state, action) => {
            state.user = action.payload
        window.localStorage.setItem("user", JSON.stringify(action.payload));
        },
        logout : (state)=>{
             state.user = null ;
             localStorage.removeItem("user");
        },
        updateProfile : (state, action) => {
            state.edit = action.payload
        }
    },
})

export default userSlice.reducer ;

export function UserLogin (user){
     return async (dispatch ,getState) => {
        dispatch(userSlice.actions.login(user))
     } ; 
}
export function Logout (){
     return async (dispatch ,getState) => {
        dispatch(userSlice.actions.logout())
     } ; 
} 

export function updatepdateProfile (val){
 return ( dispatch , getState)=>{
          dispatch(userSlice.actions.updateProfile(val))
 }
}