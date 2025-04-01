package com.example.myapplication;
import static android.content.Context.MODE_PRIVATE;
import static com.example.myapplication.StepCounterService.CURRENT_DAY;
import static com.example.myapplication.StepCounterService.PREFS_NAME;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class DataPostReceiver extends BroadcastReceiver {
    private static final String PREFS_NAME_server = "serverLinkForSteps";
    private static final String URL_KEY = "server_url";

    private static  String SERVER_URL = "http://192.168.29.37:5000/postSteps";
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private OkHttpClient client = new OkHttpClient();

    @Override
    public void onReceive(Context context, Intent intent) {
        // Extract step count data from the intent extras
         SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
         int TodaySteps = prefs.getInt(CURRENT_DAY, 0);
         //Set Server Url
        SharedPreferences URL =context.getSharedPreferences(PREFS_NAME_server, MODE_PRIVATE);
        SERVER_URL=URL.getString(URL_KEY,"");
        if(!SERVER_URL.isEmpty())
        {
            sendDataToServer(TodaySteps);
        }

    }

    // Method to send step count data to server
    private void sendDataToServer(int stepCount) {
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
}

