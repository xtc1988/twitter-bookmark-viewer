// ブックマーク一覧ページの詳細を確認するスクリプト
const http = require('http');

const testUrl = 'http://localhost:3001/bookmarks';

console.log('Testing bookmark page in detail...');
console.log(`URL: ${testUrl}\n`);

const req = http.get(testUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Content Length: ${data.length} bytes\n`);
    
    // エラーメッセージを探す
    const errorPatterns = [
      /Error/i,
      /error/i,
      /失敗/i,
      /Failed/i,
      /Exception/i,
      /undefined/i,
      /null/i,
    ];
    
    console.log('Checking for errors...');
    let foundErrors = [];
    for (const pattern of errorPatterns) {
      const matches = data.match(pattern);
      if (matches) {
        // エラーの前後のコンテキストを取得
        const index = data.indexOf(matches[0]);
        const context = data.substring(Math.max(0, index - 100), Math.min(data.length, index + 200));
        foundErrors.push({ pattern: pattern.toString(), context: context.substring(0, 300) });
      }
    }
    
    if (foundErrors.length > 0) {
      console.log(`⚠️  Found ${foundErrors.length} potential error patterns:`);
      foundErrors.forEach((err, i) => {
        console.log(`\n${i + 1}. Pattern: ${err.pattern}`);
        console.log(`   Context: ${err.context.replace(/\n/g, ' ').substring(0, 200)}...`);
      });
    } else {
      console.log('✅ No obvious error patterns found');
    }
    
    // 重要な要素が含まれているか確認
    console.log('\nChecking for important elements...');
    const importantElements = {
      'ブックマーク一覧': data.includes('ブックマーク一覧'),
      'DashboardLayout': data.includes('DashboardLayout') || data.includes('dashboard'),
      'API call': data.includes('/api/bookmarks') || data.includes('api/bookmarks'),
      'React hydration': data.includes('__next') || data.includes('react'),
    };
    
    for (const [element, found] of Object.entries(importantElements)) {
      console.log(`  ${found ? '✅' : '❌'} ${element}`);
    }
    
    // HTMLの構造を確認
    console.log('\nHTML structure check:');
    console.log(`  Has <html>: ${data.includes('<html')}`);
    console.log(`  Has <head>: ${data.includes('<head')}`);
    console.log(`  Has <body>: ${data.includes('<body')}`);
    console.log(`  Has <script>: ${data.includes('<script')}`);
    
    if (res.statusCode === 200 && data.includes('<html') && data.includes('ブックマーク')) {
      console.log('\n✅ Page appears to be working correctly!');
      console.log('You can now open http://localhost:3001/bookmarks in your browser.');
      process.exit(0);
    } else {
      console.log('\n❌ Page may have issues. Check the details above.');
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ FAILED: Could not connect to server');
  console.log('Error:', error.message);
  process.exit(1);
});

req.setTimeout(10000, () => {
  console.log('❌ FAILED: Request timeout');
  req.destroy();
  process.exit(1);
});

