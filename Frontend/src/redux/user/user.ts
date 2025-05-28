import { createSlice } from "@reduxjs/toolkit";

interface INITIALSTATE {
  userData: {};
}

const initialState: INITIALSTATE = {
  userData: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action): any => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
