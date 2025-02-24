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
};

const onSpeechResults = async (e, dispatch) => {
  console.log('onSpeechResults: ', e);
  dispatch(setSRFinished(true));
  dispatch(setSRStarted(false));
  dispatch(setIsError(false));

  const res = e.value[0];
  if (
    res.includes('proceed') ||
    res.includes('yes') ||
    res.includes('no') ||
    res.includes('one') ||
    res.includes('text') ||
    res.includes('three')
  ) {
    let caseCompare = '';

    if (res.includes('proceed')) caseCompare = 'proceed';
    else if (res.includes('yes')) caseCompare = 'yes';
    else if (res.includes('no')) caseCompare = 'no';
    else if (res.includes('one')) caseCompare = 'one';
    else if (res.includes('text')) caseCompare = 'text';
    else if (res.includes('three')) caseCompare = 'three';

    switch (caseCompare) {
      case 'proceed':
        dispatch(setProceedDetected(true));
        break;

      case 'yes':
        dispatch(setConfirmation('true'));
        break;

      case 'no':
        dispatch(setConfirmation('false'));
        break;

      case 'one':
        dispatch(setMode('one'));
        break;

      case 'text':
        dispatch(setMode('text'));
        break;

      case 'three':
        dispatch(setMode('three'));
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
