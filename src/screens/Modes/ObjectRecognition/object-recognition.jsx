import React, {useRef, useCallback} from 'react';
import {
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {StackActions, useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setPhoto} from '../../../reducers/textMode';
import {clearAudioQueues, speakWithPause} from '../../../services/audioService';
import { setSpeechFinished, setTimeoutID } from '../../../reducers/configurations';
import { useTranslation } from 'react-i18next';

const ObjectRecognitionScreen = () => {
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
    router.dispatch(StackActions.replace('detect-object'));
  };

  const playAudio = () => {
    const text = t('ObjectRecognitionScreen', {returnObjects: true}).audio;
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

  const handleNavigation = () => {
    router.dispatch(StackActions.replace('home'));
  };
  return (
    <Pressable onPress={handleClickPhoto} className="w-full h-full" onLongPress={handleNavigation}>
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

export default ObjectRecognitionScreen;
