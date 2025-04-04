import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  roomId: string | null;
}

const initialState: GlobalState = {
  roomId: null,
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
  },
});

export const { setRoomId, clearRoomId } = globalSlice.actions;
export default globalSlice.reducer;
