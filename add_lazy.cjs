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
    if (content.includes('<img ')) {
        const newContent = content.replace(/<img(?!\s+loading="lazy")/g, '<img loading="lazy" decoding="async"');
        if (newContent !== content) {
            fs.writeFileSync(file, newContent);
            console.log('Updated ' + file);
            updatedCount++;
        }
    }
});
console.log(`Lazy loading added to ${updatedCount} files.`);
