import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { Bell, LogOut, UserPlus, Key, X } from "lucide-react-native";
import { useMonitoring } from "../SocketContext";
import { DrawerActions } from "@react-navigation/native"; // Import navigation actions


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
          source={require('../../assets/images/empt_logo.png')}
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
            labelStyle={{ color: '#FFFFFF', marginLeft: -6, fontWeight: '600' }}
            icon={() => <UserPlus size={22} color="#FFFFFF" />}
            onPress={() => router.push("/")}
          />
          <DrawerItem
            label="Change Password"
            labelStyle={{ color: '#FFFFFF', marginLeft: -6, fontWeight: '600' }}
            icon={() => <Key size={22} color="#FFFFFF" />}
            onPress={() => router.push("/")}
          />
          <View className="h-[1px] bg-gray-200 my-4 mx-4" />

          <DrawerItem
            label="Logout"
            labelStyle={{ color: '#EF4444', marginLeft: -6, fontWeight: '600' }}
            icon={() => <LogOut size={22} color="#EF4444" />}
            onPress={() => router.replace("/")}
          />
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

export default function AppLayout() {
  const { userName } = useMonitoring();
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
          headerRight: () => isDashboard ? (
            <View style={{ flexDirection: "row", marginRight: 12 }}>
              <TouchableOpacity style={{ marginHorizontal: 8 }} onPress={() => {}}>
                <Bell size={24} color="#FFFFFF" />
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
