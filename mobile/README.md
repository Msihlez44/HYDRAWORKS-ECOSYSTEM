# Native Mobile Preparation

The React application remains the single business-logic source. Capacitor is the selected wrapper boundary for Android and iOS.

## Generate native projects

1. Build the web application with `npm run build`.
2. Install approved current Capacitor packages in a dedicated release change.
3. Run `npx cap add android` and/or `npx cap add ios`.
4. Merge the supplied permission templates into generated platform files.
5. Generate raster launcher icons and splash assets from `web/public/icons/hydra-icon.svg` using the official asset tool.
6. Configure Associated Domains / Digital Asset Links for the actual production domain.
7. Add APNs and Firebase credentials only through native secure configuration.
8. Run `npx cap sync`, then compile and sign in Android Studio/Xcode.

Permissions must be requested only immediately before the feature that needs them. File uploads use the system picker; camera and location access are never assumed. Push tokens must be sent to an authenticated backend registration endpoint before notifications can be delivered.

No Android or iOS store publication has been performed or claimed.
