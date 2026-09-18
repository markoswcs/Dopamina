const fs = require('fs');
let data = fs.readFileSync('src/data/cs2Items.js', 'utf8');
data = data.replace(/"price":\s*([\d.]+)/g, (match, p1) => {
  return '"price": ' + (parseFloat(p1) * 5.5).toFixed(2);
});
fs.writeFileSync('src/data/cs2Items.js', data);
console.log('Prices updated successfully.');
