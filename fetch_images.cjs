const fs = require('fs');
const https = require('https');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

const imagesToFetch = [
  {
    name: 'baseado_roteiro_cartoon.jpg',
    prompt: '2D cartoon style illustration of a rolled up movie script paper that looks like a lit smoking joint, glowing red tip, flat design, pixel art aesthetic, isolated on a clean white background, parody style'
  }
];

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filename);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Downloaded ${filename}`);
          resolve();
        });
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        // Handle redirect
        downloadImage(res.headers.location, filename).then(resolve).catch(reject);
      } else {
        reject(new Error(`Failed to download, status code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function fetchAll() {
  for (const img of imagesToFetch) {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(img.prompt)}?width=512&height=512&nologo=true`;
    const filePath = path.join(publicDir, img.name);
    try {
      await downloadImage(url, filePath);
    } catch (err) {
      console.error(`Error downloading ${img.name}:`, err);
    }
  }
}

fetchAll().then(() => console.log('All images fetched.'));
