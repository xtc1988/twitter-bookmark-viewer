// ブックマーク一覧ページが開けるかテストするスクリプト
const http = require('http');

const testUrl = 'http://localhost:3001/bookmarks';

console.log('Testing bookmark page...');
console.log(`URL: ${testUrl}`);

const req = http.get(testUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ SUCCESS: Page is accessible!');
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Content Length: ${data.length} bytes`);
      
      // 基本的なHTML要素が含まれているか確認
      if (data.includes('ブックマーク一覧') || data.includes('bookmarks')) {
        console.log('✅ Page content looks correct');
      }
      
      // エラーがないか確認
      if (data.includes('Error') && data.includes('error')) {
        console.log('⚠️  Warning: Error detected in page content');
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

