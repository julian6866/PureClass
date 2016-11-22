package com.pureiconsulting.cc;

import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.view.Menu;
import android.view.MenuItem;

/**
 * Created by julianzhu on 10/29/15.
 */
public class BaseActivity extends FragmentActivity {




    public void loadAbout() {
        //WebViewFragment wv = WebViewFragment.getInstance(getString(R.string.WEBVIEW_URL_ABOUT));
        WebViewFragment wv = new WebViewFragment();

            /**/
        Bundle args = new Bundle();
        args.putString(getString(R.string.WEBVIEW_URL_KEY), getString(R.string.WEBVIEW_URL_ABOUT));
        wv.setArguments(args);
            /**/

        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();

        // Replace whatever is in the fragment_container view with this fragment,
        // and add the transaction to the back stack so the user can navigate back
        transaction.replace(R.id.fragment_container, wv, null);
        //if(lastItemId != id)
        transaction.addToBackStack(null);
        transaction.commit();

    }

    public void loadMain() {


        // when the main fragment loaded, we clear up the stack
        getSupportFragmentManager().popBackStack(null, FragmentManager.POP_BACK_STACK_INCLUSIVE);



    }

    public void loadHelp() {

        WebViewFragment wv = new WebViewFragment();

            /**/
        Bundle args = new Bundle();
        args.putString(getString(R.string.WEBVIEW_URL_KEY), getString(R.string.WEBVIEW_URL_HELP));
        wv.setArguments(args);
            /**/

        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();

        // Replace whatever is in the fragment_container view with this fragment,
        // and add the transaction to the back stack so the user can navigate back
        transaction.replace(R.id.fragment_container, wv, null);
        //if(lastItemId != id)
        transaction.addToBackStack(null);
        transaction.commit();

    }

    public void loadComingSoon() {

        WebViewFragment wv = new WebViewFragment();
        Bundle args = new Bundle();
        args.putString(getString(R.string.WEBVIEW_URL_KEY), getString(R.string.WEBVIEW_URL_COMING));
        wv.setArguments(args);
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.fragment_container, wv, null);
        transaction.addToBackStack(null);
        transaction.commit();

    }


}
