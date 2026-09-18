const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('D:/CODES/dopamina/src');
let updatedCount = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const newContent = content.replace(/(\/[\w_-]+)\.(png|jpg|jpeg)(["'])/gi, '$1.webp$3');
    if (newContent !== content) {
        fs.writeFileSync(file, newContent);
        console.log('Updated extensions in ' + file);
        updatedCount++;
    }
});
console.log(`Extensions updated in ${updatedCount} files.`);
