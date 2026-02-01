package com.snametech.employeetrackerManager

import android.annotation.SuppressLint
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.*
import android.util.Log
import androidx.core.net.toUri
import android.os.PowerManager
import android.net.Uri
import android.os.Build
import android.provider.Settings

class LocationModule : Module() {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    @SuppressLint("BatteryLife")
    override fun definition() = ModuleDefinition {

        Name("LocationModule")

        Events("onLocationUpdate")

        OnCreate {
            Log.d("LocationModule", "EXPO MODULE INITIALIZED")
            val manager = appContext.reactContext?.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val channel = NotificationChannel(
                    "location_channel",
                    "Location Tracking Channel",
                    NotificationManager.IMPORTANCE_LOW
                )
                manager.createNotificationChannel(channel)
                }
            scope.launch {
                // LocationStore is now found locally
                LocationStore.location.collect { state ->
                    if (state != null) {
                        sendEvent(
                            "onLocationUpdate",
                            mapOf(
                                "latitude" to state.latitude,
                                "longitude" to state.longitude,
                                "address" to (state.address ?: "Searching...")
                            )
                        )
                    }
                }
            }
        }

        OnDestroy {
            scope.cancel()
        }

        Function("startTracking") {
            Log.d("LocationModule", "StartTracking function called from JS") // <--- NATIVE LOG
            
            val mContext = appContext.reactContext ?: run {
                Log.e("LocationModule", "Context is NULL!")
                return@Function false
            }
            
            val intent = Intent(mContext, LocationService::class.java)
            
            ContextCompat.startForegroundService(mContext, intent)
            Log.d("LocationModule", "Foreground Service intent sent") // <--- NATIVE LOG
            return@Function true
        }

        
        Function("stopTracking") {
            val mContext = appContext.reactContext ?: return@Function false
            val intent = Intent(mContext, LocationService::class.java)
            mContext.stopService(intent)
            return@Function true
        }

        // Inside LocationModule.kt
        Function("requestBatteryOptimization") {
            val intent = Intent()
            val packageName = appContext.reactContext?.packageName
            
            // Check if we can go directly to the app's specific toggle
            intent.action = android.provider.Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS
            intent.data = "package:$packageName".toUri()
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            
            appContext.reactContext?.startActivity(intent)
        }


        Function("isBatteryOptimizationIgnored") {
            val powerManager = appContext.reactContext?.getSystemService(Context.POWER_SERVICE) as? PowerManager
            val packageName = appContext.reactContext?.packageName
            return@Function powerManager?.isIgnoringBatteryOptimizations(packageName) ?: false
        }
    } 
}