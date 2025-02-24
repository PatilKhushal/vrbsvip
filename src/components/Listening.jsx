import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import * as Animatable from 'react-native-animatable';

const Listening = () => {
  const [dots, setDots] = useState([1, 2, 3, 4, 5]);

  return (
    <View className="w-full h-full flex items-center justify-center">
      <View className="w-full h-1/4 flex justify-evenly bg-white/[0.4] rounded-xl border-2">
        <View className="flex flex-row gap-2 justify-center">
          {dots.map(dot => (
            <Animatable.View
              key={dot}
              animation={'pulse'}
              iterationCount="infinite"
              duration={1250}
              delay={dot * 250}
              className="w-4 h-10 rounded-full bg-blue-600"
            />
          ))}
        </View>
        <Text className="w-full text-center text-4xl text-black">
          Listening...
        </Text>
      </View>
    </View>
  );
};

export default Listening;
