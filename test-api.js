// APIエンドポイントが正しく動作するかテストするスクリプト
const http = require('http');

const testUrl = 'http://localhost:3001/api/bookmarks?page=1&pageSize=20';

console.log('Testing API endpoint...');
console.log(`URL: ${testUrl}`);

const req = http.get(testUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ SUCCESS: API is working!');
      console.log(`Status Code: ${res.statusCode}`);
      
      try {
        const json = JSON.parse(data);
        console.log(`Bookmarks count: ${json.bookmarks?.length || 0}`);
        console.log(`Total: ${json.total || 0}`);
        console.log(`Has more: ${json.hasMore || false}`);
        console.log('✅ API response is valid JSON');
      } catch (e) {
        console.log('⚠️  Warning: Response is not valid JSON');
        console.log('Response:', data.substring(0, 500));
      }
      
      process.exit(0);
    } else {
      console.log(`❌ FAILED: Status code ${res.statusCode}`);
      console.log('Response:', data.substring(0, 500));
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ FAILED: Could not connect to server');
  console.log('Error:', error.message);
  console.log('\nMake sure the dev server is running: npm run dev');
  process.exit(1);
});

req.setTimeout(5000, () => {
  console.log('❌ FAILED: Request timeout');
  req.destroy();
  process.exit(1);
});

