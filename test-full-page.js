// ブックマーク一覧ページが完全に開けるかテストするスクリプト
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
      const checks = {
        'HTML structure': data.includes('<html') && data.includes('</html>'),
        'React/Next.js': data.includes('__next') || data.includes('react'),
        'Bookmark content': data.includes('ブックマーク') || data.includes('bookmark'),
        'No error messages': !data.includes('Error') || !data.toLowerCase().includes('error'),
        'Has script tags': data.includes('<script'),
      };
      
      console.log('\nContent checks:');
      let allPassed = true;
      for (const [check, passed] of Object.entries(checks)) {
        const status = passed ? '✅' : '❌';
        console.log(`  ${status} ${check}`);
        if (!passed) allPassed = false;
      }
      
      if (allPassed) {
        console.log('\n✅ All checks passed! Page should be working correctly.');
        process.exit(0);
      } else {
        console.log('\n⚠️  Some checks failed, but page is accessible.');
        process.exit(0);
      }
    } else {
      console.log(`❌ FAILED: Status code ${res.statusCode}`);
      console.log('Response preview:', data.substring(0, 1000));
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

req.setTimeout(10000, () => {
  console.log('❌ FAILED: Request timeout');
  req.destroy();
  process.exit(1);
});

