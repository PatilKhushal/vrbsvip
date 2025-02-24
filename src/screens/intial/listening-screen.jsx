import {View, Pressable, ImageBackground} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import initVoice from '../../services/voiceRecognitionService';
import Voice from '@react-native-voice/voice';
import {
  StackActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Listening from '../../components/Listening';
import {setProceedDetected} from '../../reducers/voice';
import {clearAudioQueues} from '../../services/audioService';

const ListeningScreen = () => {
  const dispatch = useDispatch();
  const isSRFinished = useSelector(state => state.voice.isSRFinished);
  const isSRStarted = useSelector(state => state.voice.isSRStarted);
  const isProceedDetected = useSelector(state => state.voice.isProceedDetected);
  const SR_Result = useSelector(state => state.voice.SR_Result);
  const router = useNavigation();
  const {t} = useTranslation();
  const intervalID = useSelector(state => state.configurations.intervalID);
  const timeoutID = useSelector(state => state.configurations.timeoutID);
  const timeoutRef = useRef(timeoutID);
  const intervalRef = useRef(intervalID);

  useEffect(() => {
    initVoice(dispatch);
  }, [dispatch]);

  useEffect(() => {
    console.log('isSRStarted :\t', isSRStarted);
    console.log('isSRFinished :\t', isSRFinished);
    console.log('SR_Result :\t', SR_Result);
    console.log('\n\n\n');
    console.log('isProceedDetected :\t', isProceedDetected);

    if (isProceedDetected) {
      router.navigate('setup-completion');
      dispatch(setProceedDetected(false));
    } else if (isSRFinished && SR_Result != null && SR_Result.length === 0)
      router.dispatch(StackActions.replace('emergency-contact-setup'));
    else if (isSRFinished && SR_Result != null && SR_Result.length > 0)
      router.dispatch(StackActions.replace('contact-view'));
  }, [SR_Result, isProceedDetected, isSRFinished, isSRStarted]);

  const handleListening = useCallback(() => {
    clearAudioQueues(intervalRef.current, timeoutRef.current);

    if (isSRFinished) {
      Voice.isAvailable()
        .then(() => {
          Voice.start('en-US')
            .then(console.log('Speech recognition started '))
            .catch(error => {
              console.error('Error starting speech recognition:', error);
            });
        })
        .catch(error => console.log('Voice module is not yet ready.', error));
    }

    return () => {
      clearAudioQueues(intervalRef.current, timeoutRef.current);
    };
  }, [dispatch, t]);

  useFocusEffect(handleListening);

  return (
    <Pressable>
      <ImageBackground
        source={require('../../assets/images/initialSetup/welcomeBG.jpg')}
        blurRadius={12}>
        <View className="flex items-center px-2 gap-2 h-full">
          {isSRStarted && !isSRFinished && <Listening />}
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default ListeningScreen;
