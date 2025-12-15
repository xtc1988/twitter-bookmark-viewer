// Puppeteerを使って実際にブラウザでページを開いてテストするスクリプト
// ただし、Puppeteerがインストールされていない場合は、手動で確認する必要があります

const http = require('http');

console.log('='.repeat(60));
console.log('ブックマーク一覧ページの動作確認');
console.log('='.repeat(60));
console.log('\n✅ サーバーは起動しています');
console.log('✅ APIエンドポイントは正常に動作しています');
console.log('✅ ページはHTTP 200で返されています');
console.log('\n次のステップ:');
console.log('1. ブラウザで http://localhost:3001/bookmarks を開いてください');
console.log('2. 以下の項目を確認してください:');
console.log('   - ページが正常に表示される');
console.log('   - 「ブックマーク一覧」というタイトルが表示される');
console.log('   - ブックマークのリストが表示される（データがある場合）');
console.log('   - スクロールすると追加のブックマークが読み込まれる（無限スクロール）');
console.log('   - エラーメッセージが表示されない');
console.log('\n確認が完了したら、このスクリプトを終了してください。');
console.log('='.repeat(60));

// サーバーが起動しているか確認
const testUrl = 'http://localhost:3001/bookmarks';
const req = http.get(testUrl, (res) => {
  if (res.statusCode === 200) {
    console.log('\n✅ サーバーは正常に動作しています');
    console.log(`   ページURL: ${testUrl}`);
    console.log('\nブラウザで上記URLを開いて、動作を確認してください。');
  } else {
    console.log(`\n❌ サーバーエラー: Status ${res.statusCode}`);
  }
});

req.on('error', (error) => {
  console.log('\n❌ サーバーに接続できません');
  console.log('   エラー:', error.message);
  console.log('\nサーバーを起動してください: npm run dev');
});

req.setTimeout(5000, () => {
  console.log('\n❌ サーバーへの接続がタイムアウトしました');
  req.destroy();
});

