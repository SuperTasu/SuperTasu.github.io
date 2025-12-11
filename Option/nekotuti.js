(function() {
    // ==========================================
    // 設定
    // ==========================================
    const CONFIG = {
        USER: "SuperTasu",
        REPO: "Call-Answered-",
        PATH: "image/",
        FETCH_LIMIT: 20
    };

    const PAGES_BASE_URL = `https://${CONFIG.USER}.github.io/${CONFIG.REPO}/${CONFIG.PATH}`;
    const API_URL = `https://api.github.com/repos/${CONFIG.USER}/${CONFIG.REPO}/contents/${CONFIG.PATH}`;

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
        const countdownEl = document.getElementById('countdown-timer');
        const statusMsg = document.getElementById('nekotuti-status-message');

        if(overlay) overlay.style.display = 'flex';
        if(statusMsg) statusMsg.style.display = 'none';

        const resetTimeMs = parseInt(resetTimestamp, 10) * 1000;

        const timerInterval = setInterval(() => {
            const now = Date.now();
            const diff = resetTimeMs - now;

            if (diff <= 0) {
                clearInterval(timerInterval);
                if(countdownEl) countdownEl.innerText = "解除されました！";
                setTimeout(() => location.reload(), 2000);
                return;
            }

            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if(countdownEl) countdownEl.innerText = `${String(minutes).padStart(2, '0')}分 ${String(seconds).padStart(2, '0')}秒`;
        }, 1000);
    }

    // API制限情報の更新
    function updateRateLimitDisplay(response) {
        const limitDisplay = document.getElementById('api-limit-display');
        const limit = response.headers.get('x-ratelimit-limit');
        const remaining = response.headers.get('x-ratelimit-remaining');
        const resetTime = response.headers.get('x-ratelimit-reset');

        if (limit && remaining && limitDisplay) {
            limitDisplay.innerText = `API残り: ${remaining} / ${limit}回`;
            
            if (parseInt(remaining) === 0) {
                limitDisplay.style.backgroundColor = "#d73a49"; // 赤色
            } else if (parseInt(remaining) < 10) {
                limitDisplay.style.backgroundColor = "#e36209"; // オレンジ
            } else {
                limitDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; // 通常
            }

            return { remaining: parseInt(remaining), resetTime: resetTime };
        }
        return null;
    }

    // メイン処理
    async function fetchPosts() {
        const container = document.getElementById('nekotuti-posts-container');
        const statusMsg = document.getElementById('nekotuti-status-message');

        // コンテナが存在しない場合は実行しない（エラー回避）
        if (!container) return;

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
                if(statusMsg) statusMsg.innerText = "投稿が見つかりませんでした。";
                return;
            }

            // 3. 詳細データの取得（並列処理）
            const targetFiles = jsonFiles.slice(0, CONFIG.FETCH_LIMIT);
            
            const postsData = await Promise.all(targetFiles.map(async (file) => {
                try {
                    const res = await fetch(file.download_url);
                    if(res.ok) updateRateLimitDisplay(res);
                    return res.ok ? await res.json() : null;
                } catch (e) {
                    return null;
                }
            }));

            // 4. 表示
            if(statusMsg) statusMsg.style.display = 'none';
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
            if (err.message !== "API Limit Reached" && statusMsg) {
                statusMsg.innerText = "エラーが発生しました: " + err.message;
            }
        }
    }

    // 実行開始
    fetchPosts();

})();
