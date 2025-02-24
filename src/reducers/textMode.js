import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  photo: '',
  recognizedText : '',
  recognizedLang : 'en-US'
};

export const textModeSlice = createSlice({
  name: 'textMode',
  initialState,
  reducers: {
    setPhoto: (state, action) => {
      state.photo = action.payload;
    },
    setRecognizedText: (state, action) => {
      state.recognizedText = action.payload;
    },
    setRecognizedLang: (state, action) => {
      state.recognizedLang = action.payload;
    },
  },
});

export const {setPhoto, setRecognizedText, setRecognizedLang} = textModeSlice.actions;

export default textModeSlice.reducer;