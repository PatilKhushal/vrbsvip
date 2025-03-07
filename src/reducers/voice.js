import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isSRFinished: true,
  isSRStarted: false,
  SR_Result: null,
  isProceedDetected: null,
  isConfirmation : null,
  isError : false,
  mode : null
};

export const voiceSlice = createSlice({
  name: 'voice',
  initialState,
  reducers: {
    setSRFinished: (state, action) => {
      state.isSRFinished = action.payload;
    },
    setSRStarted: (state, action) => {
      state.isSRStarted = action.payload;
    },
    setSRResult: (state, action) => {
      console.log(action.payload);
      state.SR_Result = action.payload;
    },
    setProceedDetected: (state, action) => {
      state.isProceedDetected = action.payload;
    },
    setConfirmation: (state, action) => {
      state.isConfirmation = action.payload;
    },
    setIsError: (state, action) => {
      state.isError = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const {setSRFinished, setSRStarted, setSRResult, setProceedDetected, setConfirmation, setIsError, setMode} =
  voiceSlice.actions;

export default voiceSlice.reducer;
