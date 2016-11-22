package com.pureiconsulting.cc;


import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

/**
 * Created by julianzhu on 10/20/15.
 */
public class WebActivity extends BaseActivity {

    WebView myWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Bundle bundle = getIntent().getExtras();
        String url = bundle.getString(getString(R.string.WEBVIEW_URL_KEY));

        //setContentView(R.layout.activity_webview);
        setContentView(R.layout.activity_webview);
        myWebView = (WebView) findViewById(R.id.webview);
        WebSettings webSettings = myWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        myWebView.loadUrl(url);
    }


}
