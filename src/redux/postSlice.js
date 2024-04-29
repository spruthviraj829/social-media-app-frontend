import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    posts :{},
};

const postSlice = createSlice({
     name : "post",
     initialState , 
     reducers :{
         getPost(state , action){
            state.posts = action.payload;
         },
     }
}) 

export default postSlice.reducer;

export function SetPost(post){ 
    return (dispatch , getState)=>{
        dispatch(postSlice.actions.getPost(post))
    }
}

// import { createSlice } from "@reduxjs/toolkit";
// import {store} from "./store"; // Import the store directly

// const initialState = {
//     posts: {},
// };

// const postSlice = createSlice({
//     name: "post",
//     initialState,
//     reducers: {
//         getPost(state, action) {
//             state.posts = action.payload;
//         },
//     },
// });

// export default postSlice.reducer;

// export function SetPost(post) {
//     return (dispatch, getState) => {
//         dispatch(postSlice.actions.getPost(post));
//     };
// }
