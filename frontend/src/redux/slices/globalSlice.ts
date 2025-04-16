import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  roomId: string | null;
  isChatOpen: boolean;
}

const initialState: GlobalState = {
  roomId: null,
  isChatOpen: false,
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
  },
});

export const { setRoomId, clearRoomId, setIsChatOpen } = globalSlice.actions;
export default globalSlice.reducer;
