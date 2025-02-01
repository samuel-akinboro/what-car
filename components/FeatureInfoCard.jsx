export default function FeatureInfoCard({ feature }) {
  return (
    <View className="absolute bottom-4 left-4 right-4 bg-black/75 rounded-xl p-4">
      <Text className="text-white text-lg font-bold">
        {feature.label}
      </Text>
      <Text className="text-white/80">
        {feature.description}
      </Text>
      <Text className="text-white/60 text-sm">
        Confidence: {Math.round(feature.confidence * 100)}%
      </Text>
    </View>
  );
} 