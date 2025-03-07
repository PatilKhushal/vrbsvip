import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, Pressable, ImageBackground} from 'react-native';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import {StackActions, useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {setSpeechFinished, setTimeoutID} from '../../reducers/configurations';
import {useDispatch, useSelector} from 'react-redux';
import {clearAudioQueues, speakWithPause} from '../../services/audioService';
import { setMode } from '../../reducers/voice';

const Home = () => {
  const router = useNavigation();
  const isSpeechFinished = useSelector(
    state => state.configurations.isSpeechFinished,
  );
  const intervalID = useSelector(state => state.configurations.intervalID);
  const timeoutID = useSelector(state => state.configurations.timeoutID);
  const language = useSelector(state => state.configurations.language);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const timeoutRef = useRef(timeoutID);
  const intervalRef = useRef(intervalID);

  const playAudio = () => {
    const text = t('homeScreen', {returnObjects: true}).audio;
    speakWithPause(dispatch, setSpeechFinished, text, language);
    intervalRef.current = setInterval(() => {
      speakWithPause(dispatch, setSpeechFinished, text, language);
    }, 25000); // Repeat every 10 seconds + speech delay = 15 sec
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
    if (isSpeechFinished) {
      clearAudioQueues(intervalID, timeoutID);
      router.navigate('mode-selection');
    }
  };

  return (
    <Pressable onLongPress={handleNavigation}>
      <ImageBackground
        source={require('../../assets/images/initialSetup/welcomeBG.jpg')}
        blurRadius={12}>
        <View className="flex items-center px-2 gap-2 h-full justify-center">
          {t('homeScreen', {returnObjects: true}).message.map(
            (value, index) => (
              <View className="bg-white/[0.2] rounded-lg p-8 backdrop-blur-lg border w-full" key={index}>
                <Text className="text-2xl text-center text-black">
                  {value}
                </Text>
              </View>
            ),
          )}
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default Home;
