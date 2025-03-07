import {View, Text, Pressable, ScrollView} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import {Image} from 'react-native-animatable';
import {useDispatch, useSelector} from 'react-redux';
import {setRecognizedLang, setRecognizedText} from '../../../reducers/textMode';
import TextRecognition, {
  TextRecognitionScript,
} from '@react-native-ml-kit/text-recognition';
import IdentifyLanguages from '@react-native-ml-kit/identify-languages';
import {
  StackActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  setSpeechFinished,
  setTimeoutID,
} from '../../../reducers/configurations';
import {clearAudioQueues, speakWithPause} from '../../../services/audioService';

const ObjectResult = () => {
  const photo = useSelector(state => state.textMode.photo);
  const recognizedText = useSelector(state => state.textMode.recognizedText);
  const recognizedLang = useSelector(state => state.textMode.recognizedLang);
  const router = useNavigation();
  const intervalID = useSelector(state => state.configurations.intervalID);
  const timeoutID = useSelector(state => state.configurations.timeoutID);
  const timeoutRef = useRef(timeoutID);
  const intervalRef = useRef(intervalID);
  const dispatch = useDispatch();

//   const playAudio = () => {
//     const text = [recognizedText];
//     console.log('text :\t', text);
//     speakWithPause(dispatch, setSpeechFinished, text, recognizedLang);
//     intervalRef.current = setInterval(() => {
//       speakWithPause(dispatch, setSpeechFinished, text, recognizedLang);
//     }, 25000); // Repeat every 10 seconds + speech delay = 15 sec
//   };

//   const handleAudioFeedback = useCallback(() => {
//     clearAudioQueues(intervalRef.current, timeoutRef.current);

//     timeoutRef.current = setTimeout(() => {
//       playAudio();
//     }, 500);

//     dispatch(setTimeoutID(timeoutRef.current));

//     return () => {
//       clearAudioQueues(intervalRef.current, timeoutRef.current);
//     };
//   }, [dispatch]);

//   useFocusEffect(handleAudioFeedback);

//   console.log('recognizedText :\n', recognizedText);
//   console.log('recognizedLang :\n', recognizedLang);

  const handleNavigation = () => {
    router.dispatch(StackActions.replace('objectRecognition'));
  };

  return (
    <Pressable
      className="bg-black h-full w-full flex items-center"
      onLongPress={handleNavigation}>
      <Image
        source={{
          uri: `file://${photo.path}`,
        }}
        className="h-full w-full"
      />
    </Pressable>
  );
};

export default ObjectResult;
