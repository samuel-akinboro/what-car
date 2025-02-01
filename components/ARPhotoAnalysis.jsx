import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import {
  ViroARScene,
  ViroImage,
  ViroNode,
  ViroARImageMarker,
  ViroARSceneNavigator,
  ViroARTrackingTargets,
  ViroMaterials,
} from '@reactvision/react-viro';

// Register the materials first
ViroMaterials.createMaterials({
  marker: {
    diffuseColor: '#FFFFFF',
  },
});

// Register the target image
ViroARTrackingTargets.createTargets({
  "uploadedImage": {
    source: { uri: imageUri }, // This will be updated dynamically
    orientation: "Up",
    physicalWidth: 0.1 // real world width in meters
  },
});

export default function ARPhotoAnalysis({ imageUri }) {
  const [markers, setMarkers] = useState([]);
  
  // Update the target when imageUri changes
  React.useEffect(() => {
    ViroARTrackingTargets.createTargets({
      "uploadedImage": {
        source: { uri: imageUri },
        orientation: "Up",
        physicalWidth: 0.1
      },
    });
  }, [imageUri]);

  const AnalysisScene = () => {
    return (
      <ViroARScene>
        <ViroARImageMarker
          target={"uploadedImage"}
          onAnchorFound={() => {
            setMarkers([
              {
                position: [0, 0, 0],
                label: "Headlights",
                description: "LED Matrix Headlights"
              },
            ]);
          }}
        >
          {markers.map((marker, index) => (
            <ViroNode
              key={index}
              position={marker.position}
              materials={["marker"]}
            >
              <ViroImage
                height={0.05}
                width={0.05}
                source={require('../assets/icon.png')}
              />
            </ViroNode>
          ))}
        </ViroARImageMarker>
      </ViroARScene>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={{ uri: imageUri }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
      />
      
      <ViroARSceneNavigator
        autofocus={true}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        initialScene={{
          scene: AnalysisScene,
        }}
      />
    </View>
  );
} 