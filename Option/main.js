/**
 * Option/main.js
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
                    <input type="text" id="bg-url-input" placeholder="https://example.com/image.jpg" style="flex-grow:1; padding:8px; border-radius:8px; border:1px solid #ccc;">
                    <button onclick="handleBgUrl()" style="padding:8px 15px; border-radius:8px; border:none; background:#667eea; color:#fff; cursor:pointer;">適用</button>
                </div>
            </div>
            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px; font-weight:bold;">2. ファイルから設定</label>
                <input type="file" id="bg-file-input" accept="image/*" onchange="handleBgFile(this)" style="padding:5px;">
            </div>
            <div style="text-align:right;">
                <button onclick="resetBackground()" style="padding:5px 10px; border-radius:5px; border:1px solid #999; background:#eee; color:#333; cursor:pointer; font-size:12px;">背景をリセット</button>
            </div>
        </div>

        <div class="option-card">
            <h4><i class="fas fa-palette"></i> テキスト色設定</h4>
            <div style="display:flex; align-items:center; gap:10px;">
                <label for="text-color-picker">メイン文字色:</label>
                <input type="color" id="text-color-picker" onchange="saveTextColor(this.value)">
                <button onclick="resetTextColor()" style="padding:5px 10px; border-radius:5px; border:1px solid #999; background:#eee; color:#333; cursor:pointer; font-size:12px;">リセット</button>
            </div>
        </div>

        <div class="option-card">
            <h4><i class="fas fa-bus"></i> 鷹取団地前 バス掲示板</h4>
            <div id="option-takatori-container"></div>
        </div>

        <div class="option-card">
            <h4><i class="fas fa-info-circle"></i> アプリ情報</h4>
            <p><strong>Link First</strong></p>
            <p>Version: 1.1.2</p>
        </div>
    `;

    const takatoriContainer = document.getElementById('option-takatori-container');
    if(typeof renderTakatoriBoard === 'function') {
        renderTakatoriBoard(takatoriContainer);
    }
}

function handleBgUrl() {
    const url = document.getElementById('bg-url-input').value;
    if (url) saveBackground(url);
}
function handleBgFile(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try { saveBackground(e.target.result); } catch(e) { alert('画像サイズが大きすぎて保存できませんでした。'); }
        };
        reader.readAsDataURL(input.files[0]);
    }
}
