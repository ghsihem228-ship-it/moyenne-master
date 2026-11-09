# Update your existing Android Studio app to 2.3.0

This update adds Master 2 for AFA, AMA and EDPA, while keeping Master 1 results separate. You need your existing local Capacitor project and the signing key used for the installed APK. The cloud source checkout does not contain that private key or your local Android Studio project.

1. In the installed app, export a JSON backup and keep it outside the app. Back up your existing project and keystore separately.
2. Extract the update ZIP into a separate folder. In your **existing** project root (the folder containing `package.json` and `android`), replace `www/index.html`, `package.json`, `package-lock.json`, `capacitor.config.json`, and `scripts/prepare-update.cjs` with the updated versions. Keep the complete `www/vendor` folder. The ZIP contains the web files and vendor libraries if needed. Keep your existing `android` folder and keystore; do not replace them with a newly generated project.
3. In a terminal at that existing project root, run:

   ```powershell
   npm ci
   npm run android:prepare-update
   npm run android:sync
   npm run android:open
   ```

   Do not run `android:add` on your existing project. Synchronization should list the Filesystem and Share plugins. The preparation helper verifies `com.sihem.moyennemaster`, saves `android/app/build.gradle.before-v5`, and sets `versionCode 5` / `versionName "2.3.0"`. If your project is already above versionCode 5, the helper stops; choose a versionCode higher than your installed release manually instead of reducing it.

4. In Android Studio, wait for Gradle sync, then choose **Build → Generate Signed App Bundle or APK → APK**. Select the **same keystore and alias** as the installed release, choose **release**, and build. Keep your keystore password private.
5. Copy the signed APK to your phone and install it **over** the existing app. Do not uninstall or clear storage. Android requires the same application ID and signing key; preserving the existing native project also preserves its WebView origin/settings.
6. Before distribution, check that old Master 1 grades still appear. Switch to Master 2 and verify the three specialities, semesters 3/4, optional modules and final mémoire mark. Check switching back, reopening the app, pattern lock, JSON backup/restore, PDF export, and native file sharing.

The Master 2 tables give the mémoire coefficient (17) and credits (30), but no assessment split. Enter its awarded final mark. The app retains its existing equal-semester annual calculation. This is a personal grade estimate; confirm institutional validation rules with your department.

The browser tests validate the web app. Native synchronization is a separate check; Android release compilation, signing, installation over your current APK, and device file-sharing checks must be completed locally in Android Studio. A debug APK uses a different signing key and cannot replace your release-signed installation.
