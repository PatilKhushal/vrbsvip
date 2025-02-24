import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isSpeechFinished: false,
  intervalID: null,
  timeoutID: null,
  language: 'en-US',
  emergencyContacts : [],
  isFirstTime : true
};

export const counterSlice = createSlice({
  name: 'configurations',
  initialState,
  reducers: {
    setSpeechFinished: (state, action) => {
      state.isSpeechFinished = action.payload;
    },
    setIntervalID: (state, action) => {
      state.intervalID = action.payload;
    },
    setTimeoutID: (state, action) => {
      state.timeoutID = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setEmergencyContacts : (state, action) => {
      console.log("Emergency contacts :\t", action.payload)
      console.log("action.payload :\t", action.payload)
      if(action.payload != null)
        state.emergencyContacts = action.payload;
    },
    setIsFirstTime : (state, action) => {
        state.isFirstTime = action.payload;
    }
  },
});

export const {setSpeechFinished, setIntervalID, setLanguage, setTimeoutID, setEmergencyContacts, setIsFirstTime} =
  counterSlice.actions;

export default counterSlice.reducer;
