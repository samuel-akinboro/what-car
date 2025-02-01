# What Car AI

What car AI is a mobile application that uses artificial intelligence to instantly identify and provide detailed information about cars from photos. Simply take a photo of any car, and get comprehensive details about its make, model, specifications, and more.

## 🚗 Key Features

- **Instant Car Recognition**: Powered by Claude AI for accurate vehicle identification
- **Detailed Specifications**: Get comprehensive information including:
  - Engine specifications
  - Performance metrics
  - Transmission details
  - Acceleration and top speed
  - Price estimates
- **Rarity Insights**: Learn how common or rare the identified vehicle is
- **Historical Context**: Get production years and interesting facts about each car
- **Clean Interface**: Intuitive UI with real-time scanning animation
- **Offline History**: Save your scanned cars for future reference

## 🎯 Perfect For

- Car enthusiasts
- Car spotters and photographers
- Automotive professionals
- Anyone curious about cars they see on the street

## 🔮 Technology

Built with React Native and Expo, What car AI leverages Anthropic's Claude AI for state-of-the-art computer vision and car identification capabilities. The app combines modern mobile development practices with cutting-edge AI to deliver a seamless car identification experience.

## 📱 Platform Support

Currently available for iOS and Android devices through the Expo platform.

## Prerequisites
- Node.js
- Expo CLI
- Claude API key
- google-services.json and GoogleService-info.plist from firebase

## Installation

1. Clone the repository
2. Install node modules - yarn or npm install
3. Create dev-client build - eas build --profile development
4. install build on physical device/emulator (android) or install on your ios simulator
5. start the server: yarn start or npm start
6. Proceed to adding in your secrets, see the format in the .env.example file
