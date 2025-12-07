/**
 * Option/main.js
 * Optionタブのコンテンツを生成・管理するスクリプト
 */

function initOptionTabContent() {
    const container = document.getElementById('option-container');
    if (!container) return;

    // HTMLコンテンツの生成
    container.innerHTML = `
        <h3 class="section-title">設定 (Option)</h3>
        
        <div class="option-card">
            <h4><i class="fas fa-info-circle"></i> アプリ情報</h4>
            <p><strong>Link First</strong></p>
            <p>Version: 1.0.4</p>
            <p style="font-size: 0.9em; color: #888;">Loaded from Option/main.js</p>
        </div>

        <div class="option-card">
            <h4><i class="fas fa-tools"></i> テーマ設定</h4>
            <p>現在のテーマを手動で切り替えます（ヘッダーのボタンと同じ機能です）。</p>
            <div style="margin-top:10px; display:flex; gap:10px;">
                <button onclick="setTheme('light')" style="padding:8px 16px; border-radius:8px; border:1px solid #ccc; background:#fff; cursor:pointer;">Light</button>
                <button onclick="setTheme('dark')" style="padding:8px 16px; border-radius:8px; border:1px solid #555; background:#333; color:#fff; cursor:pointer;">Dark</button>
            </div>
        </div>
        
        <div class="option-card">
            <h4><i class="fas fa-database"></i> データ管理</h4>
            <button onclick="clearFavorites()" style="padding:8px 16px; border-radius:8px; border:1px solid #f88; background:#fff0f0; color:#d00; cursor:pointer;">お気に入りを全削除</button>
        </div>
    `;
}

// お気に入り全削除機能（Option専用機能の例）
function clearFavorites() {
    if(confirm('すべてのお気に入りを削除しますか？')) {
        localStorage.removeItem('myLinkAppFavorites');
        // グローバル変数をリセット（script.jsで定義されているfavoritesを参照）
        // ※ 別ファイルのため、script.jsでfavoritesがグローバルスコープならアクセス可
        if (typeof favorites !== 'undefined') {
            favorites.length = 0; // 配列の中身を空にする
            // 再描画関数を呼び出す
            if(typeof renderGrid === 'function') renderGrid(initialAppData);
            if(typeof renderFavoritesPage === 'function') renderFavoritesPage();
            if(typeof initBustarain === 'function') initBustarain();
        }
        alert('削除しました');
    }
}
