const https = require('https');

function getWikimediaImage(query) {
    return new Promise((resolve) => {
        const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=3&iiprop=url`;
        https.get(url, { headers: { 'User-Agent': 'NodeBot/1.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    const pages = parsed.query.pages;
                    const urls = Object.values(pages).map(p => p.imageinfo[0].url);
                    resolve(urls);
                } catch (e) {
                    resolve(["Not found"]);
                }
            });
        }).on('error', () => resolve(["Error"]));
    });
}

async function run() {
    console.log("Air Fryer:", await getWikimediaImage("Air fryer appliance"));
    console.log("Xbox Series S:", await getWikimediaImage("Xbox Series S console isolated"));
    console.log("SSD NVMe:", await getWikimediaImage("M.2 NVMe SSD"));
}

run();
