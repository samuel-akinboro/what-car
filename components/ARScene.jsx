import React from 'react';
import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroARSceneNavigator,
  ViroBox,
  ViroMaterials,
  ViroNode
} from '@reactvision/react-viro';

const InitialScene = () => {
  const onInitialized = (state, reason) => {
    if (state === ViroConstants.TRACKING_NORMAL) {
      console.log("AR Tracking Ready");
    } else if (state === ViroConstants.TRACKING_NONE) {
      console.log("AR Tracking Lost");
    }
  };

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroNode position={[0, -1, -1]} dragType="FixedToWorld">
        <ViroBox
          position={[0, 0.5, 0]}
          scale={[0.3, 0.3, 0.3]}
          materials={["grid"]}
        />
      </ViroNode>
    </ViroARScene>
  );
};

// Define materials
ViroMaterials.createMaterials({
  grid: {
    diffuseColor: "rgba(200,200,200,1)"
  },
});

export default function ARView() {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: InitialScene,
      }}
      style={{ flex: 1 }}
    />
  );
} 