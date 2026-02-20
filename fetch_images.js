import https from 'https';

https.get('https://particlepeptides.com/en/content/48-peptide-calculator', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    while ((match = imgRegex.exec(data)) !== null) {
      console.log(match[1]);
    }
  });
});
