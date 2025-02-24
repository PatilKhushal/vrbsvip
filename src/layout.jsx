import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomePage from './screens/intial';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import LanguageSelection from './screens/intial/language-selection';
import EmergencyContactSetup from './screens/intial/emergency-contact-setup';
import SetupCompletion from './screens/intial/setup-completion';
import {useEffect, useState} from 'react';
import {loadLanguage} from './services/translationService';
import {NavigationContainer} from '@react-navigation/native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import ListeningScreen from './screens/intial/listening-screen';
import ContactsView from './screens/intial/contact-view';
import ConfirmationScreen from './screens/intial/confirmation-screen';
import { setIsFirstTime } from './reducers/configurations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './screens/Modes/Home';
import ModeSelectionScreen from './screens/Modes/mode-selection';
import TextRecognitionScreen from './screens/Modes/TextRecognition/text-recognition';
import ReadText from './screens/Modes/TextRecognition/read-text';


const Stack = createNativeStackNavigator();
const RootLayout = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(loadLanguage());
  }, [dispatch]);
  
  useEffect(() => {
    const checkFirstTimeUser = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('isFirstTime');
        if (hasLaunched === null) {
          await AsyncStorage.setItem('isFirstTime', 'true');
          dispatch(setIsFirstTime(true))
        } 
        else    dispatch(setIsFirstTime(false))

        setIsLoading(false)
      } catch (error) {
        console.error('Error checking first-time usage:', error);
        dispatch(setIsFirstTime(false))
        setIsLoading(true)
      } 
    };

    checkFirstTimeUser();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="text-recognition"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: 'black',
          },
        }}>
        <Stack.Screen
          name="index"
          component={WelcomePage}
          options={{
            title: t('welcomeScreen', {returnObjects: true}).title,
            headerRight: () => (
              <FontAwesome6 name="person" size={24} color="white" iconStyle='solid'/>
            ),
          }}
        />
        <Stack.Screen
          name="language-selection"
          component={LanguageSelection}
          options={{
            title: t('languageSelectionScreen', {returnObjects: true}).title,
            headerRight: () => (
              <FontAwesome6 name="language" size={24} color="white" iconStyle='solid'/>
            ),
          }}
        />
        <Stack.Screen
          name="emergency-contact-setup"
          component={EmergencyContactSetup}
          options={{
            title: t('emergencyContactScreen', {returnObjects: true}).title,
          }}
        />
        <Stack.Screen
          name="listening-screen"
          component={ListeningScreen}
          options={{
            title: t('listeningScreen', {returnObjects: true}).title
          }}
        />
        <Stack.Screen
          name="contact-view"
          component={ContactsView}
          options={{
            title: t('contactViewScreen', {returnObjects: true}).title,
          }}
        />
        <Stack.Screen
          name="confirmation-screen"
          component={ConfirmationScreen}
          options={{
            title: t('confirmationScreen', {returnObjects: true}).title

          }}
        />
        <Stack.Screen
          name="setup-completion"
          component={SetupCompletion}
          options={{
            title: t('setupCompleteScreen', {returnObjects: true}).title,
          }}
        />
        <Stack.Screen
          name="home"
          component={Home}
          options={{
            title: t('homeScreen', { returnObjects: true }).title,
          }}
        />
        <Stack.Screen
          name="mode-selection"
          component={ModeSelectionScreen}
          options={{
            title: t('modeSelectionScreen', { returnObjects: true }).title,
          }}
        />
        <Stack.Screen
          name="text-recognition"
          component={TextRecognitionScreen}
          options={{
            title: t('textRecognitionScreen', { returnObjects: true }).title,
          }}
        />
        <Stack.Screen
          name="read-text"
          component={ReadText}
          options={{
            title: t('readTextScreen', { returnObjects: true }).title,
          }}
        />
        {/* <Stack.Screen
          name="objectRecognition"
          component={ObjectRecognition}
          options={{
            title: t('objectRecognitionScreen', { returnObjects: true }).title,
          }}
        />
        <Stack.Screen
          name="TextRecognition"
          component={TextRecognition}
          options={{
            title: t('textRecognitionScreen', { returnObjects: true }).title,
          }}
        />
        <Stack.Screen
          name="NavigationAssistance"
          component={NavigationAssistance}
          options={{
            title: t('navigationAssistanceScreen', { returnObjects: true }).title,
          }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootLayout;
