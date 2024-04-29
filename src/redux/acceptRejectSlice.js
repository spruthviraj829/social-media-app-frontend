import { createSlice } from "@reduxjs/toolkit";
// import { JSON } from "react-router-dom";

const rAccepted = window.localStorage.getItem("accept")
const rRejected = window.localStorage.getItem("reject")
const initialState = {
    accetp :rAccepted ? JSON.parse(rAccepted) : [],
    reject : rRejected ? JSON.parse(rRejected) : [], 
}
const acceptRejectSlice = createSlice({
    name : "acceptReject",
    initialState,

    reducers : {
        accept : (state,action) => {
            state.accetp.push(action.payload)
            window.localStorage.setItem("accept", JSON.stringify(state.accetp));
        },
        reject : (state,action) => {
            state.reject.push(action.payload)
            window.localStorage.setItem("reject", JSON.stringify(state.reject));
        }
    }
})

export default acceptRejectSlice.reducer;

export function Accepted(id){
    return (dispatch , getState)=>{
        dispatch(acceptRejectSlice.actions.accept(id))
    }
}
export function Rejected(id){
    return (dispatch , getState)=>{
        dispatch(acceptRejectSlice.actions.reject(id))
    }
}