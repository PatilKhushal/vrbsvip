import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import mr from '../locales/mr.json';
import {setLanguage} from '../reducers/configurations';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  'en-US': {
    translation: en,
  },
  'mr-IN': {
    translation: mr,
  },
  'hi-IN': {
    translation: hi,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en-US',
    fallbackLng: 'en',
    compatibilityJSON: 'v3', // Ensures compatibility for older JSON structures
    initImmediate: false, // Prevent async issues during initialization
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

const loadLanguage = () => async dispatch => {
  const savedLanguage = await AsyncStorage.getItem('language');
  console.log('savedLanguage :\t', savedLanguage);

  if (savedLanguage) {
    dispatch(setLanguage(savedLanguage));
    i18n.changeLanguage(savedLanguage);
  }
};

const changeLanguage = language => async dispatch => {
  console.log('setted language :\t', language);
  dispatch(setLanguage(language));
  i18n.changeLanguage(language);
  await AsyncStorage.setItem('language', language);
};

export default i18n;
export {loadLanguage, changeLanguage};
