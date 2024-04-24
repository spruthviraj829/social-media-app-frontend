import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducer";

const store = configureStore({
    reducer: rootReducer,
})

const {dispatch} =store;

export {store ,dispatch}


// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch