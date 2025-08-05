export default ({ config }) => {
  return {
    ...config,
    name: "Bpesa Mobile Money",
    slug: "bpesa",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "app.rork.bpesa-mobile-money"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
      permissions: [
        "NOTIFICATIONS",
        "RECEIVE_BOOT_COMPLETED"
      ],
      package: "com.devligence.bpesa"
    },
    web: {
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      [
        "expo-router",
        {
          origin: "https://rork.com/"
        }
      ],
      "expo-web-browser",
      "expo-font"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: "https://rork.com/"
      },
      eas: {
        projectId: "68d17d74-ef03-4a2a-add1-a4f0a17081a5"
      }
    },
    updates: {
      url: "https://u.expo.dev/68d17d74-ef03-4a2a-add1-a4f0a17081a5", // ✅ this is your project's update URL
    },
    runtimeVersion: {
      policy: "appVersion", // ✅ ensures updates match your app version
    },
    owner: "collinsh"
  };
};
