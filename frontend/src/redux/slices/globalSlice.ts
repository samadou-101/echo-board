import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  roomId: string | null;
  isChatOpen: boolean;
  isProjectAdded: boolean;
  isLoggedIn: boolean;
  isDarkTheme: boolean;
}

const initialState: GlobalState = {
  roomId: null,
  isChatOpen: false,
  isProjectAdded: false,
  isLoggedIn: false,
  isDarkTheme: localStorage.getItem("isDarkTheme") === "true",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setRoomId: (state, action: PayloadAction<string | null>) => {
      state.roomId = action.payload;
    },
    clearRoomId: (state) => {
      state.roomId = null;
    },
    setIsChatOpen: (state, action: PayloadAction<boolean>) => {
      state.isChatOpen = action.payload;
    },
    setIsProjectAdded: (state, action: PayloadAction<boolean>) => {
      state.isProjectAdded = action.payload;
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    resetProjects: (state) => {
      state.isProjectAdded = false;
    },
    setIsDarkTheme: (state, action: PayloadAction<boolean>) => {
      state.isDarkTheme = action.payload;
      localStorage.setItem("isDarkTheme", String(action.payload));
    },
  },
});

export const {
  setRoomId,
  clearRoomId,
  setIsChatOpen,
  setIsProjectAdded,
  setIsLoggedIn,
  resetProjects,
  setIsDarkTheme,
} = globalSlice.actions;

export default globalSlice.reducer;
