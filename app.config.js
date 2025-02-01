export default {
  expo: {
    name: "What Car",
    slug: "what-car",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#8B5CF6"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.whatcar",
      googleServicesFile: "./GoogleService-Info.plist",
      usesAppleSignIn: true,
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              "com.googleusercontent.apps.173196811341-5b5vchou8ihpcrl4ggbi2h3eketeld3g"
            ]
          }
        ]
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#8B5CF6"
      },
      package: "com.whatcar",
      googleServicesFile: "./google-services.json"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      claudeApiKey: process.env.CLAUDESK_API_KEY,
      eas: {
        projectId: "bf8e7fbf-18c1-419b-b48a-a7d8cffbab3e"
      }
    },
    developmentClient: {
      silentLaunch: true
    },
    plugins: [
      "expo-router",
      "expo-sqlite",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: "com.googleusercontent.apps.com.googleusercontent.apps.173196811341-oj5dallqqas9qor1smn031m3a0d17d8j"
        }
      ],
    ],
    scheme: "whatcar",
    newArchEnabled: true
  }
}; 