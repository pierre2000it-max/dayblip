/**
 * process-names.js
 * Builds public/data/names.json from SSA baby names data.
 *
 * USAGE:
 *   1. Automatic:  node scripts/process-names.js
 *      (tries to download from SSA — may get 403 on some networks)
 *
 *   2. Manual zip: Download https://www.ssa.gov/oact/babynames/names.zip
 *      in your browser, save it to scripts/names.zip, then run:
 *      node scripts/process-names.js
 *
 * Output structure: { "Emma": { "F": { "1990": 3456 }, "M": { "1990": 5 } }, ... }
 * Only names with >= 50 total occurrences across all years are included.
 */

const https    = require('https');
const http     = require('http');
const fs       = require('fs');
const path     = require('path');
const os       = require('os');
const { spawnSync } = require('child_process');

const ZIP_URL       = 'https://www.ssa.gov/oact/babynames/names.zip';
const LOCAL_ZIP     = path.join(__dirname, 'names.zip');
const TMP_DIR       = path.join(os.tmpdir(), 'dayblip_names_' + Date.now());
const ZIP_PATH      = path.join(TMP_DIR, 'names.zip');
const EXTR_DIR      = path.join(TMP_DIR, 'extracted');
const OUT_DIR       = path.join(__dirname, '..', 'public', 'data');
const OUT_PATH      = path.join(OUT_DIR, 'names.json');
const MIN_TOTAL     = 50;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file  = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.ssa.gov/oact/babynames/',
        'Connection': 'keep-alive',
      },
    };
    proto.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlink(dest, () => {});
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error('HTTP_' + res.statusCode));
        return;
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function extractZip(zipPath, destDir) {
  ensureDir(destDir);
  const unzipResult = spawnSync('unzip', ['-o', zipPath, '-d', destDir], { stdio: 'pipe', encoding: 'utf8' });
  if (unzipResult.status === 0) { console.log('Extracted with unzip.'); return; }

  console.log('unzip not found, trying PowerShell...');
  const ps = `Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${destDir.replace(/'/g, "''")}' -Force`;
  const psResult = spawnSync('powershell', ['-NoProfile', '-Command', ps], { stdio: 'pipe', encoding: 'utf8' });
  if (psResult.status === 0) { console.log('Extracted with PowerShell.'); return; }

  throw new Error('Cannot extract zip.\nunzip: ' + (unzipResult.stderr || '') + '\nPS: ' + (psResult.stderr || ''));
}

async function main() {
  ensureDir(TMP_DIR);
  ensureDir(OUT_DIR);

  // ── 1. Obtain zip ────────────────────────────────────────────────────────────
  if (fs.existsSync(LOCAL_ZIP)) {
    console.log('Found local scripts/names.zip — using it (skipping download).');
    fs.copyFileSync(LOCAL_ZIP, ZIP_PATH);
  } else {
    console.log('Downloading names.zip from SSA...');
    try {
      await download(ZIP_URL, ZIP_PATH);
      const sizeMB = (fs.statSync(ZIP_PATH).size / 1e6).toFixed(1);
      console.log(`Download complete (${sizeMB} MB).`);
    } catch (err) {
      const isHttp = err.message.startsWith('HTTP_');
      console.error('\n❌  Download failed:', err.message);
      if (isHttp) {
        console.error('\n───────────────────────────────────────────────────────');
        console.error('SSA is blocking automated downloads from this network.');
        console.error('\nManual fix (takes 30 seconds):');
        console.error('  1. Open this URL in your browser:');
        console.error('     https://www.ssa.gov/oact/babynames/names.zip');
        console.error('  2. Save the file as:  scripts/names.zip');
        console.error('  3. Re-run:  node scripts/process-names.js');
        console.error('───────────────────────────────────────────────────────\n');
      }
      process.exit(1);
    }
  }

  // ── 2. Extract ───────────────────────────────────────────────────────────────
  console.log('Extracting...');
  extractZip(ZIP_PATH, EXTR_DIR);

  // ── 3. Process txt files ─────────────────────────────────────────────────────
  const files = fs.readdirSync(EXTR_DIR).filter(f => /^yob\d{4}\.txt$/i.test(f));
  console.log(`Found ${files.length} year files. Processing...`);

  const result = Object.create(null);

  for (const file of files) {
    const yearMatch = file.match(/yob(\d{4})\.txt/i);
    if (!yearMatch) continue;
    const year = yearMatch[1];

    const lines = fs.readFileSync(path.join(EXTR_DIR, file), 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parts = trimmed.split(',');
      if (parts.length < 3) continue;
      const name   = parts[0];
      const gender = parts[1];
      const count  = parseInt(parts[2], 10);
      if (!name || !gender || isNaN(count)) continue;

      if (!result[name])         result[name]         = Object.create(null);
      if (!result[name][gender]) result[name][gender] = Object.create(null);
      result[name][gender][year] = count;
    }
  }

  // ── 4. Filter ────────────────────────────────────────────────────────────────
  console.log('Filtering names...');
  const filtered = Object.create(null);
  let kept = 0;

  for (const name of Object.keys(result)) {
    let nameTotal = 0;
    for (const genderData of Object.values(result[name])) {
      for (const count of Object.values(genderData)) nameTotal += count;
    }
    if (nameTotal >= MIN_TOTAL) { filtered[name] = result[name]; kept++; }
  }

  console.log(`Retained ${kept} names (>= ${MIN_TOTAL} total occurrences).`);

  // ── 5. Write ─────────────────────────────────────────────────────────────────
  console.log(`Writing ${OUT_PATH} ...`);
  fs.writeFileSync(OUT_PATH, JSON.stringify(filtered));
  const outMB = (fs.statSync(OUT_PATH).size / 1e6).toFixed(1);
  console.log(`Done! names.json created — ${outMB} MB`);

  // ── 6. Sanity check ──────────────────────────────────────────────────────────
  const sample = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
  if (!sample['Emma']) {
    console.warn('⚠️  WARNING: "Emma" not found in output — check data integrity.');
  } else {
    const emmaYears = Object.keys(sample['Emma']['F'] || {}).length;
    console.log(`✅  Sanity check OK — "Emma" has ${emmaYears} years of female data.`);
  }

  // ── 7. Cleanup ───────────────────────────────────────────────────────────────
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
  console.log('Temp files cleaned up. All done!');
}

main().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
