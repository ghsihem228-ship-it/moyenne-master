# Moyenne Master 2.2

A bilingual, offline-first grade calculator for Master mathematics students at Université de Tébessa. Built with HTML, CSS, JavaScript and Capacitor. App ID: `com.sihem.moyennemaster`.

## What is included

- Professional bilingual launch screen credited to Gherissi Sihem.
- Persistent app identity, module-completion progress and explicit optional-module guidance.
- Confirmation before module deletion, followed by Undo.
- JSON backups and confirmed restoration across all three specialities.
- Offline PDF transcript export.
- About section with Gherissi Sihem’s portfolio and ghsihem228@gmail.com.
- Deep blue/slate interface, phone bottom navigation and desktop side rail.
- Three speciality curricula with automatic modules, coefficients and choices.
- EN/FR interface, Auto/Light/Dark themes, /20, /100 and linear 4.0 scales.
- Live module/UE/semester/year averages, validation badges and credits.
- Year transcript, module chart, copyable summary and coefficient breakdown.
- Numeric and slider targets; required CC/exam marks when one mark is missing.
- Add modules and delete both supplied and custom modules in each speciality, with Undo and any continuous weight from 0–100%.
- Optional pattern lock, confirmation, five-attempt cooldown, change/remove and full reset.
- Local saving and migration from `moyenne-master-vscode-v2` and `moyenne-afa-v1`.

## Preview on Windows

Install Node.js, open this folder in VS Code, then run `npm start`. Open http://localhost:3000. Preview does not require dependency installation. You can also double-click START-PREVIEW.bat.

## Update the APK already installed on your phone

1. Back up your existing `moyenne` folder and signing `.jks` separately. Keep the key and its password private.
2. Download this repository with **Code → Download ZIP**, then extract it.
3. In your EXISTING Windows `moyenne` folder, replace `www/index.html`, `package.json`, and `capacitor.config.json` with these versions. Copy the `scripts` directory and `.gitignore` too. Keep your existing `android` folder.
4. Copy the new `package-lock.json` too, then in the terminal at the root of `moyenne`, run:

```powershell
npm install
npm run android:prepare-update
npm run android:sync
npm run android:open
```

5. In Android Studio use **Build → Generate Signed App Bundle or APK → APK**. Choose your EXISTING keystore and key alias. Select **release**, then Create.
6. Install the resulting APK over the current app. Do not uninstall first. The app ID, signing key, WebView origin and application data must remain the same for marks to survive.

`android:prepare-update` sets versionCode 4/versionName 2.2.0 after checking the app ID, and saves a local build.gradle backup. Later releases must increment versionCode again. Source updates are not automatically installed on phones.

For a new checkout without an Android project, run `npm install`, `npm run android:add`, then the prepare/sync/open steps. Do not run android:add over an existing Android folder.

## Publish a downloadable release

1. Test the signed release APK on your phone, including old marks, language, theme, lock and custom modules.
2. Rename the signed APK to **Moyenne-Master.apk**.
3. In GitHub choose **Releases → Create a new release**, tag `v2.2.0`, attach the APK and publish it. Attach only the APK, never the signing key.
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

To rerun browser checks: `npm install --no-save playwright@1.62.1`, `npx playwright install chromium`, start `npm start` in another terminal, then run `node tests/regression.cjs` `node tests/edge-cases.cjs` and `node tests/launch-and-modules.cjs`. Optionally set `CHROMIUM_PATH` to a system Chromium executable.

Version 2.1 keeps previous grades/settings and remembers deleted modules per speciality. Removing a module excludes it from calculations. Undo restores it with its saved marks. All changes remain local on the phone. The welcome screen appears on cold launches; the pattern lock still guards returns.

## Version 2.2: files, backups and PDF

Run `npm install` BEFORE `npm run android:sync` for this update. Filesystem 6.0.4 and Share 6.0.4 are required for Android file export. Synchronization should report both plugins. The release helper prepares versionCode 4/versionName 2.2.0 and keeps a build.gradle.before-v4 backup.

On a browser, export downloads a JSON backup or PDF. On Android, the file is created in the app cache and the native share sheet opens. Choose a destination that retains it outside the app, such as a files app or Drive. Cancelling the share sheet does not save a durable copy. Test this on the signed APK before distributing it.

A backup includes marks (including entered but incomplete marks), optional choices, custom/deleted modules, targets, language, theme, name and scales for all specialities. The lock pattern is deliberately omitted and the current lock survives a restore. The JSON file is readable by anyone who has it. Restore checks the format and data, then requests confirmation before replacing existing results. Invalid files leave app data intact.

The PDF contains the selected speciality’s full two-semester transcript, coefficients, credits, continuous and exam marks, module and semester averages, annual summary and provisional labels. PDF generation is local; jsPDF 4.2.1 and AutoTable 5.0.9 are vendored with their MIT licenses in `www/vendor`. Standard PDF fonts cover French/English text; other scripts in custom names may require a future font addition.

Validation includes browser regression, backup round trips across all specialities, invalid-file handling, deletion cancellation/Undo, lock behavior with confirmation dialogs, PDF output/content checks and responsive widths. A fresh Capacitor Android project was generated, bumped and synced with both file plugins. Release compilation and physical-device file sharing must still be verified using your existing private signing key.
