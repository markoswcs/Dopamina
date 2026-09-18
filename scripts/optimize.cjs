const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir);

async function optimizeImages() {
  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.png')) {
      const filePath = path.join(publicDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.size > 100 * 1024) { // Larger than 100KB
        console.log(`Optimizing ${file} (${Math.round(stat.size/1024)}KB)...`);
        const tempPath = filePath + '.tmp';
        
        try {
          if (file.endsWith('.jpg')) {
            await sharp(filePath)
              .resize(500)
              .jpeg({ quality: 70, progressive: true })
              .toFile(tempPath);
          } else if (file.endsWith('.png')) {
            await sharp(filePath)
              .resize(500)
              .png({ quality: 70, compressionLevel: 8 })
              .toFile(tempPath);
          }
          
          fs.renameSync(tempPath, filePath);
          console.log(`Optimized ${file} successfully.`);
        } catch (e) {
          console.error(`Error optimizing ${file}:`, e.message);
        }
      }
    }
  }
}

optimizeImages().then(() => console.log('Done!'));
