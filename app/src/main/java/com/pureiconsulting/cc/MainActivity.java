package com.pureiconsulting.cc;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

public class MainActivity extends BaseActivity {

    WebViewFragment wv;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        if (findViewById(R.id.fragment_container) != null) {

            // However, if we're being restored from a previous state,
            // then we don't need to do anything and should return or else
            // we could end up with overlapping fragments.
            if (savedInstanceState != null) {
                return;
            }

            // Create a new Fragment to be placed in the activity layout

            wv = new WebViewFragment();
            /**/
            Bundle args = new Bundle();
            //args.putString(getString(R.string.WEBVIEW_URL_KEY), getString(R.string.WEBVIEW_URL_MAIN));
            args.putString(getString(R.string.WEBVIEW_URL_KEY), getString(R.string.WEBVIEW_URL_START));

            wv.setArguments(args);

            // Add the fragment to the 'fragment_container' FrameLayout
            getSupportFragmentManager().beginTransaction()
                    .add(R.id.fragment_container, wv).commit();
        }

    }


    @Override
    public void onBackPressed() {

        if(!wv.onBackPressed()) {
          super.onBackPressed();
        }

    }
}
