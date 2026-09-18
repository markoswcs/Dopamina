const sharp = require('sharp');
const fs = require('fs');

const grid = [
  "000000000000000000000000",
  "000000000000000000000000",
  "000000000000000800000000",
  "000000000000008880000000",
  "000000000000008080000000",
  "000000000000000800000000",
  "000000000000011100000000",
  "000000000000177710000000",
  "000000000001475410000000",
  "000000000012222210000000",
  "000000000122222210000000",
  "000000001262262210000000",
  "000000012222222210000000",
  "000000126226222210000000",
  "000001222222222210000000",
  "000012622622222310000000",
  "000122222222223100000000",
  "001222222222231000000000",
  "012222222222310000000000",
  "122222222233100000000000",
  "133333333331000000000000",
  "011111111110000000000000",
  "000000000000000000000000",
  "000000000000000000000000"
];

const colors = {
  "0": "transparent",
  "1": "#2c2c2c", // outline
  "2": "#ffffff", // paper white
  "3": "#e0e0e0", // paper shadow
  "4": "#ff3d00", // burning orange
  "5": "#ff9100", // burning yellow
  "6": "#9e9e9e", // text lines
  "7": "#dd2c00", // burning red
  "8": "#bdbdbd"  // smoke
};

const pixelSize = 20;
const width = grid[0].length * pixelSize;
const height = grid.length * pixelSize;

let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
svg += `<rect width="${width}" height="${height}" fill="#f5f5f5" />`; // Clean background like others

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    const colorCode = grid[y][x];
    if (colorCode !== "0") {
      svg += `<rect x="${x * pixelSize}" y="${y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${colors[colorCode]}" />`;
    }
  }
}
svg += `</svg>`;

sharp(Buffer.from(svg))
  .png()
  .toFile('public/baseado_roteiro_cartoon.png')
  .then(() => console.log('Successfully generated baseado_roteiro_cartoon.png'))
  .catch(err => console.error(err));
