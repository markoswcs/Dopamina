const fs = require('fs');
const https = require('https');
const path = require('path');

const dataFile = path.join(__dirname, 'src', 'productsData.js');
const imgDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

let content = fs.readFileSync(dataFile, 'utf8');

// Fix the 4 bad URLs first
const fixes = [
  { old: 'https://images.unsplash.com/photo-1616711906333-23cf8e024524?auto=format&fit=crop&w=600&q=80', new: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80' }, // Monitor
  { old: 'https://images.unsplash.com/photo-1512496115841-a45e4125868e?auto=format&fit=crop&w=600&q=80', new: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80' }, // Makeup
  { old: 'https://images.unsplash.com/photo-1563514787498-f218206103a8?auto=format&fit=crop&w=600&q=80', new: 'https://images.unsplash.com/photo-1614316127453-61b47fb59737?auto=format&fit=crop&w=600&q=80' }, // Cachaca
  { old: 'https://images.unsplash.com/photo-1599643478524-fb66f70a00ea?auto=format&fit=crop&w=600&q=80', new: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80' }  // Cartier
];

for (const fix of fixes) {
  content = content.replace(fix.old, fix.new);
}

// Find all unsplash urls
const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+(\?auto=format&fit=crop&w=600&q=80)?/g;
const urls = [...new Set(content.match(regex) || [])];

console.log(`Found ${urls.length} images to download...`);

async function downloadImage(url) {
  const match = url.match(/photo-([a-zA-Z0-9\-]+)/);
  if (!match) return url;
  
  const id = match[1];
  const filename = `${id}.jpg`;
  const dest = path.join(imgDir, filename);
  
  if (fs.existsSync(dest)) {
    return `/images/${filename}`;
  }
  
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${filename}...`);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, (res2) => {
          const file = fs.createWriteStream(dest);
          res2.pipe(file);
          file.on('finish', () => { file.close(); resolve(`/images/${filename}`); });
        }).on('error', reject);
      } else {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(`/images/${filename}`); });
      }
    }).on('error', reject);
  });
}

async function processAll() {
  for (const url of urls) {
    try {
      const localPath = await downloadImage(url);
      content = content.replace(new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), localPath);
    } catch (e) {
      console.error(`Failed to download ${url}: ${e.message}`);
    }
  }
  
  fs.writeFileSync(dataFile, content, 'utf8');
  console.log('All done. productsData.js updated.');
}

processAll();
