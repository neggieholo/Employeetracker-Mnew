import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native"; // Import navigation actions
import { router, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Bell, Key, LogOut, UserPlus, X } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { postLogout } from "../services/api";
import { useMonitoring } from "../SocketContext";

const brandColor = "rgba(54, 170, 143, 1)";

function CustomDrawerContent(props: any) {
  return (
    // Main container with the teal background
    <SafeAreaView className="flex-1 bg-[#36AA8F]">
      <View className="w-full z-50 flex-row justify-end px-2">
        <TouchableOpacity
          onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
          className="bg-black/20 p-2 rounded-full"
        >
          <X size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* 1. The Logo Header - Outside the ScrollView to avoid padding */}
      <View className="w-full h-56 bg-white mt-2">
        <Image
          source={require("../../assets/images/empt_logo.png")}
          className="w-full h-full"
          resizeMode="stretch" // Use stretch or contain depending on the logo aspect ratio
        />
      </View>

      {/* 2. The Scrollable Items */}
      <DrawerContentScrollView
        {...props}
        // Force zero padding on the internal container
        contentContainerStyle={{ paddingTop: 0 }}
      >
        <View className="px-2 mt-4">
          <DrawerItem
            label="Register an Employee"
            labelStyle={{ color: "#FFFFFF", marginLeft: -6, fontWeight: "600" }}
            icon={() => <UserPlus size={22} color="#FFFFFF" />}
            onPress={() => router.push("/")}
          />
          <DrawerItem
            label="Change Password"
            labelStyle={{ color: "#FFFFFF", marginLeft: -6, fontWeight: "600" }}
            icon={() => <Key size={22} color="#FFFFFF" />}
            onPress={() => router.push("/ChangePassword")}
          />
          <View className="h-[1px] bg-gray-200 my-4 mx-4" />

          <DrawerItem
            label="Logout"
            labelStyle={{ color: "#EF4444", marginLeft: -6, fontWeight: "600" }}
            icon={() => <LogOut size={22} color="#EF4444" />}
            onPress={async () => {
              const result = await postLogout();
              if (result.success) {
                router.replace("/");
              } else {
                console.log("Logout failed:", result.message);
              }
            }}
          />
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

export default function AppLayout() {
  const { userName, badgeCount } = useMonitoring();
  const pathname = usePathname();
  const isDashboard = pathname.includes("dashboard");
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: brandColor },
          headerTintColor: "#FFFFFF",
          drawerStyle: { width: 280, backgroundColor: brandColor },
          headerTitle: isDashboard ? `Hi, ${userName || "Manager"}` : "",
          headerRight: () =>
            isDashboard ? (
              <View className="flex-row mr-4">
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="relative p-1"
                  onPress={() => router.push("/notifications")}
                >
                  <Bell size={26} color="#FFFFFF" />

                  {/* Badge Overlay */}
                  {badgeCount > 0 && (
                    <View
                      className="absolute -top-1 -right-1 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#36AA8F]"
                      style={{ minWidth: 20, height: 20 }}
                    >
                      <Text className="text-white text-[10px] font-bold text-center px-1">
                        {badgeCount > 99 ? "99+" : badgeCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ) : null,
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerItemStyle: { display: "none" }, // hide tabs from drawer
            title: "", // empty header title
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
