import Tts from 'react-native-tts';

const speakWithPause = async (
  dispatch,
  setSpeechFinished,
  text,
  language,
  isLanguageSelection = false,
) => {
  dispatch(setSpeechFinished(false));
  await Tts.setDefaultPitch(1);
  await Tts.setDefaultRate(0.5);

  let allPartsSpoken = 0; // Initialize with 0
  let resolvePromise;
  
  const onTtsFinish = () => {
    allPartsSpoken++;
    if (allPartsSpoken === text.length) { 
      // Check if all parts have been spoken
      dispatch(setSpeechFinished(true));
    }
    resolvePromise();
  };

  for (let index = 0; index < text.length; index++) {
    const value = text[index];
    const lang = isLanguageSelection
      ? index === 0
        ? language
        : index === 1
        ? 'en-US'
        : index === 2
        ? 'mr-IN'
        : 'hi-IN'
      : language;
    await Tts.setDefaultLanguage(lang);
    console.log(`language: ${lang}`);
    console.log(`value before: ${value}`);

    await new Promise(resolve => {
      resolvePromise = resolve;
      Tts.speak(value);
      if (index === 0) { 
        Tts.addEventListener('tts-finish', onTtsFinish); 
      }
    });

    console.log(`value after: ${value}`);

    // Adjust the pause duration (in milliseconds) as needed
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Remove listener after all parts are spoken
  Tts.removeEventListener('tts-finish', onTtsFinish);
};

const clearAudioQueues = (intervalID, timeoutID) => {
  Tts.removeAllListeners('tts-finish');
  Tts.stop();
  clearInterval(intervalID);
  clearTimeout(timeoutID);
};

export {speakWithPause, clearAudioQueues};