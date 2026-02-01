import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { Bell, HelpCircle, LogOut } from "lucide-react-native";

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: 80 }} // slightly below top
    >
      <DrawerItem
        label="Logout"
        icon={() => <LogOut size={20} color="#000" />}
        onPress={() => router.replace("/")} // navigate to login
      />
    </DrawerContentScrollView>
  );
}

export default function AppLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,
          drawerStyle: { width: 240 }, // make drawer narrower
          headerRight: () => (
            <View style={{ flexDirection: "row", marginRight: 12 }}>
              <TouchableOpacity style={{ marginHorizontal: 8 }} onPress={() => {}}>
                <Bell size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginHorizontal: 8 }} onPress={() => {}}>
                <HelpCircle size={24} color="#000" />
              </TouchableOpacity>
            </View>
          ),
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
