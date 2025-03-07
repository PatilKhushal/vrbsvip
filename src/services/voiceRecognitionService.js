import {
  setConfirmation,
  setIsError,
  setMode,
  setProceedDetected,
  setSRFinished,
  setSRResult,
  setSRStarted,
} from '../reducers/voice';
import Voice from '@react-native-voice/voice';
import Contacts from 'react-native-contacts';
import {setEmergencyContacts} from '../reducers/configurations';

const onSpeechStart = (e, dispatch) => {
  console.log('onSpeechStart: ', e);
  dispatch(setSRStarted(true));
  dispatch(setSRFinished(false));
};

const onSpeechRecognized = e => {
  console.log('onSpeechRecognized: ', e);
};

const onSpeechEnd = e => {
  console.log('onSpeechEnd: ', e);
};

const onSpeechError = (e, dispatch) => {
  console.log('onSpeechError: ', e);
  dispatch(setSRFinished(true));
  dispatch(setSRStarted(false));
  const payload = [];
  dispatch(setSRResult(payload));
  dispatch(setConfirmation('false'));
  dispatch(setIsError(true));
  dispatch(setMode('home'));
  dispatch(setProceedDetected(false));
};

const onSpeechResults = async (e, dispatch) => {
  console.log('onSpeechResults: ', e);
  dispatch(setSRFinished(true));
  dispatch(setSRStarted(false));
  dispatch(setIsError(false));
  dispatch(setMode(null));
  
  const res = e.value[0].toLowerCase();
  console.log("res :\t", res);
  if (
    res.includes('next') ||
    res.includes('proceed') ||
    res.includes('cancel') ||
    res.includes('object') ||
    res.includes('text') ||
    res.includes('navigation')
  ) {
    let caseCompare = '';

    if (res.includes('next')) caseCompare = 'next';
    else if (res.includes('proceed')) caseCompare = 'proceed';
    else if (res.includes('cancel')) caseCompare = 'cancel';
    else if (res.includes('object')) caseCompare = 'object';
    else if (res.includes('text')) caseCompare = 'text';
    else if (res.includes('navigation')) caseCompare = 'navigation';

    switch (caseCompare) {
      case 'next':
        dispatch(setProceedDetected(true));
        break;

      case 'proceed':
        dispatch(setConfirmation('true'));
        break;

      case 'cancel':
        dispatch(setConfirmation('false'));
        break;

      case 'object':
        dispatch(setMode('object'));
        break;

      case 'text':
        dispatch(setMode('text'));
        break;

      case 'navigation':
        dispatch(setMode('navigation'));
        break;
    }

    dispatch(setSRResult(null));
  } else {
    dispatch(processRecognition(res));
    dispatch(setProceedDetected(false));
    dispatch(setMode('home'));
  }
};

const onSpeechPartialResults = e => {
  console.log('onSpeechPartialResults: ', e);
};

const onSpeechVolumeChanged = e => {
  console.log('onSpeechVolumeChanged: ', e);
};

const processRecognition = result => async dispatch => {
  const contacts = await Contacts.getContactsMatchingString(result);
  dispatch(setSRResult(contacts));
};

const initVoice = dispatch => {
  Voice.onSpeechStart = e => {
    onSpeechStart(e, dispatch);
  };
  Voice.onSpeechRecognized = e => {
    onSpeechRecognized(e, dispatch);
  };
  Voice.onSpeechEnd = e => {
    onSpeechEnd(e, dispatch);
  };
  Voice.onSpeechError = e => {
    onSpeechError(e, dispatch);
  };
  Voice.onSpeechResults = e => {
    onSpeechResults(e, dispatch);
  };
  Voice.onSpeechPartialResults = e => {
    onSpeechPartialResults(e, dispatch);
  };
  Voice.onSpeechVolumeChanged = e => {
    onSpeechVolumeChanged(e, dispatch);
  };

  return () => {
    Voice.destroy().then(Voice.removeAllListeners);
  };
};

export default initVoice;
