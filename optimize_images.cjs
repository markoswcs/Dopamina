const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const MAX_WIDTH = 600;
const QUALITY = 75;
const QR_QUALITY = 90;

const dirsToScan = [
  path.join(__dirname, 'public'),
  path.join(__dirname, 'public', 'images')
];

let totalSaved = 0;
let totalOriginal = 0;
let totalNew = 0;
let processed = 0;
let skipped = 0;
let errors = 0;

async function optimizeAll() {
  console.log('🖼️  DopaShop Image Optimizer');
  console.log('━'.repeat(60));
  console.log(`Config: max ${MAX_WIDTH}px width, WebP q${QUALITY}\n`);

  for (const dir of dirsToScan) {
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.png', '.jpg', '.jpeg'].includes(ext);
    });

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      const ext = path.extname(file).toLowerCase();
      const baseName = path.basename(file, ext);
      const webpPath = path.join(dir, baseName + '.webp');

      // Skip SVGs and existing webp
      if (file === 'favicon.svg' || file === 'icons.svg') { skipped++; continue; }

      // Skip corrupted/empty files
      if (stat.size <= 100) {
        console.log(`  ⚠️  SKIP (corrupted): ${file} (${stat.size} bytes)`);
        skipped++;
        continue;
      }

      // Skip if webp already exists
      if (fs.existsSync(webpPath)) {
        console.log(`  ⏭️  SKIP (webp exists): ${file}`);
        // Delete the original since webp exists
        fs.unlinkSync(filePath);
        skipped++;
        continue;
      }

      try {
        const isQR = file.toLowerCase().includes('qr') || file.toLowerCase().includes('pix');
        const quality = isQR ? QR_QUALITY : QUALITY;

        const metadata = await sharp(filePath).metadata();
        let pipeline = sharp(filePath);

        // Resize if wider than max
        if (metadata.width && metadata.width > MAX_WIDTH) {
          pipeline = pipeline.resize(MAX_WIDTH);
        }

        await pipeline.webp({ quality }).toFile(webpPath);

        const newStat = fs.statSync(webpPath);
        const saved = stat.size - newStat.size;
        const pct = ((saved / stat.size) * 100).toFixed(1);

        totalOriginal += stat.size;
        totalNew += newStat.size;
        totalSaved += saved;
        processed++;

        const origKB = (stat.size / 1024).toFixed(0);
        const newKB = (newStat.size / 1024).toFixed(0);
        const emoji = saved > 0 ? '✅' : '⚡';

        console.log(`  ${emoji} ${file} → ${baseName}.webp | ${origKB}KB → ${newKB}KB (${pct}% saved)`);

        // Remove original
        fs.unlinkSync(filePath);
      } catch (e) {
        console.log(`  ❌ FAILED: ${file} — ${e.message}`);
        errors++;
      }
    }
  }

  console.log('\n' + '━'.repeat(60));
  console.log('📊 Summary:');
  console.log(`   Processed: ${processed} files`);
  console.log(`   Skipped:   ${skipped} files`);
  console.log(`   Errors:    ${errors} files`);
  console.log(`   Original:  ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   New:       ${(totalNew / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Saved:     ${(totalSaved / 1024 / 1024).toFixed(2)} MB (${totalOriginal > 0 ? ((totalSaved / totalOriginal) * 100).toFixed(1) : 0}%)`);
  console.log('━'.repeat(60));
}

optimizeAll().catch(console.error);
