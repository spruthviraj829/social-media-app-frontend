import { createSlice } from "@reduxjs/toolkit";


const storedFollow = window.localStorage.getItem("follow");
const initialState = {
    follow: storedFollow ? JSON.parse(storedFollow) : []
};

const followedSlice = createSlice({
    name: "follow",
    initialState,
    reducers: {
        addFollow: (state, action) => {
            state.follow.push(action.payload);
            window.localStorage.setItem("follow", JSON.stringify(state.follow));
        }
    }
});

export default followedSlice.reducer;

export function Follow(id){
    return ( dispatch , getState)=>{
        dispatch(followedSlice.actions.addFollow(id))
}
}