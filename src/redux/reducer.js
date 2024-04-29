import { combineReducers } from "@reduxjs/toolkit";

import userSlice from "./userSlice";
import postSlice from "./postSlice";
import themeSlice from "./theme";
import followedSlice from "./followedSlice";
import acceptRejectSlice from "./acceptRejectSlice";

const rootReducer = combineReducers({
  user: userSlice, 
  post: postSlice,
  theme : themeSlice,
  follow : followedSlice,
  acceptReject : acceptRejectSlice
});

export {rootReducer}
// export type RootState = ReturnType<typeof rootReducer>; 