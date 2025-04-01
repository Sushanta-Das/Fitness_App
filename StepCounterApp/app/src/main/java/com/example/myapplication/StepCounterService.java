package com.example.myapplication;

//import android.annotation.SuppressLint;
import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class StepCounterService extends Service implements SensorEventListener {
    private static final int NOTIFICATION_ID = 1;

    private static final String CHANNEL_ID = "StepCounterChannel";
    private SensorManager sensorManager;
    private Sensor stepSensor;
    private static final String PREFS_NAME_server = "serverLinkForSteps";
    private static final String URL_KEY = "server_url";
    private int dailyStartStepCount = 0;

    public static final String PREFS_NAME = "StepCounterPrefs";
    private static final String DAILY_START_STEP_COUNT_KEY = "daily_step_count";
    public static final String CURRENT_DAY="CURRENT_DAY";
    private static final long INTERVAL_6_HOURS = 6 * 60 * 60 * 1000; //
    private static final String LAST_DAY="LAST_DAY";
    public static final String ACTION_UPDATE_UI = "com.example.stepcounterservice.UPDATE_UI";
    public static final String EXTRA_DAILY_STEP_COUNT = "daily_step_count";

    private static  String SERVER_URL = "http://192.168.29.37:5000/postSteps";
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private OkHttpClient client = new OkHttpClient();
    private void sendDataToServer(int stepCount) {
        SharedPreferences URL = getSharedPreferences(PREFS_NAME_server, MODE_PRIVATE);
        SERVER_URL=URL.getString(URL_KEY,"");
        if(SERVER_URL.isEmpty())
        {return;
            
        }
        new Thread(() -> {
            try {
                // Create JSON data
                String jsonData = "{\"steps\": " + stepCount + "}";
                RequestBody requestBody = RequestBody.create(jsonData, JSON);

                // Build the request
                Request request = new Request.Builder()
                        .url(SERVER_URL)
                        .post(requestBody)
                        .build();

                // Execute the request
                Response response = client.newCall(request).execute();

                if (response.isSuccessful()) {
                    // Data sent successfully
                    Log.d("StepCounterService", "Step count data sent to server.");
                } else {
                    // Handle unsuccessful response
                    Log.e("StepCounterService", "Failed to send step count data to server.");
                }

                response.close();
            } catch (Exception e) {
                Log.e("StepCounterService", "Exception during data posting: " + e.getMessage());
            }
        }).start();
    }
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        Notification notification = buildNotification();
        startForeground(NOTIFICATION_ID, notification);

//        scheduleDataPosting();
        return START_STICKY;
    }
    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        if (sensorManager != null) {
            stepSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
            if (stepSensor != null) {
                sensorManager.registerListener(this, stepSensor, SensorManager.SENSOR_DELAY_NORMAL);
            } else {
                // Step counter sensor not available on this device
            }
        } else {
            // Sensor manager not available
        }

        // Load the previous daily step count from SharedPreferences
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);

        dailyStartStepCount = prefs.getInt(DAILY_START_STEP_COUNT_KEY, 0);

    }





    @Override
    public void onDestroy() {
        super.onDestroy();
        if (sensorManager != null) {
            sensorManager.unregisterListener(this);
        }
    }
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "Step Counter Channel", NotificationManager.IMPORTANCE_DEFAULT);
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }
    private Notification buildNotification() {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Step Counter Service")
                .setContentText("Counting steps in background")
                .setSmallIcon(R.drawable.ic_launcher_foreground)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);

        return builder.build();
    }





    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_STEP_COUNTER) {
            if(isNewDay())
            {

                SharedPreferences.Editor editor2 = getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit();
                editor2.putInt(DAILY_START_STEP_COUNT_KEY, 0);
                editor2.apply();
                dailyStartStepCount=0;

            }
            if(dailyStartStepCount==0)
            {
                dailyStartStepCount  = (int) event.values[0];
                SharedPreferences.Editor editor = getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit();
                editor.putInt(DAILY_START_STEP_COUNT_KEY, dailyStartStepCount);
                editor.apply();

            }
            else {
                int currentStepCount = (int) event.values[0];
                int newSteps = currentStepCount - dailyStartStepCount;
                Log.d("current day", String.valueOf(newSteps));
                sendBroadcastToUpdateUI(newSteps);
                SharedPreferences.Editor editor = getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit();
                editor.putInt(CURRENT_DAY, newSteps);
                editor.apply();
//                sendDataToServer(newSteps);


            }



            // Update daily step count in SharedPreferences

            // Check if it's a new day and send the daily count to the UI


        }
    }
    private void notifyDataPostReceiver() {
        Intent intent = new Intent(this, DataPostReceiver.class);

        sendBroadcast(intent);
    }
    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // Handle accuracy changes if needed
    }

    private boolean isNewDay() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        String lastDate = prefs.getString("LastDate", "");
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
        String currentDate = dateFormat.format(Calendar.getInstance().getTime());

        if (!currentDate.equals(lastDate)) {
            // Update the stored date
            prefs.edit().putString("LastDate", currentDate).apply();
            return true;
        }
        return false;
    }

    private void sendBroadcastToUpdateUI(int count) {
        Intent intent = new Intent(ACTION_UPDATE_UI);
        intent.putExtra(EXTRA_DAILY_STEP_COUNT, count);
        sendBroadcast(intent);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
