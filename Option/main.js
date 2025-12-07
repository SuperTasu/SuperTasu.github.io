/**
 * Option/main.js
 * Optionタブのコンテンツ生成・管理
 */

function initOptionTabContent() {
    const container = document.getElementById('option-container');
    if (!container) return;

    container.innerHTML = `
        <h3 class="section-title">設定 (Option)</h3>
        
        <div class="option-card">
            <h4><i class="fas fa-image"></i> 背景設定</h4>
            <p style="margin-bottom:10px;">お好きな画像を背景に設定できます。</p>
            
            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px; font-weight:bold;">1. URLから設定</label>
                <div style="display:flex; gap:5px;">
                    <input type="text" id="bg-url-input" placeholder="https://example.com/image.jpg" 
                        style="flex-grow:1; padding:8px; border-radius:8px; border:1px solid #ccc;">
                    <button onclick="handleBgUrl()" 
                        style="padding:8px 15px; border-radius:8px; border:none; background:#667eea; color:#fff; cursor:pointer;">
                        適用
                    </button>
                </div>
            </div>

            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px; font-weight:bold;">2. ファイルから設定</label>
                <input type="file" id="bg-file-input" accept="image/*" onchange="handleBgFile(this)"
                    style="padding:5px;">
            </div>

            <div style="text-align:right;">
                <button onclick="resetBackground()" 
                    style="padding:5px 10px; border-radius:5px; border:1px solid #999; background:#eee; color:#333; cursor:pointer; font-size:12px;">
                    背景をリセット
                </button>
            </div>
        </div>

        <div class="option-card">
            <h4><i class="fas fa-info-circle"></i> アプリ情報</h4>
            <p><strong>Link First</strong></p>
            <p>Version: 1.0.5</p>
        </div>

        <div class="option-card">
            <h4><i class="fas fa-tools"></i> テーマ設定</h4>
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

// URL入力の処理
function handleBgUrl() {
    const url = document.getElementById('bg-url-input').value;
    if (url) {
        saveBackground(url);
    }
}

// ファイル選択の処理
function handleBgFile(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Data URLとして保存 (※容量制限に注意)
            try {
                saveBackground(e.target.result);
            } catch(e) {
                alert('画像サイズが大きすぎて保存できませんでした。');
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// お気に入り削除
function clearFavorites() {
    if(confirm('すべてのお気に入りを削除しますか？')) {
        localStorage.removeItem('myLinkAppFavorites');
        if (typeof favorites !== 'undefined') {
            favorites.length = 0; 
            if(typeof renderGrid === 'function') renderGrid(initialAppData);
            if(typeof renderFavoritesPage === 'function') renderFavoritesPage();
            if(typeof initBustarain === 'function') initBustarain();
        }
        alert('削除しました');
    }
}
