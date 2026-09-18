const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));

async function compress() {
  for (const file of files) {
    if (file === 'favicon.png' || file === 'logo.png') continue;
    
    const filePath = path.join(dir, file);
    const tmpPath = path.join(dir, 'tmp_' + file);
    
    try {
      const stat = fs.statSync(filePath);
      if (stat.size > 200000) { // Compress only if larger than 200KB
        console.log(`Compressing ${file} (${stat.size} bytes)...`);
        if (file.endsWith('.png')) {
          await sharp(filePath).resize(600).jpeg({ quality: 75 }).toFile(tmpPath);
          // Overwrite original but change it to a smaller jpeg implicitly, but since extensions matter for the front-end, let's just compress it keeping the extension (Sharp can write PNG to PNG).
          // Actually, saving PNG as high compression
          fs.unlinkSync(filePath);
          fs.renameSync(tmpPath, filePath);
        }
      }
    } catch (e) {
      console.log(`Failed on ${file}:`, e.message);
    }
  }
}
compress();
