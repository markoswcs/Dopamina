const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');

function getFiles(dir) {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    const files = dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    });
    return Array.prototype.concat(...files).filter(f => f.endsWith('.jsx'));
}

const files = getFiles(componentsDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let original = content;

    // Remove basic shadows
    content = content.replace(/\bshadow-(sm|md|lg|xl|2xl|inner|none)\b/g, '');
    
    // Remove arbitrary shadows like shadow-[0_10px_...]
    content = content.replace(/\bshadow-\[[^\]]+\]\b/g, '');
    
    // Remove basic drop-shadows
    content = content.replace(/\bdrop-shadow-(sm|md|lg|xl|2xl|none)\b/g, '');
    
    // Remove arbitrary drop-shadows
    content = content.replace(/\bdrop-shadow-\[[^\]]+\]\b/g, '');

    // Remove any group-hover:shadow or hover:shadow prefixed variants
    content = content.replace(/\b(hover|group-hover|dark:hover|dark:group-hover):shadow-[a-zA-Z0-9_\[\]\.\-\,\(\)\%]+\b/g, '');

    if (content !== original) {
        // Fix multiple spaces that might have been left
        content = content.replace(/ {2,}/g, ' ').replace(/ "/g, '"').replace(/" /g, '"').replace(/ `/g, '`').replace(/` /g, '`');
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Cleaned shadows in: ${path.basename(file)}`);
    }
});
