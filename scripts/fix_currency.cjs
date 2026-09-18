const fs = require('fs');
const path = require('path');

const files = [
  'src/App.jsx',
  'src/components/DiscountRoulette.jsx',
  'src/components/ItemUpgrade.jsx',
  'src/components/Inventory.jsx',
  'src/components/DailyCaseModal.jsx',
  'src/components/CheckoutModal.jsx',
  'src/components/DopaBank.jsx',
  'src/components/CrashGame.jsx',
  'src/components/PixDepositModal.jsx',
];

let totalFiles = 0;

files.forEach(filePath => {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) { console.log('Not found:', filePath); return; }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;
  
  // Simples substituição de R$ por D$ em todas as formas
  content = content.split('R$').join('D$');
  
  if (content !== original) {
    fs.writeFileSync(fullPath, content);
    const count = original.split('R$').length - 1;
    console.log('Updated:', filePath, '(' + count + ' replacements)');
    totalFiles++;
  } else {
    console.log('No changes:', filePath);
  }
});

console.log('Total files updated:', totalFiles);
