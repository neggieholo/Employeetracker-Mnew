import "../../global.css"
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as LocationModule from '../../../modules/LocationModule';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';


type LocationState = {
  latitude: number;
  longitude: number;
  address?: string | null;
};

export default function Index() {
  const [location, setLocation] = useState<LocationState | null>(null);

  useEffect(() => {
    
    const startTrackingSafely = async () => {
      console.log("Checking permissions...");
      const ignored = await LocationModule.isBatteryOptimizationIgnored();

      // const { status: netStatus } = await Notifications.requestPermissionsAsync();
      // if (netStatus !== 'granted') {
      //   alert('Notification permissions are required to show the tracking status.');
      //   return;
      // }
      
      // 1. Request Foreground
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
            
      // 2. Request Background (Android 14 requirement)
      // Note: On some versions, you must have Foreground granted before asking for Background
      if (fgStatus === 'granted') {
        await Location.requestBackgroundPermissionsAsync();
        
        console.log("Permissions granted, starting native module...");
        if(!ignored) {
          try {
              LocationModule.requestBatteryOptimization();
          } catch (e) {
            console.log("Battery setting popup skipped or failed", e);
          }
        }
        try {
          LocationModule.startTracking();
        } catch (e) {
          console.error("Failed to start native tracking", e);
        }
      }
    };

    startTrackingSafely();

    // 3. LISTEN for the updates coming from Kotlin
    const subscription = LocationModule.addLocationListener((data) => {
      console.log("Update received in UI:", data);
      setLocation(data);
    });

    return () => {
      subscription.remove();
    };
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Tracker (Manager)</Text>

      {location ? (
        <>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
          <Text>
            Address: {location.address ?? 'Resolving...'}
          </Text>
        </>
      ) : (
        <Text>Waiting for location…</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  }
});
