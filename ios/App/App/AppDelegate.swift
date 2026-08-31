import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.

        // Workaround for a known iOS/WKWebView bug: after the system presents a
        // remote-scene-hosted UI (e.g. the PHPickerViewController used by
        // @capacitor/camera's "choose from library"), WKWebView's internal
        // gesture recognizers can get stuck in a "possible" state, freezing touch
        // input until iOS times them out.
        scheduleStuckWebViewGesturesReset()
    }

    @objc private func scheduleStuckWebViewGesturesReset() {
        // The exact moment the picker's hosted scene finishes tearing down (and
        // therefore the moment the WKWebView's gesture recognizers actually get
        // stuck) isn't precisely observable from here, so retry a few times
        // over ~2s to reliably catch and reset any recognizer left in the
        // "possible" state.
        for delay in [0.0, 0.2, 0.5, 1.0, 2.0] {
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) { [weak self] in
                self?.resetStuckWebViewGestures()
            }
        }
    }

    private func resetStuckWebViewGestures() {
        guard let bridgeViewController = window?.rootViewController as? CAPBridgeViewController,
              let webView = bridgeViewController.webView else {
            return
        }

        // WKWebView's internal touch-handling gesture recognizers (attached to
        // its private WKContentView subview) can get stuck in the "possible"
        // state after a remote-scene-hosted picker is dismissed. For any
        // recognizer still in that state, toggling isEnabled off/on asks UIKit
        // to cancel it (see UIGestureRecognizer.isEnabled).
        resetPossibleGestureRecognizers(in: webView)
    }

    private func resetPossibleGestureRecognizers(in view: UIView) {
        for recognizer in view.gestureRecognizers ?? [] where recognizer.state == .possible {
            recognizer.isEnabled = false
            recognizer.isEnabled = true
        }

        for subview in view.subviews {
            resetPossibleGestureRecognizers(in: subview)
        }
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
