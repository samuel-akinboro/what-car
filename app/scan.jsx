import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function Scan() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing] = useState('back');
  const [flash, setFlash] = useState('off');
  const camera = useRef(null);
  if (!permission) {
    // Camera permissions are still loading
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <MaterialIcons name="hourglass-empty" size={48} color="#6366F1" />
        <Text className="text-gray-600 mt-4">Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View className="flex-1 bg-white px-6 items-center justify-center">
        <View className="bg-violet-100 w-16 h-16 rounded-full items-center justify-center mb-6">
          <MaterialIcons name="camera" size={32} color="#6366F1" />
        </View>
        <Text className="text-gray-900 text-xl font-semibold mb-2">Camera Access Needed</Text>
        <Text className="text-gray-600 text-center mb-8">
          We need camera access to help you identify cars
        </Text>
        <TouchableOpacity 
          onPress={requestPermission}
          className="bg-violet-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        router.replace({
          pathname: '/processing',
          params: { 
            imageUri: result.assets[0].uri,
            base64Image: result.assets[0].base64
          }
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1">
        <CameraView style={{flex: 1}} facing={facing} enableTorch={flash === 'torch'} ref={camera}>
          <View style={{ paddingTop: insets.top }} className="flex-1">
            {/* Top Bar */}
            <View className="flex-row justify-between items-center px-4 py-2">
              <TouchableOpacity className="p-2" onPress={() => router.back()}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
              <View className="bg-black/30 px-3 py-1 rounded-full">
                <Text className="text-white text-sm">Unlimited IDs</Text>
              </View>
              <TouchableOpacity 
                className="p-2"
                onPress={() => setFlash(flash === 'off' ? 'torch' : 'off')}
              >
                <MaterialIcons 
                  name={flash === 'off' ? "flash-off" : "flash-on"} 
                  size={24} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>
            {/* Camera Frame */}
            <View className="flex-1 justify-center px-8 items-center">
              <View className="aspect-square w-[85%]">
                {/* Corner Indicators */}
                <View className="absolute top-0 left-0 size-12 border-t-2 border-l-2 border-white" />
                <View className="absolute top-0 right-0 size-12 border-t-2 border-r-2 border-white" />
                <View className="absolute bottom-0 left-0 size-12 border-b-2 border-l-2 border-white" />
                <View className="absolute bottom-0 right-0 size-12 border-b-2 border-r-2 border-white" />
              </View>
            </View>
          </View>
        </CameraView>
      </View>
      <View className="" style={{paddingBottom: insets.bottom}}>
          {/* Bottom Bar */}
          <View className="pb-8 px-4 pt-4">
            <Text className="text-white text-center mb-8">
              Ensure the car is in focus
            </Text>
            <View className="flex-row justify-around items-center">
              <TouchableOpacity className="items-center" onPress={pickImage}>
                <MaterialIcons name="photo-library" size={28} color="white" />
                <Text className="text-white text-xs mt-1">Photos</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="bg-white w-16 h-16 rounded-full items-center justify-center"
                onPress={async () => {
                  console.log("Capturing image");
                  if (camera.current) {
                    try {
                      const photo = await camera.current.takePictureAsync({
                        quality: 0.5,
                        base64: false
                      });

                      console.log('photo', photo);

                      router.replace({
                        pathname: '/processing',
                        params: { 
                          imageUri: photo.uri
                        }
                      });
                    } catch (error) {
                      console.error('Error taking photo:', error);
                    }
                  }
                }}
              >
                <View className="w-14 h-14 rounded-full border-2 border-black" />
              </TouchableOpacity>

              <TouchableOpacity 
                className="items-center"
                onPress={() => router.push("/tips")}
              >
                <MaterialIcons name="help-outline" size={28} color="white" />
                <Text className="text-white text-xs mt-1">Snap Tips</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </View>
  );
}
