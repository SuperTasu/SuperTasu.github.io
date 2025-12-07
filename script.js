// --- DOM要素の取得 ---
const dom = {
    date: document.getElementById('date'),
    clock: document.getElementById('clock'),
    countdown: document.getElementById('countdown'),
    offlineStatus: document.getElementById('offline-status'),
    refreshBtn: document.getElementById('refresh-button'),
    speedTestRefreshBtn: document.getElementById('speed-test-refresh-button'),
    
    // タブ・コンテナ関連
    tabAllApps: document.getElementById('tab-all-apps'),
    tabBustarain: document.getElementById('tab-bustarain'),
    tabOption: document.getElementById('tab-option'),
    
    mainGrid: document.getElementById('main-grid'), // Appsタブの内容
    bustarainContainer: document.getElementById('bustarain-container'), // Bustarainタブの内容
    optionContainer: document.getElementById('option-container'), // Optionタブの内容
    
    // アプリ表示エリア
    recentlyUsedContainer: document.getElementById('recently-used-apps-container'),
    recentlyUsedGrid: document.getElementById('recentlyUsedGridContainer'),
    sectionDivider: document.getElementById('section-divider'),
    allAppsGrid: document.getElementById('gridContainer'),
    
    // 検索関連
    searchInput: document.getElementById('appSearchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    
    // サブタブ（Bustarain内）
    subTabBtns: document.querySelectorAll('.sub-tab-btn'),
    subTabContents: document.querySelectorAll('.sub-tab-content'),
    
    // アコーディオン
    accordionHeaders: document.querySelectorAll('.accordion-header'),

    // Iframe (SpeedTest)
    speedTestIframe: document.querySelector('.header-speed-test iframe')
};

// --- 設定・データ ---

// スケジュールデータ（カウントダウン用）
const schedule = [
    {name:"1限",start:"08:50",end:"09:40"},{name:"休憩",start:"09:40",end:"09:50"},
    {name:"2限",start:"09:50",end:"10:40"},{name:"休憩",start:"10:40",end:"10:50"},
    {name:"3限",start:"10:50",end:"11:40"},{name:"休憩",start:"11:40",end:"11:50"},
    {name:"4限",start:"11:50",end:"12:40"},{name:"昼休み",start:"12:40",end:"13:20"},
    {name:"5限",start:"13:20",end:"14:10"},{name:"休憩",start:"14:10",end:"14:20"},
    {name:"6限",start:"14:20",end:"15:10"},{name:"休憩",start:"15:10",end:"15:20"},
    {name:"7限",start:"15:20",end:"16:10"},{name:"休憩",start:"16:10",end:"16:40"},
    {name:"8限",start:"16:40",end:"17:30"},{name:"休憩",start:"17:30",end:"17:40"},
    {name:"9限",start:"17:40",end:"18:30"}
];

// アプリデータ
const initialAppData = [
    {id:1,label:"Google",url:"https://www.google.com",icon:"https://www.google.com/favicon.ico",searchText:"Google グーグル"},
    {id:2,label:"Gmail",url:"https://mail.google.com",icon:"https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",searchText:"Gmail Google Mail メール"},
    {id:3,label:"Calendar",url:"https://calendar.google.com",icon:"https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_3_2x.png",searchText:"Google Calendar カレンダー"},
    {id:4,label:"Photos",url:"https://photos.google.com",icon:"https://ssl.gstatic.com/images/branding/product/1x/photos_48dp.png",searchText:"Google Photos フォト 写真"},
    {id:5,label:"Drive",url:"https://drive.google.com",icon:"https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png",searchText:"Google Drive ドライブ"},
    {id:6,label:"Yahoo!",url:"https://www.yahoo.co.jp",icon:"https://www.yahoo.co.jp/favicon.ico",searchText:"Yahoo! ヤフー"},
    {id:7,label:"X",url:"https://x.com/i/timeline",icon:"https://x.com/favicon.ico",searchText:"X Twitter ツイッター"},
    {id:8,label:"Instagram",url:"https://www.instagram.com",icon:"https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png",searchText:"Instagram インスタグラム"},
    {id:9,label:"YouTube",url:"https://www.youtube.com/feed/subscriptions",icon:"https://www.youtube.com/favicon.ico",searchText:"YouTube ユーチューブ"},
    {id:10,label:"YT Shorts",url:"https://www.youtube.com/feed/subscriptions/shorts",icon:"https://www.youtube.com/favicon.ico",searchText:"YT Shorts YouTube ショート"},
    {id:12,label:"TikTok",url:"https://www.tiktok.com",icon:"https://www.tiktok.com/favicon.ico",searchText:"TikTok ティックトック"},
    {id:15,label:"Discord",url:"https://discord.com/channels/@me",icon:"https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg",searchText:"Discord ディスコード"},
    {id:16,label:"Spotify",url:"https://open.spotify.com/intl-ja",icon:"https://open.spotify.com/favicon.ico",searchText:"Spotify スポティファイ"},
    {id:22,label:"ChatGPT",url:"https://chatgpt.com",icon:"https://chat.openai.com/favicon.ico",searchText:"ChatGPT AI"},
    {id:25,label:"BUSTARAIN",url:"https://sites.google.com/view/bustar/home",icon:"https://sites.google.com/favicon.ico",searchText:"BUSTARAIN バスタレイン"},
    {id:30,label:"メルカリ",url:"https://www.mercari.com/jp/",icon:"https://mercari.com/favicon.ico",searchText:"メルカリ フリマ"},
    {id:37,label:"Amazon",url:"https://www.amazon.co.jp/",icon:"https://www.amazon.co.jp/favicon.ico",searchText:"Amazon アマゾン"},
    {id:49,label:"Deepl翻訳",url:"https://www.deepl.com/translator",icon:"https://www.deepl.com/img/favicon/deepl_favicon_32x32.png",searchText:"Deepl 翻訳"},
    {id:58,label:"Splatoon Map",url:"https://www.splatoon3-schedule.net",icon:"https://www.splatoon3-schedule.net/favicon.ico",searchText:"Splatoon 3 スプラトゥーン マップ"},
    {id:69, label:"兵庫県警報・注意報", url:"https://weathernews.jp/onebox/warn/hyogo/2810000/", icon:"https://weathernews.jp/favicon.ico", searchText:"警報 注意報 天気 兵庫 weathernews"},
    {id:77,label:"Copilot",url:"https://copilot.microsoft.com",icon:"https://copilot.microsoft.com/favicon.ico",searchText:"Microsoft Copilot コパイロット Bing"},
    // ... 他のアプリデータも必要に応じてここに追加 ...
];

const GOOGLE_FAVICON_API_BASE = 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=';
let appData = [];

// ローカルストレージキー
const SAVE_KEYS = {
    THEME: 'siteSaveTheme',     // 'light' or 'dark'
    RECENTLY_USED: 'siteRecentlyUsed',
    FAVORITES: 'siteFavorites'
};

let favoriteIds = [];
let recentlyUsedIds = [];

// --- CSS注入（お気に入りボタンの位置調整など） ---
const styleElement = document.createElement('style');
styleElement.innerHTML = `
    /* アプリアイコンのコンテナ調整 */
    .icon-item {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        /* 必要に応じてサイズ調整 */
        padding: 10px;
        border-radius: 10px;
        transition: background 0.2s;
    }
    .icon-item:hover {
        background-color: rgba(0,0,0,0.05);
    }
    body.dark-theme .icon-item:hover {
        background-color: rgba(255,255,255,0.1);
    }
    
    /* お気に入りボタン（右上） */
    .favorite-btn {
        position: absolute;
        top: 5px;   /* ★ここで右上に配置 */
        right: 5px; /* ★ここで右上に配置 */
        cursor: pointer;
        color: #ccc; 
        font-size: 14px;
        z-index: 10;
        text-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
        transition: transform 0.2s, color 0.2s;
        padding: 2px;
    }
    .favorite-btn:hover {
        transform: scale(1.2);
    }
    .favorite-btn.active {
        color: #FFD700; 
        text-shadow: 0 0 2px rgba(0,0,0,0.5);
    }
    
    /* アイコン画像 */
    .icon-img {
        width: 32px;
        height: 32px;
        object-fit: contain;
        margin-bottom: 5px;
    }
    .icon-link {
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
    }
    
    /* グリッドレイアウト */
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 15px;
        padding: 10px;
    }
    .label-text {
        font-size: 12px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
    }
    
    /* アコーディオン内のiframe */
    .accordion-content iframe {
        width: 100%;
        height: 400px; /* デフォルトの高さ */
        border: none;
    }
`;
document.head.appendChild(styleElement);


// --- 初期化処理 ---
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    initAppData();
    
    // UI描画
    renderAllIcons();
    renderRecentlyUsed();
    
    // 時計・カウントダウン開始
    updateClock();
    setInterval(updateClock, 1000);
    
    // SpeedTest Iframeの遅延ロード
    if (dom.speedTestIframe && dom.speedTestIframe.dataset.src) {
        dom.speedTestIframe.src = dom.speedTestIframe.dataset.src;
    }

    setupEventListeners();
});

// --- データ・設定読み込み ---

function loadSettings() {
    // テーマ
    const savedTheme = localStorage.getItem(SAVE_KEYS.THEME);
    // HTMLのonclick="setTheme('...')"と連携するため、初期状態を設定
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    // お気に入り
    const favData = localStorage.getItem(SAVE_KEYS.FAVORITES);
    favoriteIds = favData ? JSON.parse(favData) : [];

    // 最近使用
    const recentData = localStorage.getItem(SAVE_KEYS.RECENTLY_USED);
    recentlyUsedIds = recentData ? JSON.parse(recentData) : [];
}

function initAppData() {
    appData = JSON.parse(JSON.stringify(initialAppData));
    
    // アイコンURLの正規化
    appData.forEach(app => {
        if (app.icon && app.icon.startsWith('http') && !app.icon.includes(GOOGLE_FAVICON_API_BASE) && !app.icon.includes('gstatic')) {
            app.icon = `${GOOGLE_FAVICON_API_BASE}${encodeURIComponent(app.url)}&size=64`;
        }
        // お気に入り状態の反映
        app.isFavorite = favoriteIds.includes(app.id);
    });
}

// --- テーマ切り替え (HTMLのonclick属性から呼ばれる) ---
window.setTheme = function(mode) {
    if (mode === 'dark') {
        document.body.classList.add('dark-theme');
        localStorage.setItem(SAVE_KEYS.THEME, 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem(SAVE_KEYS.THEME, 'light');
    }
};

// --- タブ切り替え機能 ---
window.activateTab = function(tabName) {
    // 全てのコンテンツを非表示
    dom.mainGrid.classList.add('hidden');
    dom.bustarainContainer.classList.add('hidden');
    dom.optionContainer.classList.add('hidden');
    
    // 全てのタブボタンのスタイルリセット（必要ならactiveクラス付け替えなど）
    
    // 対象を表示
    if (tabName === 'all-apps') {
        dom.mainGrid.classList.remove('hidden');
    } else if (tabName === 'bustarain') {
        dom.bustarainContainer.classList.remove('hidden');
    } else if (tabName === 'option') {
        dom.optionContainer.classList.remove('hidden');
    }
};

// --- アプリ描画 ---

function createIconElement(app, showStar = true) {
    const item = document.createElement('div');
    item.className = 'icon-item search-item';
    item.dataset.searchText = (app.searchText || "").toLowerCase();
    item.dataset.id = app.id;

    // アイコン画像
    let iconHTML;
    if (app.icon) {
        iconHTML = `<img src="${app.icon}" class="icon-img" loading="lazy" alt="${app.label}" onerror="this.src='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/svgs/solid/globe.svg'">`;
    } else {
        iconHTML = `<i class="fas fa-globe" style="font-size:32px; margin-bottom:5px;"></i>`;
    }

    // スター（お気に入り）ボタン
    let starHTML = '';
    if (showStar) {
        const starClass = app.isFavorite ? 'fas fa-star favorite-btn active' : 'far fa-star favorite-btn';
        // クリックイベントは後でaddEventListenerでも良いが、HTML文字列生成ならonclickが簡単
        // ただし、JS関数を呼ぶ形にする
        starHTML = `<i class="${starClass}" onclick="toggleFavorite(event, ${app.id})"></i>`;
    }

    // HTML組み立て
    item.innerHTML = `
        <a href="${app.url}" class="icon-link" target="_blank" onclick="trackUsage(${app.id})">
            ${iconHTML}
            <div class="label-text">${app.label}</div>
        </a>
        ${starHTML}
    `;
    
    return item;
}

function renderAllIcons() {
    dom.allAppsGrid.innerHTML = '';
    
    // お気に入りが先頭に来るようにソート
    const sortedApps = [...appData].sort((a, b) => {
        if (a.isFavorite === b.isFavorite) return 0;
        return a.isFavorite ? -1 : 1;
    });

    sortedApps.forEach(app => {
        dom.allAppsGrid.appendChild(createIconElement(app, true));
    });
    
    // 検索フィルタ適用（検索窓に文字が残っている場合）
    filterApps();
}

function renderRecentlyUsed() {
    dom.recentlyUsedGrid.innerHTML = '';
    
    if (recentlyUsedIds.length === 0) {
        dom.recentlyUsedContainer.classList.add('hidden');
        dom.sectionDivider.classList.add('hidden');
        return;
    }

    dom.recentlyUsedContainer.classList.remove('hidden');
    dom.sectionDivider.classList.remove('hidden');
    
    recentlyUsedIds.forEach(id => {
        const app = appData.find(a => a.id === id);
        if (app) {
            // 最近使用欄ではスターを表示しない（false）
            dom.recentlyUsedGrid.appendChild(createIconElement(app, false));
        }
    });
}

// --- アクション（お気に入り・履歴） ---

window.toggleFavorite = function(e, appId) {
    e.preventDefault();
    e.stopPropagation();

    if (favoriteIds.includes(appId)) {
        favoriteIds = favoriteIds.filter(id => id !== appId);
    } else {
        favoriteIds.push(appId);
    }
    localStorage.setItem(SAVE_KEYS.FAVORITES, JSON.stringify(favoriteIds));

    // データ更新
    const app = appData.find(a => a.id === appId);
    if (app) app.isFavorite = !app.isFavorite;

    // 再描画（並び順が変わるため）
    renderAllIcons();
};

window.trackUsage = function(appId) {
    // 最近使用したリストを更新
    recentlyUsedIds = recentlyUsedIds.filter(id => id !== appId); // 重複削除
    recentlyUsedIds.unshift(appId); // 先頭に追加
    
    if (recentlyUsedIds.length > 12) {
        recentlyUsedIds.pop();
    }
    localStorage.setItem(SAVE_KEYS.RECENTLY_USED, JSON.stringify(recentlyUsedIds));
    
    // 再描画（即座には反映されないが、戻ってきたときのために）
    renderRecentlyUsed();
};

// --- 検索機能 ---

function filterApps() {
    const query = dom.searchInput.value.toLowerCase().trim();
    const items = dom.allAppsGrid.querySelectorAll('.search-item');

    // クリアボタンの表示切り替え
    if (query.length > 0) {
        dom.clearSearchBtn.classList.remove('hidden');
    } else {
        dom.clearSearchBtn.classList.add('hidden');
    }

    items.forEach(item => {
        const text = item.dataset.searchText;
        if (text.includes(query)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

// --- Bustarain関連 (サブタブ・アコーディオン) ---

function setupEventListeners() {
    // 検索イベント
    dom.searchInput.addEventListener('input', filterApps);
    dom.clearSearchBtn.addEventListener('click', () => {
        dom.searchInput.value = '';
        filterApps();
        dom.searchInput.focus();
    });

    // リロードボタン
    if(dom.refreshBtn) dom.refreshBtn.addEventListener('click', () => location.reload());
    if(dom.speedTestRefreshBtn) dom.speedTestRefreshBtn.addEventListener('click', () => {
        if(dom.speedTestIframe) dom.speedTestIframe.src = dom.speedTestIframe.src;
    });

    // Bustarain サブタブ切り替え
    dom.subTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // ボタンのアクティブ化
            dom.subTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // コンテンツの切り替え
            const targetId = btn.dataset.target;
            dom.subTabContents.forEach(content => {
                if (content.id === targetId) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });

    // Bustarain アコーディオン制御
    dom.accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // this (header) の次の要素 (content) を取得
            const content = header.nextElementSibling;
            
            // アイコンの回転などをクラスで制御したい場合はここでheaderにtoggle
            header.classList.toggle('active');
            
            // 表示切り替え (CSSで .accordion-content { display: none; } 前提、開くときは block か flex)
            // HTML/CSSが提供されていない部分ですが、一般的にはmax-heightかdisplay操作
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
                // iframeの遅延読み込み
                const src = header.dataset.src;
                if (src && !content.innerHTML.trim()) {
                    // 相対パスの場合は適切に解決されるが、外部URLの場合はそのまま
                    content.innerHTML = `<iframe src="${src}" loading="lazy"></iframe>`;
                }
            }
            
            // 矢印アイコンの回転（FontAwesomeのクラス切り替え例）
            const icon = header.querySelector('.fa-chevron-down');
            if (icon) {
                if (content.style.display === 'block') {
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    icon.style.transform = 'rotate(0deg)';
                }
                icon.style.transition = 'transform 0.3s';
            }
        });
    });
}

// --- 時計・カウントダウン機能 ---

function parseTimeToDate(timeStr) {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(':').map(Number);
    const now = new Date();
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
}

function updateClock() {
    const now = new Date();

    // 日付表示: "12月7日(日)"
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const dateStr = `${now.getMonth() + 1}月${now.getDate()}日(${days[now.getDay()]})`;
    if (dom.date) dom.date.textContent = dateStr;

    // 時計表示: "21:30:45"
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    if (dom.clock) dom.clock.textContent = `${h}:${m}:${s}`;

    // オフライン判定
    if (dom.offlineStatus) {
        if (!navigator.onLine) {
            dom.offlineStatus.innerHTML = '<i class="fas fa-wifi-slash"></i> Offline';
            dom.offlineStatus.style.color = 'red';
        } else {
            dom.offlineStatus.textContent = '';
        }
    }

    // カウントダウンロジック
    updateCountdown(now);
}

function updateCountdown(now) {
    if (!dom.countdown) return;

    // 時間を分単位の数値に変換して比較しやすくする
    const currentMins = now.getHours() * 60 + now.getMinutes();

    let currentPeriod = null;
    let nextEvent = null;

    // スケジュール判定
    for (let i = 0; i < schedule.length; i++) {
        const item = schedule[i];
        const start = parseTimeToDate(item.start);
        const end = parseTimeToDate(item.end);
        
        if (!start || !end) continue;

        const startMins = start.getHours() * 60 + start.getMinutes();
        const endMins = end.getHours() * 60 + end.getMinutes();

        // 現在期間中か
        if (currentMins >= startMins && currentMins < endMins) {
            currentPeriod = item;
            // 終了までの時間を計算
            const diff = end - now; // ms
            const diffMins = Math.floor(diff / 60000);
            const diffSecs = Math.floor((diff % 60000) / 1000);
            
            dom.countdown.innerHTML = `
                <span style="font-size:0.8em">${item.name}終了まで</span><br>
                <span style="font-weight:bold; font-size:1.2em">${diffMins}分${String(diffSecs).padStart(2,'0')}秒</span>
            `;
            return;
        }

        // 次の予定を探す
        if (currentMins < startMins) {
            nextEvent = item;
            // 次の開始までの時間を計算
            const diff = start - now;
            const diffMins = Math.floor(diff / 60000);
            const diffSecs = Math.floor((diff % 60000) / 1000);

            dom.countdown.innerHTML = `
                <span style="font-size:0.8em">次は ${item.name}</span><br>
                <span style="font-weight:bold; font-size:1.2em">開始まで ${diffMins}分${String(diffSecs).padStart(2,'0')}秒</span>
            `;
            return;
        }
    }

    // 全スケジュール終了後
    dom.countdown.textContent = "本日の予定終了";
}
