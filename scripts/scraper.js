const https = require('https');

function getImages(query) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/img.*?src="(\/\/external-content[^"]+)"/);
      if (match) {
        console.log(`${query}: https:${match[1]}`);
      } else {
        console.log(`No image found for ${query}`);
      }
    });
  }).on('error', (err) => console.log('Error:', err.message));
}

getImages('cnh do batman real');
getImages('harvard diploma blank');
getImages('placa de pare brasil');
getImages('mars planet real surface');
