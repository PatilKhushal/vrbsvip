import { View, Text, Image, Pressable, ImageBackground } from "react-native";
import React, { useCallback, useRef } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  setSpeechFinished,
  setTimeoutID,
} from "../../reducers/configurations";
import { useDispatch, useSelector } from "react-redux";
import { clearAudioQueues, speakWithPause } from "../../services/audioService";
import { useTranslation } from "react-i18next";
import i18n from "../../services/translationService";

const WelcomePage = () => {
  const router = useNavigation();
  const isSpeechFinished = useSelector(
    (state) => state.configurations.isSpeechFinished
  );
  const intervalID = useSelector((state) => state.configurations.intervalID);
  const timeoutID = useSelector((state) => state.configurations.timeoutID);
  const language = useSelector((state) => state.configurations.language);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const timeoutRef = useRef(timeoutID);
  const intervalRef = useRef(intervalID);

  const playAudio = () => {
    const text = t("welcomeScreen", { returnObjects: true }).audio;
    speakWithPause(dispatch, setSpeechFinished, text, language);
    intervalRef.current = setInterval(() => {
      speakWithPause(dispatch, setSpeechFinished, text, language);
    }, 20000); // Repeat every 10 seconds + speech delay = 15 sec
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

  /* useEffect(() => {
    alert(`WelcomePage ${isSpeechFinished}`);
  }, [isSpeechFinished]) */

  const handleNavigation = () => {
    if (isSpeechFinished) {
      clearAudioQueues(intervalID, timeoutID);
      router.navigate("language-selection"); // Navigate to the next screen
    }
  };

  return (
    <Pressable onLongPress={handleNavigation}>
      <ImageBackground
        source={require("../../assets/images/initialSetup/welcomeBG.jpg")}
        blurRadius={12}
      >
        <View className="flex items-center px-2 gap-2 h-full">
          <Text
            className="w-full text-center"
            style={{
              fontFamily: "Pacifico_400Regular",
              fontSize: 60,
            }}
          >
            {t("welcomeScreen", { returnObjects: true }).message[0]}
          </Text>

          <View className="h-1/2 w-full">
            <Image
              className="w-full h-full "
              source={require("../../assets/images/initialSetup/welcome.png")}
              resizeMode="contain"
            />
          </View>

          <View className="bg-white/[0.2] rounded-lg p-8 backdrop-blur-lg border">
            <Text className="text-2xl text-center text-black">
              {t("welcomeScreen", { returnObjects: true }).message[1]}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default WelcomePage;
