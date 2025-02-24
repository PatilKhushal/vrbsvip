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
import {clearAudioQueues} from '../../services/audioService';
import {setEmergencyContacts} from '../../reducers/configurations';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfirmationScreen = () => {
  const dispatch = useDispatch();
  const isSRFinished = useSelector(state => state.voice.isSRFinished);
  const isSRStarted = useSelector(state => state.voice.isSRStarted);
  const isConfirmation = useSelector(state => state.voice.isConfirmation);
  const SR_Result = useSelector(state => state.voice.SR_Result);
  const emergencyContacts = useSelector(
    state => state.configurations.emergencyContacts,
  );
  const isError = useSelector(state => state.voice.isError);
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
    console.log('isConfirmation :\t', isConfirmation);
    console.log('emergencyContacts :\t', emergencyContacts);

    if (isSRFinished && isConfirmation == 'true') {
      const updatedEmergencyContacts = [...emergencyContacts, SR_Result];
      AsyncStorage.setItem('emergencyContacts', updatedEmergencyContacts.toLocaleString())
        .then(() => {
          dispatch(setEmergencyContacts(updatedEmergencyContacts))
          router.dispatch(StackActions.replace('emergency-contact-setup'));
          console.log('Contact added to emergency contacts');
        })
        .catch(error => console.log(error));
    } else if ((isSRFinished && isConfirmation == 'false') || isError) {
      router.dispatch(StackActions.replace('emergency-contact-setup'));
      console.log('Contact not added to emergency contacts');
    } else if (isSRFinished && isConfirmation == 'neutral')
      router.dispatch(StackActions.replace('contact-view'));
  }, [SR_Result, isSRFinished, isConfirmation, emergencyContacts]);

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

export default ConfirmationScreen;
