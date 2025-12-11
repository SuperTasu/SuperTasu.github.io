(function() {
    // ==========================================
    // 設定
    // ==========================================
    const CONFIG = {
        USER: "SuperTasu",
        REPO: "Call-Answered-",
        PATH: "image/",
        FETCH_LIMIT: 20 // 1回に取得する詳細データの最大数
    };

    const PAGES_BASE_URL = `https://${CONFIG.USER}.github.io/${CONFIG.REPO}/${CONFIG.PATH}`;
    const API_URL = `https://api.github.com/repos/${CONFIG.USER}/${CONFIG.REPO}/contents/${CONFIG.PATH}`;

    // ==========================================
    // CSS (スタイル定義)
    // ==========================================
    const cssStyles = `
        body { font-family: "Helvetica Neue", Arial, sans-serif; background-color: #f4f6f8; color: #333; margin: 0; padding: 20px; position: relative; min-height: 100vh; }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { text-align: center; color: #24292e; margin-top: 10px; font-size: 24px; }
        
        /* GitHubボタン */
        .github-btn { position: absolute; top: 20px; right: 20px; background-color: #24292e; color: white; text-decoration: none; padding: 10px 15px; border-radius: 6px; font-size: 14px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: background-color 0.2s; z-index: 100; }
        .github-btn:hover { background-color: #444d56; }
        
        /* API制限表示 */
        .api-limit-display { position: fixed; bottom: 20px; right: 20px; background: rgba(0, 0, 0, 0.8); color: #fff; padding: 10px 15px; border-radius: 20px; font-size: 13px; font-family: monospace; z-index: 999; box-shadow: 0 2px 5px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.2); }
        
        /* タイマーオーバーレイ */
        #limit-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.95); z-index: 1000; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
        .timer-box { background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #ddd; }
        .timer-count { font-size: 48px; font-weight: bold; color: #d73a49; margin: 20px 0; font-family: monospace; }
        
        /* カードスタイル */
        .post-card { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .post-header { border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 5px; }
        .post-id { font-weight: bold; color: #0366d6; font-family: monospace; font-size: 14px; }
        .post-date { font-size: 0.85em; color: #666; }
        .post-message { font-size: 16px; line-height: 1.6; margin-bottom: 15px; white-space: pre-wrap; word-wrap: break-word; }
        
        /* 画像グリッド */
        .image-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
        .post-image { width: 100%; height: 150px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; cursor: pointer; transition: opacity 0.2s; background-color: #eee; }
        .post-image:hover { opacity: 0.8; }
        
        #status-message { text-align: center; margin-top: 50px; font-weight: bold; color: #666; }

        @media (max-width: 600px) {
            .github-btn { position: static; display: block; width: fit-content; margin: 0 auto 15px auto; }
            .api-limit-display { bottom: 10px; right: 10px; font-size: 11px; }
            .timer-count { font-size: 32px; }
        }
    `;

    // ==========================================
    // HTML構造の生成と注入
    // ==========================================
    function injectUI() {
        // タイトル設定
        document.title = "投稿一覧（API制限タイマー付き）";

        // スタイル注入
        const styleTag = document.createElement('style');
        styleTag.textContent = cssStyles;
        document.head.appendChild(styleTag);

        // HTML本体注入
        document.body.innerHTML = `
            <!-- GitHubボタン -->
            <a href="https://github.com/${CONFIG.USER}/${CONFIG.REPO}/tree/main/${CONFIG.PATH}" target="_blank" class="github-btn">
                GitHub画像フォルダを見る
            </a>

            <!-- API残り回数表示 -->
            <div id="api-limit-display" class="api-limit-display">API接続待機中...</div>

            <!-- 制限時のオーバーレイ -->
            <div id="limit-overlay">
                <div class="timer-box">
                    <h2>⚠️ API制限がかかりました</h2>
                    <p>GitHub APIの利用上限に達しました。<br>以下の時間が経過すると自動的に解除されます。</p>
                    <div id="countdown" class="timer-count">00:00:00</div>
                    <p><small>※この画面を開いたままお待ちいただくか、時間をおいてリロードしてください。</small></p>
                </div>
            </div>

            <div class="container">
                <h1>受信ボックス</h1>
                <div id="status-message">データを読み込んでいます...</div>
                <div id="posts-container"></div>
            </div>
        `;
    }

    // ==========================================
    // ロジック関数
    // ==========================================
    
    // HTMLエスケープ処理
    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[m]);
    }

    // 投稿カードのHTML生成
    function createPostCard(data) {
        const dateStr = data.date ? new Date(data.date).toLocaleString('ja-JP') : '日付不明';
        const safeMessage = escapeHtml(data.message || '（メッセージなし）');
        let imagesHtml = '';

        if (data.uploadedFiles && Array.isArray(data.uploadedFiles) && data.uploadedFiles.length > 0) {
            imagesHtml = `<div class="image-grid">`;
            data.uploadedFiles.forEach(fileName => {
                const imageUrl = PAGES_BASE_URL + fileName;
                imagesHtml += `
                    <a href="${imageUrl}" target="_blank">
                        <img src="${imageUrl}" class="post-image" loading="lazy" alt="post image">
                    </a>`;
            });
            imagesHtml += `</div>`;
        }

        return `
            <div class="post-card">
                <div class="post-header">
                    <span class="post-id">ID: ${escapeHtml(data.id)}</span>
                    <span class="post-date">${dateStr}</span>
                </div>
                <div class="post-message">${safeMessage}</div>
                ${imagesHtml}
            </div>
        `;
    }

    // カウントダウンタイマー
    function startCountdown(resetTimestamp) {
        const overlay = document.getElementById('limit-overlay');
        const countdownEl = document.getElementById('countdown');
        const statusMsg = document.getElementById('status-message');

        overlay.style.display = 'flex';
        statusMsg.style.display = 'none';

        const resetTimeMs = parseInt(resetTimestamp, 10) * 1000;

        const timerInterval = setInterval(() => {
            const now = Date.now();
            const diff = resetTimeMs - now;

            if (diff <= 0) {
                clearInterval(timerInterval);
                countdownEl.innerText = "解除されました！";
                setTimeout(() => location.reload(), 2000);
                return;
            }

            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            countdownEl.innerText = `${String(minutes).padStart(2, '0')}分 ${String(seconds).padStart(2, '0')}秒`;
        }, 1000);
    }

    // API制限情報の更新
    function updateRateLimitDisplay(response) {
        const limitDisplay = document.getElementById('api-limit-display');
        const limit = response.headers.get('x-ratelimit-limit');
        const remaining = response.headers.get('x-ratelimit-remaining');
        const resetTime = response.headers.get('x-ratelimit-reset');

        if (limit && remaining) {
            // 表示を更新
            limitDisplay.innerText = `API残り: ${remaining} / ${limit}回`;
            
            if (parseInt(remaining) === 0) {
                limitDisplay.style.backgroundColor = "#d73a49"; // 赤色
            } else if (parseInt(remaining) < 10) {
                limitDisplay.style.backgroundColor = "#e36209"; // オレンジ
            }

            return { remaining: parseInt(remaining), resetTime: resetTime };
        }
        return null;
    }

    // メイン処理
    async function fetchPosts() {
        const container = document.getElementById('posts-container');
        const statusMsg = document.getElementById('status-message');

        try {
            // 1. ファイル一覧を取得
            const response = await fetch(API_URL);
            
            // API制限チェック
            const rateInfo = updateRateLimitDisplay(response);

            if (response.status === 403 && rateInfo && rateInfo.remaining === 0) {
                startCountdown(rateInfo.resetTime);
                throw new Error("API Limit Reached");
            }

            if (!response.ok) {
                throw new Error(`データ取得エラー: ${response.status}`);
            }

            const files = await response.json();

            // 2. _message.jsonのみフィルタリング
            const jsonFiles = files
                .filter(file => file.name.endsWith('_message.json'))
                .sort((a, b) => b.name.localeCompare(a.name));

            if (jsonFiles.length === 0) {
                statusMsg.innerText = "投稿が見つかりませんでした。";
                return;
            }

            // 3. 詳細データの取得（並列処理）
            const targetFiles = jsonFiles.slice(0, CONFIG.FETCH_LIMIT);
            
            const postsData = await Promise.all(targetFiles.map(async (file) => {
                try {
                    const res = await fetch(file.download_url);
                    // 詳細取得時のヘッダーでAPI制限表示を更新（最新の状態にする）
                    if(res.ok) updateRateLimitDisplay(res);
                    return res.ok ? await res.json() : null;
                } catch (e) {
                    return null;
                }
            }));

            // 4. 表示
            statusMsg.style.display = 'none';
            postsData.forEach(data => {
                if (data) {
                    container.insertAdjacentHTML('beforeend', createPostCard(data));
                }
            });

            if (jsonFiles.length > CONFIG.FETCH_LIMIT) {
                const moreMsg = document.createElement('div');
                Object.assign(moreMsg.style, { textAlign: 'center', color: '#888', margin: '20px 0' });
                moreMsg.innerText = `※最新の${CONFIG.FETCH_LIMIT}件を表示しています`;
                container.appendChild(moreMsg);
            }

        } catch (err) {
            if (err.message !== "API Limit Reached") {
                statusMsg.innerText = "エラーが発生しました: " + err.message;
            }
        }
    }

    // ==========================================
    // 実行開始
    // ==========================================
    injectUI();
    fetchPosts();

})();
