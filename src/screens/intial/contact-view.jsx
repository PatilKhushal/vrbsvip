import {Text, FlatList, Image, Pressable, ImageBackground} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View} from 'react-native-animatable';
import { useTranslation } from 'react-i18next';
import { clearAudioQueues, speakWithPause } from '../../services/audioService';
import { setIntervalID, setSpeechFinished } from '../../reducers/configurations';
import { StackActions, useFocusEffect, useNavigation } from '@react-navigation/native';

const ContactCard = ({item}) => {
  return (
    item.phoneNumbers[0] && (
      <View className="bg-black/[0.7] w-full p-4 rounded-xl flex items-center flex-row border-2 border-white/[0.5]">
        <View className="w-3/4">
          <Text className="text-purple-500 text-2xl">{item.displayName}</Text>
          <Text className="text-purple-500 text-2xl">
            {item.phoneNumbers[0]?.number}
          </Text>
        </View>
        <Avatar item={item} />
      </View>
    )
  );
};

const Avatar = ({item}) => {
  return (
    <View className="w-1/4 rounded-full flex flex-row aspect-square border-2 border-white/[0.5] justify-center bg-gray-700 items-center">
      {item.hasThumbnail ? (
        <Image
          source={{uri: item.thumbnailPath}}
          className="w-full h-full rounded-full"
        />
      ) : (
        <Text className=" w-full rounded-full text-center text-4xl">
          {item.displayName[0]}
        </Text>
      )}
    </View>
  );
};

const Seperator = () => {
  return <View className=" h-5 w-full" />;
};

const ContactsView = () => {
  const SR_Result = useSelector((state) => state.voice.SR_Result);
  const language = useSelector((state) => state.configurations.language);
    const isFirstTime = useSelector(state => state.configurations.isFirstTime);
  const dispatch = useDispatch();
  const router = useNavigation()
  const intervalID = useSelector((state) => state.configurations.intervalID);
  const timeoutID = useSelector((state) => state.configurations.timeoutID);
  const timeoutRef = useRef(timeoutID);
  const intervalRef = useRef(intervalID);
  const isSpeechFinished = useSelector(
    (state) => state.configurations.isSpeechFinished
  );

  const {t} = useTranslation();

  const playAudio = () => {
    const text = t('contactViewScreen', {returnObjects: true, name : SR_Result[0].displayName}).contactFound;
    console.log("text :\t", text)
    speakWithPause(dispatch, setSpeechFinished, text, language);
    intervalRef.current = setInterval(() => {
      speakWithPause(dispatch, setSpeechFinished, text, language);
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

    timeoutRef.current = setTimeout(() => {
      playAudio();
    }, 500);

    return () => {
      clearAudioQueues(intervalRef.current, timeoutRef.current);
    };
  }, [dispatch, t]);

  useFocusEffect(handleAudioFeedback);

  useEffect(() => {
    console.log(SR_Result);
  }, [SR_Result]);

  const handleNavigation = () => {
    if (isSpeechFinished && isFirstTime) {
      clearAudioQueues(intervalID, timeoutID);
      router.dispatch(StackActions.replace('confirmation-screen'));
    }
  };

  return (
    <Pressable onLongPress={handleNavigation}>
      <ImageBackground
        source={require('../../assets/images/initialSetup/welcomeBG.jpg')}
        blurRadius={12}
        className='h-full px-2'
        >
        <FlatList
          data={SR_Result}
          renderItem={({item}) => (
            <View className="w-full flex items-center rounded-xl">
              <ContactCard item={item} />
            </View>
          )}
          keyExtractor={(item, index) => index}
          className="w-full flex py-4"
          ItemSeparatorComponent={Seperator}
        />
      </ImageBackground>
    </Pressable>
  );
};

export default ContactsView;
