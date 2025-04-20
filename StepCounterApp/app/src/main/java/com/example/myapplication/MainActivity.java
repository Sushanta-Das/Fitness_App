package com.example.myapplication;

import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;


import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityManagerCompat;

import java.util.Objects;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class MainActivity extends AppCompatActivity {
    private TextView stepCountTextView;
    private static  String SERVER_URL = "http://192.168.29.37:5000/postSteps";
    private static  String EMAIL="abc@Gmail.com";
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private OkHttpClient client = new OkHttpClient();
    private static final String CURRENT_DAY="CURRENT_DAY";
    private EditText urlEditText;
    private Button saveUrlButton;
    private EditText EmailEditText;
    private Button saveEmailButton;
    private SharedPreferences sharedPreferences;
    private SharedPreferences sharedPreferences2;
    private static final String PREFS_NAME_server = "serverLinkForSteps";
    private static final  String USERPREF="USER";
    private static final String EMAIL_KEY = "Email_key";
    private static final String URL_KEY = "server_url";
    private BroadcastReceiver uiUpdateReceiver;
    private static final String PREFS_NAME = "StepCounterPrefs";

    @RequiresApi(api = Build.VERSION_CODES.TIRAMISU)
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        stepCountTextView = findViewById(R.id.bigger_steps_textview);

        startStepCounterService();
        // Register BroadcastReceiver to receive updates from StepCounterService
        uiUpdateReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (intent.getAction() != null && intent.getAction().equals(StepCounterService.ACTION_UPDATE_UI)) {
                    int dailyStepCount = intent.getIntExtra(StepCounterService.EXTRA_DAILY_STEP_COUNT, 0);
                    updateUI(dailyStepCount);
                }
            }
        };
        registerReceiver(uiUpdateReceiver, new IntentFilter(StepCounterService.ACTION_UPDATE_UI), Context.RECEIVER_NOT_EXPORTED);
        urlEditText = findViewById(R.id.url_editText);
        saveUrlButton = findViewById(R.id.button);
        EmailEditText = findViewById(R.id.emailEdit);
        saveEmailButton = findViewById(R.id.button2);
        sharedPreferences = getSharedPreferences(PREFS_NAME_server, MODE_PRIVATE);
        SERVER_URL=sharedPreferences.getString(URL_KEY,"");
        sharedPreferences2 = getSharedPreferences(USERPREF, MODE_PRIVATE);
        EMAIL=sharedPreferences2.getString(EMAIL_KEY,"");
        if(!EMAIL.isEmpty())
        {
            EmailEditText.setText(EMAIL);
        }
        if(!SERVER_URL.isEmpty())
        {
            urlEditText.setText(SERVER_URL);
        }
                saveUrlButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String url = urlEditText.getText().toString().trim();
                if (!url.isEmpty()) {
                    saveUrlToPrefs(url);
                    Toast.makeText(MainActivity.this, "Server URL saved.", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(MainActivity.this, "Please enter a valid URL.", Toast.LENGTH_SHORT).show();
                }
            }
        });
                saveEmailButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        String email =EmailEditText .getText().toString().trim();
                        if (!email.isEmpty()) {
                            saveEmailToPrefs(email);
                            Toast.makeText(MainActivity.this, "Email saved.", Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(MainActivity.this, "Please enter a valid Email.", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
    }
    private void saveUrlToPrefs(String url) {
        sharedPreferences = getSharedPreferences(PREFS_NAME_server, MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(URL_KEY, url);
        SERVER_URL=url;
        editor.apply();
    }
    private void saveEmailToPrefs(String email) {
        sharedPreferences = getSharedPreferences(USERPREF, MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(EMAIL_KEY, email);
        EMAIL=email;
        editor.apply();
    }

    @Override
    protected void onResume() {
        super.onResume();
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);

        int TodaySteps = prefs.getInt(CURRENT_DAY, 0);
        if(!SERVER_URL.isEmpty())
        {
            sendDataToServer(TodaySteps);
        }

        String txt= String.valueOf(TodaySteps);
        stepCountTextView.setText(txt);

    }

    private void sendDataToServer(int stepCount) {
        new Thread(() -> {
            try {
                // Create JSON data
                String jsonData = "{\"steps\": " + stepCount + ", \"email\": \"" + EMAIL + "\"}";
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
    protected void onDestroy() {
        super.onDestroy();
        // Unregister the BroadcastReceiver when activity is destroyed
        unregisterReceiver(uiUpdateReceiver);
    }

    private void updateUI(int count) {
        String txt= String.valueOf(count);
        stepCountTextView.setText(txt);
    }
    private void startStepCounterService() {
        if (!isServiceRunning(StepCounterService.class)) {
            Intent serviceIntent = new Intent(this, StepCounterService.class);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Context context = getApplicationContext();
                // Build the intent for the service
                context.startForegroundService(serviceIntent);

                startForegroundService(serviceIntent);
            } else {
                startService(serviceIntent);
            }
        }
    }
    private boolean isServiceRunning(Class<?> serviceClass) {
        ActivityManager activityManager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        if (activityManager != null) {
            for (ActivityManager.RunningServiceInfo service : activityManager.getRunningServices(Integer.MAX_VALUE)) {
                if (serviceClass.getName().equals(service.service.getClassName())) {
                    return true;
                }
            }
        }
        return false;
    }
}
