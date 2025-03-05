import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: null,
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
  deletePersonalInfo: (state, action) => {
  if (state.userInfo?.personalInfo) {
    const updatedPersonalInfo = { ...state.userInfo.personalInfo };
    const tabsToDelete = action.payload;

    Object.keys(updatedPersonalInfo).forEach((key) => {
      const value = updatedPersonalInfo[key];
      
      if (Array.isArray(value)) {
        updatedPersonalInfo[key] = value.filter(
          item => !tabsToDelete.includes(item)
        );
      }
      else if (tabsToDelete.includes(value)) {
        delete updatedPersonalInfo[key];
      }
    });

    state.userInfo.personalInfo = updatedPersonalInfo;
  }
}   
  },
});

export const { setUserInfo, clearUserInfo, deletePersonalInfo } = authSlice.actions;
export default authSlice.reducer;