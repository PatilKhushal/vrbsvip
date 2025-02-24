import {Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({title, onPress}) => {
  return (
    <TouchableOpacity className="bg-black rounded-2xl w-3/4 px-6 py-4" activeOpacity={0.6} onPress={onPress}>
        <Text className="text-white text-center text-2xl font-bold">{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton