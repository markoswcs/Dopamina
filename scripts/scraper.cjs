const https = require('https');

function getImages(query) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      // Find the first image that is not an .ico
      const regex = /img.*?src="(\/\/external-content[^"]+)"/g;
      let match;
      let found = false;
      while ((match = regex.exec(data)) !== null) {
        if (!match[1].endsWith('.ico')) {
           console.log(`${query}: https:${match[1]}`);
           found = true;
           break;
        }
      }
      if (!found) {
        console.log(`No image found for ${query}`);
      }
    });
  }).on('error', (err) => console.log('Error:', err.message));
}

getImages('samsung odyssey g9 monitor display');
getImages('mac cosmetics makeup kit flatlay');
getImages('cachaca artesanal barril de carvalho');
getImages('cartier juste un clou bracelet with diamonds');
