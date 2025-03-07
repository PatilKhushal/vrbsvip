import {View, Text, Pressable, ImageBackground, Image} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  setIntervalID,
  setLanguage,
  setSpeechFinished,
} from '../../reducers/configurations';
import {useDispatch, useSelector} from 'react-redux';
import {clearAudioQueues, speakWithPause} from '../../services/audioService';
import {useTranslation} from 'react-i18next';
import {changeLanguage} from '../../services/translationService';

const LanguageSelection = () => {
  const router = useNavigation();
  const isSpeechFinished = useSelector(
    state => state.configurations.isSpeechFinished,
  );
  const intervalID = useSelector(state => state.configurations.intervalID);
  const timeoutID = useSelector(state => state.configurations.timeoutID);
  const language = useSelector(state => state.configurations.language);
  const isFirstTime = useSelector(state => state.configurations.isFirstTime);
  const dispatch = useDispatch();
  const [tapCount, setTapCount] = useState(0);
  const timeoutRef = useRef(timeoutID);
  const intervalRef = useRef(intervalID);

  const {t} = useTranslation();

  const playAudio = () => {
    const text = t('languageSelectionScreen', {returnObjects: true}).audio;
    speakWithPause(dispatch, setSpeechFinished, text, language, true);
    intervalRef.current = setInterval(() => {
      speakWithPause(dispatch, setSpeechFinished, text, language, true);
    }, 25000); // Repeat every 10 seconds + speech delay = 15 sec

    dispatch(setIntervalID(intervalRef.current));
  };

  useEffect(() => {
    // Cleanup function to remove listeners when component unmounts
    return () => {
      clearAudioQueues(intervalRef.current, timeoutRef.current);
    };
  }, []);

  const handleAudioFeedback = useCallback(() => {
    clearAudioQueues(intervalRef.current, timeoutRef.current);

    setTapCount(0);
    timeoutRef.current = setTimeout(() => {
      playAudio();
    }, 500);

    return () => {
      clearAudioQueues(intervalRef.current, timeoutRef.current);
    };
  }, [dispatch, t]);

  useFocusEffect(handleAudioFeedback);

  const handleNavigation = () => {
    if (isSpeechFinished && isFirstTime) {
      clearTimeout(timeoutRef.current);

      setTapCount(tapCount + 1);

      timeoutRef.current = setTimeout(() => {
        if (tapCount === 1) dispatch(changeLanguage('en-US'));
        else if (tapCount === 2) dispatch(changeLanguage('mr-IN'));
        else if (tapCount === 3) dispatch(changeLanguage('hi-IN'));
        else setTapCount(0);

        if (tapCount >= 1 && tapCount < 4) {
          clearAudioQueues(intervalID, timeoutID);
          router.navigate('emergency-contact-setup'); // Navigate to the next screen
        }
      }, 500);
    }
  };

  return (
    <Pressable onPress={handleNavigation}>
      <ImageBackground
        source={require('../../assets/images/initialSetup/welcomeBG.jpg')}
        blurRadius={12}>
        <View className="flex items-center px-2 gap-2 h-full">
          <View className="h-1/4 w-full mt-4">
            <Image
              className="w-full h-full "
              source={require('../../assets/images/initialSetup/languageSelection.png')}
              resizeMode="contain"
            />
          </View>

          <View className="w-full gap-4 flex px-8 items-center ">
            <View className="bg-white/[0.2] rounded-lg p-8 backdrop-blur-lg border w-full">
              <Text className="text-2xl text-center text-black">
                {t('languageSelectionScreen', {returnObjects: true}).message[0]}
              </Text>
            </View>
            <View className="bg-white/[0.2] rounded-lg p-8 backdrop-blur-lg border w-full">
              <Text className="text-2xl text-center text-black">
                {t('languageSelectionScreen', {returnObjects: true}).message[1]}
              </Text>
            </View>
            <View className="bg-white/[0.2] rounded-lg p-8 backdrop-blur-lg border w-full">
              <Text className="text-2xl text-center text-black">
                {t('languageSelectionScreen', {returnObjects: true}).message[2]}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default LanguageSelection;
