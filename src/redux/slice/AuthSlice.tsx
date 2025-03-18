import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserDetails {
  userDetails: object,
  username: string,
  isUserLoggedIn: boolean,
  isIntroDisplayed: boolean // New flag for intro screen
}

const initialState: UserDetails = {
  userDetails: {},
  username: '',
  isUserLoggedIn: false,
  isIntroDisplayed: false // Initially, the intro screen is not displayed
}

export const authSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<object>) => {
      state.userDetails = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setIsUserLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isUserLoggedIn = action.payload;
    },
    setIntroDisplayed: (state) => {
      state.isIntroDisplayed = true; // Mark intro as displayed
    },
    setLogoutAction(state) {
      state.isUserLoggedIn = false;
      state.username = '';
      state.userDetails = {};
      state.isIntroDisplayed = false; // Reset intro on logout
    }
  },
});

export const { setUserDetails, setUsername, setIsUserLoggedIn, setIntroDisplayed, setLogoutAction } = authSlice.actions;
export default authSlice.reducer;
