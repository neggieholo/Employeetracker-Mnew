import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MonitoringProvider from "./SocketContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MonitoringProvider>
        <Stack>
          {/* Login screen */}
          <Stack.Screen
            name="(auth)"           // maps to app/index.tsx
            options={{
              title: "Auth", // custom title
              headerShown: false,    // hide the header
            }}
          />

          {/* Register screen */}
          <Stack.Screen
            name="(app)"
            options={{
              title: "App",
              headerShown: false,
            }}
          />

        </Stack>
      </MonitoringProvider>
    </SafeAreaProvider>
  );
}
