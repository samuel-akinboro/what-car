import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { router } from "expo-router";

export default function CarCard({ car, style }) {
  return (
    <TouchableOpacity 
      className={`w-[280px] mr-4 overflow-hidden rounded-[12px] ${style}`}
      onPress={() => {
        router.push({
          pathname: '/details',
          params: { carData: JSON.stringify(car) }
        })
      }}
    >
      <View className="relative">
        {car.images?.[0] ? (
          <>
            <ExpoImage
              source={car.images[0]}
              style={{ width: '100%', height: 200, borderRadius: 12}}
              className="rounded-2xl"
              contentFit="cover"
            />
            {/* Dark Overlay */}
            <View className="absolute inset-0 rounded-2xl bg-black/30" />
            {/* Gradient Overlay */}
            <View className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Content Overlay */}
            <View className="absolute inset-0 p-4 flex justify-end">
              {/* Top Bar */}
              <View className="absolute top-0 left-0 right-0 p-4 flex-row justify-between">
                <View className={`px-3 py-1.5 rounded-full ${
                  car.rarity === 'Ultra Rare' ? 'bg-red-500' :
                  car.rarity === 'Very Rare' ? 'bg-orange-500' :
                  car.rarity === 'Rare' ? 'bg-yellow-500' :
                  car.rarity === 'Uncommon' ? 'bg-green-500' :
                  'bg-gray-500'
                }`}>
                  <Text className="text-white text-xs font-bold tracking-wider">
                    {car.rarity.toUpperCase()}
                  </Text>
                </View>
                
                <View className="flex-row items-center">
                  <MaterialIcons name="verified" size={14} color="#22C55E" />
                  <Text className="text-white text-xs font-medium ml-1">
                    {car.matchAccuracy}%
                  </Text>
                </View>
              </View>

              {/* Car Info */}
              <View>
                <Text className="text-white/80 text-sm mb-0.5">
                  {car.manufacturer}
                </Text>
                <Text className="text-white text-lg font-bold mb-2" numberOfLines={1}>
                  {car.name}
                </Text>

                {/* Stats Row */}
                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-white/60 text-[10px] tracking-wider">
                      POWER
                    </Text>
                    <Text className="text-white text-sm font-medium">
                      {car.specs?.power || '--'} hp
                    </Text>
                  </View>
                  <View>
                    <Text className="text-white/60 text-[10px] tracking-wider">
                      0-60 MPH
                    </Text>
                    <Text className="text-white text-sm font-medium">
                      {car.specs?.acceleration || '--'}s
                    </Text>
                  </View>
                  <View>
                    <Text className="text-white/60 text-[10px] tracking-wider">
                      SCANNED
                    </Text>
                    <Text className="text-white text-sm font-medium">
                      {car.relativeTime}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View className="w-full h-[200px] bg-gray-900 rounded-2xl items-center justify-center">
            <MaterialIcons name="directions-car" size={40} color="#8B5CF6" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
} 