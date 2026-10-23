const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'android', 'app', 'build.gradle');
if (!fs.existsSync(file)) { console.error('First run npm run android:add, or copy this update into your EXISTING moyenne project.'); process.exit(1); }
let source = fs.readFileSync(file, 'utf8');
if (!/applicationId\s+["']com\.sihem\.moyennemaster["']/.test(source)) { console.error('App ID does not match com.sihem.moyennemaster. No files changed.'); process.exit(1); }
const match = source.match(/versionCode\s+(\d+)/);
if (!match) throw new Error('Cannot locate versionCode');
const code = Number(match[1]);
if (code > 4) { console.error('Your project already has versionCode > 4. Review its version manually; no files changed.'); process.exit(1); }
const backup = file + '.before-v4';
if (!fs.existsSync(backup)) fs.copyFileSync(file, backup);
source = source.replace(/versionCode\s+\d+/, 'versionCode 4').replace(/versionName\s+["'][^"']+["']/, 'versionName "2.2.0"');
fs.writeFileSync(file, source);
console.log('Prepared versionCode 4 / versionName 2.2.0. Sign with the SAME .jks and alias as version 1.');
