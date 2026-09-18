const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

const placaPareSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <rect width="100" height="100" fill="#f5f5f5"/>
  <polygon points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" fill="#2c2c2c" stroke="#2c2c2c" stroke-width="4"/>
  <polygon points="31,12 69,12 88,31 88,69 69,88 31,88 12,69 12,31" fill="#d32f2f"/>
  <polygon points="33,16 67,16 84,33 84,67 67,84 33,84 16,67 16,33" fill="none" stroke="#ffffff" stroke-width="2"/>
  <text x="50" y="58" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle">PARE</text>
  <rect x="45" y="90" width="10" height="10" fill="#757575"/>
</svg>`;

const cnhBatmanSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <rect width="100" height="100" fill="#f5f5f5"/>
  <rect x="10" y="25" width="80" height="50" rx="4" fill="#4caf50" stroke="#2c2c2c" stroke-width="2"/>
  <rect x="15" y="30" width="25" height="30" fill="#ffffff" stroke="#2c2c2c" stroke-width="1"/>
  <path d="M 20 45 Q 27 35 35 45 Q 32 55 27 50 Q 22 55 20 45" fill="#2c2c2c"/>
  <rect x="45" y="35" width="35" height="4" fill="#ffffff"/>
  <rect x="45" y="45" width="25" height="4" fill="#ffffff"/>
  <rect x="45" y="55" width="30" height="4" fill="#ffffff"/>
  <text x="75" y="68" font-family="monospace" font-size="6" fill="#1b5e20" font-weight="bold">BATMAN</text>
</svg>`;

const loteLuaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <rect width="100" height="100" fill="#f5f5f5"/>
  <circle cx="50" cy="70" r="40" fill="#9e9e9e" stroke="#2c2c2c" stroke-width="2"/>
  <circle cx="30" cy="55" r="8" fill="#757575"/>
  <circle cx="65" cy="80" r="12" fill="#757575"/>
  <circle cx="75" cy="50" r="5" fill="#757575"/>
  <circle cx="40" cy="85" r="6" fill="#757575"/>
  <rect x="48" y="20" width="4" height="30" fill="#795548" stroke="#2c2c2c" stroke-width="1"/>
  <rect x="35" y="20" width="30" height="15" fill="#ffeb3b" stroke="#2c2c2c" stroke-width="1"/>
  <text x="50" y="30" font-family="Arial, sans-serif" font-size="8" fill="#2c2c2c" font-weight="bold" text-anchor="middle">VENDE</text>
  <path d="M 60 10 L 65 15 L 75 5 L 80 10 L 70 20 Z" fill="#4caf50" opacity="0.8"/>
  <circle cx="80" cy="20" r="15" fill="#03a9f4" stroke="#2c2c2c" stroke-width="1"/>
  <path d="M 75 15 Q 85 10 90 20 Q 80 25 75 15" fill="#8bc34a"/>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'placa_pare_cartoon.svg'), placaPareSvg);
fs.writeFileSync(path.join(publicDir, 'cnh_batman_cartoon.svg'), cnhBatmanSvg);
fs.writeFileSync(path.join(publicDir, 'lote_lua_cartoon.svg'), loteLuaSvg);

console.log("SVGs generated successfully in public directory.");
