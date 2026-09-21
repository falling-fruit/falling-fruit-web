package uh.fallingfruit.app;

import android.os.Bundle;
import android.view.View;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.BridgeActivity;

import java.util.Locale;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // We set `SystemBars.insetsHandling = "disable"` in capacitor.config so
        // Capacitor does NOT pad the WebView by the soft-keyboard (IME) height
        // (which would shrink window.innerHeight and resize the map). The
        // downside is that Capacitor also stops injecting the
        // `--safe-area-inset-*` CSS variables, because it injects them from the
        // same listener it just skipped.
        //
        // Here we re-inject those variables ourselves from the system bar and
        // display-cutout insets, WITHOUT ever padding the WebView for the IME.
        // This mirrors Capacitor's own calcSafeAreaInsets()/injectSafeAreaCSS()
        // (bottom inset is taken from the navigation bar; the IME is ignored),
        // giving us both: no keyboard resize AND populated safe-area vars.
        final View webView = this.bridge.getWebView();
        final View insetTarget = (View) webView.getParent();

        ViewCompat.setOnApplyWindowInsetsListener(insetTarget, (v, insets) -> {
            Insets safeArea = insets.getInsets(
                    WindowInsetsCompat.Type.systemBars()
                            | WindowInsetsCompat.Type.displayCutout());

            injectSafeAreaCss(safeArea.top, safeArea.right, safeArea.bottom, safeArea.left);

            // Do not consume or modify the insets, and do not add padding, so
            // the WebView keeps its full height regardless of the keyboard.
            return insets;
        });

        // Trigger an initial pass so the variables are set on launch.
        ViewCompat.requestApplyInsets(insetTarget);
    }

    private void injectSafeAreaCss(int top, int right, int bottom, int left) {
        float density = getResources().getDisplayMetrics().density;
        final int topDp = (int) (top / density);
        final int rightDp = (int) (right / density);
        final int bottomDp = (int) (bottom / density);
        final int leftDp = (int) (left / density);

        this.bridge.executeOnMainThread(() -> {
            if (this.bridge.getWebView() == null) {
                return;
            }
            String script = String.format(
                    Locale.US,
                    "try {"
                        + "document.documentElement.style.setProperty('--safe-area-inset-top', '%dpx');"
                        + "document.documentElement.style.setProperty('--safe-area-inset-right', '%dpx');"
                        + "document.documentElement.style.setProperty('--safe-area-inset-bottom', '%dpx');"
                        + "document.documentElement.style.setProperty('--safe-area-inset-left', '%dpx');"
                        + "} catch (e) { console.error('Error injecting safe area CSS:', e); }",
                    topDp,
                    rightDp,
                    bottomDp,
                    leftDp);
            this.bridge.getWebView().evaluateJavascript(script, null);
        });
    }
}
