import { configureStore } from '@reduxjs/toolkit'
import configurationsReducer from '../reducers/configurations'
import voiceReducer from '../reducers/voice'
import textModeReducer from '../reducers/textMode'

export const store = configureStore({
  reducer: {
    configurations : configurationsReducer,
    voice : voiceReducer,
    textMode : textModeReducer
  },
})