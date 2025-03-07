import React from 'react';
import {
  detectObjects,
  useFrameProcessor,
} from 'vision-camera-realtime-object-detection';
import {Camera} from 'react-native-vision-camera';

const objectImage = () => {
  const frameProcessorConfig = {
    modelFile: 'model.tflite', //
    scoreThreshold: 0.5,
  };

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';

    const detectedObjects = detectObjects(frame, frameProcessorConfig);
    console.log(detectedObjects); // you can log or use the detectedObjects as needed
  }, []);

  return (
    <Camera
      device={device}
      isActive={true}
      frameProcessorFps={5}
      frameProcessor={frameProcessor}
    />
  );
};

export default objectImage;
