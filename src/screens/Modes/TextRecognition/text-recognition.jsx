import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraDevices,
  useCameraPermission,
} from 'react-native-vision-camera';
/* import MLKitOcr from "react-native-mlkit-ocr"; */
import {StackActions, useFocusEffect, useNavigation} from '@react-navigation/native';
import {setMode} from '../../../reducers/voice';
import {useDispatch, useSelector} from 'react-redux';
import {setPhoto, setRecognizedText} from '../../../reducers/textMode';
import {clearAudioQueues, speakWithPause} from '../../../services/audioService';
import { setSpeechFinished, setTimeoutID } from '../../../reducers/configurations';
import TextRecognition, { TextRecognitionScript } from '@react-native-ml-kit/text-recognition';
import { useTranslation } from 'react-i18next';

const TextRecognitionScreen = () => {
  const router = useNavigation();
  const {t} = useTranslation();
  const device = useCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();
  const dispatch = useDispatch();
  const language = useSelector(state => state.configurations.language);
  const intervalID = useSelector(state => state.configurations.intervalID);
  const timeoutID = useSelector(state => state.configurations.timeoutID);
  const timeoutRef = useRef(timeoutID);
  const intervalRef = useRef(intervalID);

  if (!hasPermission) {
    console.log('Get the camera permission');
    requestPermission();
  }
  if (device == null) console.log('Device is null');
  else console.log('device', device);

  const camera = useRef();

  const handleClickPhoto = async () => {
    const photo = await camera.current.takePhoto();
    console.log('photo :\t', photo);
    dispatch(setPhoto(photo));

    console.log('Photo Path :\t', `file://${photo.path}`);
    const result = await TextRecognition.recognize(
      `file://${photo.path}`,
      TextRecognitionScript.DEVANAGARI,
    )
    console.log('recognizedText Value:\t', result);
    dispatch(setRecognizedText(result.text));

    router.dispatch(StackActions.replace('read-text'));
  };

  const playAudio = () => {
    const text = t('textRecognitionScreen', {returnObjects: true}).audio;
    speakWithPause(dispatch, setSpeechFinished, text, language);
    intervalRef.current = setInterval(() => {
      speakWithPause(dispatch, setSpeechFinished, text, language);
    }, 15000); // Repeat every 10 seconds + speech delay = 15 sec
  };

  const handleAudioFeedback = useCallback(() => {
    clearAudioQueues(intervalRef.current, timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      playAudio();
    }, 500);

    dispatch(setTimeoutID(timeoutRef.current));

    return () => {
      clearAudioQueues(intervalRef.current, timeoutRef.current);
    };
  }, [dispatch, t]);

  useFocusEffect(handleAudioFeedback);

  return (
    <Pressable onPress={handleClickPhoto} className="w-full h-full">
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
    </Pressable>
  );
};

export default TextRecognitionScreen;
