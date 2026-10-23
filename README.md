# Moyenne Master 2.0

A bilingual, offline-first grade calculator for Master mathematics students at Université de Tébessa. Built with HTML, CSS, JavaScript and Capacitor. App ID: `com.sihem.moyennemaster`.

## What is included

- Deep blue/slate interface, phone bottom navigation and desktop side rail.
- Three speciality curricula with automatic modules, coefficients and choices.
- EN/FR interface, Auto/Light/Dark themes, /20, /100 and linear 4.0 scales.
- Live module/UE/semester/year averages, validation badges and credits.
- Year transcript, module chart, copyable summary and coefficient breakdown.
- Numeric and slider targets; required CC/exam marks when one mark is missing.
- Custom modules with any continuous weight from 0–100%, deletion and Undo.
- Optional pattern lock, confirmation, five-attempt cooldown, change/remove and full reset.
- Local saving and migration from `moyenne-master-vscode-v2` and `moyenne-afa-v1`.

## Preview on Windows

Install Node.js, open this folder in VS Code, then run `npm start`. Open http://localhost:3000. Preview does not require dependency installation. You can also double-click START-PREVIEW.bat.

## Update the APK already installed on your phone

1. Back up your existing `moyenne` folder and signing `.jks` separately. Keep the key and its password private.
2. Download this repository with **Code → Download ZIP**, then extract it.
3. In your EXISTING Windows `moyenne` folder, replace `www/index.html`, `package.json`, and `capacitor.config.json` with these versions. Copy the `scripts` directory and `.gitignore` too. Keep your existing `android` folder.
4. In the terminal at the root of `moyenne`, run:

```powershell
npm install
npm run android:prepare-update
npm run android:sync
npm run android:open
```

5. In Android Studio use **Build → Generate Signed App Bundle or APK → APK**. Choose your EXISTING keystore and key alias. Select **release**, then Create.
6. Install the resulting APK over the current app. Do not uninstall first. The app ID, signing key, WebView origin and application data must remain the same for marks to survive.

`android:prepare-update` sets versionCode 2/versionName 2.0.0 after checking the app ID, and saves a local build.gradle backup. Later releases must increment versionCode again. Source updates are not automatically installed on phones.

For a new checkout without an Android project, run `npm install`, `npm run android:add`, then the prepare/sync/open steps. Do not run android:add over an existing Android folder.

## Publish a downloadable release

1. Test the signed release APK on your phone, including old marks, language, theme, lock and custom modules.
2. Rename the signed APK to **Moyenne-Master.apk**.
3. In GitHub choose **Releases → Create a new release**, tag `v2.0.0`, attach the APK and publish it. Attach only the APK, never the signing key.
4. The stable download URL will be:
   https://github.com/ghsihem228-ship-it/moyenne-master/releases/latest/download/Moyenne-Master.apk
5. Add the section in `docs/portfolio-download.html` to your portfolio source and redeploy on Netlify. That URL works only after publishing a release with the exact asset name.

The optional GitHub workflow builds an unsigned-for-production DEBUG APK for testing only. It cannot update your release-signed installation and is not the APK to publish.

## Calculation rules and limits

Marks are normalized to /20. The 4.0 option is a linear conversion, not an institution-specific GPA mapping. A module is complete when all marks required by its weights are present. Incomplete modules are excluded from provisional averages; they count as remaining modules in the planner. An annual average is provisional until both semesters are complete.

Module coefficients determine semester averages. The annual average is the equal average of the two semester averages. The mention thresholds on /20 are 10, 12, 14, 16. A complete passing UE awards its credits; a complete passing semester awards all its credits. Otherwise individually passed modules contribute credits. No additional annual compensation is applied. Confirm these rules with your department before treating results as official.

The supplied curricula total 30 credits per semester/60 per year. Custom modules add their credits to these totals, so denominators increase accordingly. Official module titles remain in French in either interface language.

The pattern is a casual viewing lock, not encryption or account security. “Forgot pattern?” permanently resets marks, custom modules, settings and legacy app data after confirmation. Clearing browser/app storage also erases data. Haptic feedback depends on device/WebView support. The app works without network access; no remote font is required.

## Validation

Browser tests cover all curricula totals, weighting, migration from the installed version, language/scale preservation, target inputs, custom modules/Undo, credits/transcript, lock confirmation and persistent cooldown, reloads and mobile/desktop widths. Android compilation and physical-device behavior must be checked on the release build using your private signing key.

To rerun browser checks: `npm install --no-save playwright@1.62.1`, `npx playwright install chromium`, start `npm start` in another terminal, then run `node tests/regression.cjs` and `node tests/edge-cases.cjs`. Optionally set `CHROMIUM_PATH` to a system Chromium executable.
