// --- DOM要素の取得 ---
const mainGrid = document.getElementById('main-grid');
const bustarainContainer = document.getElementById('bustarain-container');
const optionContainer = document.getElementById('option-container');
const fyContainer = document.getElementById('fy-container');
const fyContentArea = document.getElementById('fy-content-area');

const gridContainer = document.getElementById('gridContainer');
const refreshButton = document.getElementById('refresh-button');
const recentlyUsedGridContainer = document.getElementById('recentlyUsedGridContainer');
const recentlyUsedContainer = document.getElementById('recently-used-apps-container');
const sectionDivider = document.getElementById('section-divider');
const searchInput = document.getElementById('appSearchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');

// --- データ定義 ---
const schedule = [{name:"1限",start:"08:50",end:"09:40"},{name:"休憩",start:"09:40",end:"09:50"},{name:"2限",start:"09:50",end:"10:40"},{name:"休憩",start:"10:40",end:"10:50"},{name:"3限",start:"10:50",end:"11:40"},{name:"休憩",start:"11:40",end:"11:50"},{name:"4限",start:"11:50",end:"12:40"},{name:"昼休み",start:"12:40",end:"13:20"},{name:"5限",start:"13:20",end:"14:10"},{name:"休憩",start:"14:10",end:"14:20"},{name:"6限",start:"14:20",end:"15:10"},{name:"休憩",start:"15:10",end:"15:20"},{name:"7限",start:"15:20",end:"16:10"},{name:"休憩",start:"16:10",end:"16:40"},{name:"8限",start:"16:40",end:"17:30"},{name:"休憩",start:"17:30",end:"17:40"},{name:"9限",start:"17:40",end:"18:30"}];

// Apps データ
let appData = [];
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
    {id:20,label:"神戸市交通局",url:"https://kotsu.city.kobe.lg.jp/",icon:"https://kotsu.city.kobe.lg.jp/common/img/favicon.ico",searchText:"神戸市交通局 地下鉄 バス"},
    {id:22,label:"ChatGPT",url:"https://chatgpt.com",icon:"https://chat.openai.com/favicon.ico",searchText:"ChatGPT AI"},
    {id:25,label:"BUSTARAIN",url:"https://sites.google.com/view/bustar/home",icon:"https://sites.google.com/favicon.ico",searchText:"BUSTARAIN バスタレイン"},
    {id:30,label:"メルカリ",url:"https://www.mercari.com/jp/",icon:"https://mercari.com/favicon.ico",searchText:"メルカリ フリマ"},
    {id:37,label:"Amazon",url:"https://www.amazon.co.jp/",icon:"https://www.amazon.co.jp/favicon.ico",searchText:"Amazon アマゾン"},
    {id:69, label:"兵庫県警報・注意報", url:"https://weathernews.jp/onebox/warn/hyogo/2810000/", icon:"https://weathernews.jp/favicon.ico", searchText:"警報 注意報 天気 兵庫 weathernews"},
    /* 省略されている他のデータもそのままここに含む想定 */
    // 必要に応じて元のリストを全て記載してください
];

// Bustarain データ (IDは1000番台で管理して重複回避)
const bustarainData = [
    { id: 1001, category: 'train', label: "和田岬", src: "train/wadmisaki-train.html", icon: "fas fa-train" },
    { id: 1002, category: 'train', label: "帰）板宿新長田経由海岸線", src: "train/itayado-train.html", icon: "fas fa-subway" },
    { id: 1003, category: 'train', label: "板宿駅（山陽電車）", src: "train/Itayado-sannyou.html", icon: "fas fa-train" },
    { id: 1004, category: 'bus', label: "バスロケーション", src: "bus/Buslocation.html", icon: "fas fa-map-marked-alt" },
    { id: 1005, category: 'bus', label: "行き・帰り（今出在家 ⇔ 鷹取団地）", src: "bus/iki-kaeri.html", icon: "fas fa-exchange-alt" },
    { id: 1006, category: 'bus', label: "今出在家", src: "bus/imadezaike.html", icon: "fas fa-bus" },
    { id: 1007, category: 'bus', label: "夢野町3丁目", src: "bus/yumeno3.html", icon: "fas fa-bus" },
    { id: 1008, category: 'bus', label: "高取団地前", src: "bus/takatoridantimae.html", icon: "fas fa-bus" },
    { id: 1009, category: 'bus', label: "板宿駅", src: "bus/Itayado-bus.html", icon: "fas fa-bus" }
];

const GOOGLE_FAVICON_API_BASE = 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=';
initialAppData.forEach(app => {
    if (app.icon && (app.icon.startsWith('http') && !app.icon.includes(GOOGLE_FAVICON_API_BASE))) {
        app.icon = `${GOOGLE_FAVICON_API_BASE}${encodeURIComponent(app.url)}&size=64`;
    }
});

const SAVE_KEYS = {
    THEME: 'siteSaveTheme',
    MAIN_TAB: 'siteSaveMainTab',
    RECENTLY_USED: 'siteRecentlyUsed',
    FAVORITES: 'siteFavorites'
};
const MAX_RECENTLY_USED = 12;
let saveSettings = {};
let favoriteIds = [];
let currentActiveTab = 'all-apps';

// --- CSS注入（お気に入りボタン位置修正） ---
const styleElement = document.createElement('style');
styleElement.innerHTML = `
    .icon-item {
        position: relative;
    }
    .favorite-btn {
        position: absolute;
        top: 5px; /* 右上に変更 */
        right: 5px; /* 右上に変更 */
        cursor: pointer;
        color: #ccc;
        font-size: 14px;
        z-index: 10;
        text-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
        transition: transform 0.2s, color 0.2s;
        padding: 5px;
    }
    .favorite-btn:hover {
        transform: scale(1.2);
    }
    .favorite-btn.active {
        color: #FFD700;
        text-shadow: 0 0 2px rgba(0,0,0,0.5);
    }
`;
document.head.appendChild(styleElement);


// --- 初期化・ロード関連 ---
function loadSaveSettings() {
    saveSettings = {
        theme: localStorage.getItem(SAVE_KEYS.THEME) === 'true',
        mainTab: localStorage.getItem(SAVE_KEYS.MAIN_TAB) || 'all-apps',
    };
    if (localStorage.getItem(SAVE_KEYS.THEME) === null) saveSettings.theme = false;
    
    // お気に入り読み込み
    const favData = localStorage.getItem(SAVE_KEYS.FAVORITES);
    favoriteIds = favData ? JSON.parse(favData) : [];
}

function saveItem(key, value) {
    localStorage.setItem(key, value);
}

function loadAppData() { 
    // Appデータの復元とお気に入り反映
    try { 
        appData = JSON.parse(JSON.stringify(initialAppData));
        appData.forEach(app => {
            app.isFavorite = favoriteIds.includes(app.id);
        });
    } catch(e) { 
        appData = JSON.parse(JSON.stringify(initialAppData)); 
    } 
    
    // Bustarainデータにもお気に入り反映
    bustarainData.forEach(item => {
        item.isFavorite = favoriteIds.includes(item.id);
    });
}

// --- タブ切り替え ---
function activateTab(tabName) {
    currentActiveTab = tabName;
    saveItem(SAVE_KEYS.MAIN_TAB, tabName);

    mainGrid.style.display = 'none';
    bustarainContainer.style.display = 'none';
    optionContainer.style.display = 'none';
    fyContainer.style.display = 'none';

    if (tabName === 'all-apps') {
        mainGrid.style.display = 'block';
        renderAllIcons();
    } else if (tabName === 'bustarain') {
        bustarainContainer.style.display = 'block';
        // Bustarainの表示を更新（スターの状態反映のため）
        renderBustarainContent();
    } else if (tabName === 'option') {
        optionContainer.style.display = 'block';
    } else if (tabName === 'fy') {
        fyContainer.style.display = 'block';
        renderFavoritesTab();
    }
    
    filterContent();
}

// --- お気に入り切り替え処理 (共通) ---
function toggleFavorite(e, id) {
    if(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    if (favoriteIds.includes(id)) {
        favoriteIds = favoriteIds.filter(fid => fid !== id);
    } else {
        favoriteIds.push(id);
    }
    saveItem(SAVE_KEYS.FAVORITES, JSON.stringify(favoriteIds));

    // メモリ上のデータ更新
    const app = appData.find(a => a.id === id);
    if (app) app.isFavorite = favoriteIds.includes(id);
    
    const bus = bustarainData.find(b => b.id === id);
    if (bus) bus.isFavorite = favoriteIds.includes(id);

    // 画面更新
    if (currentActiveTab === 'fy') {
        renderFavoritesTab();
    } else if (currentActiveTab === 'all-apps') {
        renderAllIcons();
    } else if (currentActiveTab === 'bustarain') {
        // Bustarainタブの場合はスターの色を変えるだけにする（再描画だとアコーディオンが閉じてしまうため）
        const btn = document.querySelector(`.accordion-star[data-id="${id}"]`);
        if(btn) {
            if(favoriteIds.includes(id)) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    }
}

// --- Apps機能 (メイングリッド) ---
function getRecentlyUsed() {
    const data = localStorage.getItem(SAVE_KEYS.RECENTLY_USED);
    return data ? JSON.parse(data) : [];
}

function addRecentlyUsed(appId) {
    let recentlyUsed = getRecentlyUsed();
    recentlyUsed = recentlyUsed.filter(id => id !== appId);
    recentlyUsed.unshift(appId);
    if (recentlyUsed.length > MAX_RECENTLY_USED) recentlyUsed.pop();
    saveItem(SAVE_KEYS.RECENTLY_USED, JSON.stringify(recentlyUsed));
    renderRecentlyUsed();
}

function renderRecentlyUsed() {
    const recentlyUsedIds = getRecentlyUsed();
    recentlyUsedGridContainer.innerHTML = '';

    if (recentlyUsedIds.length === 0) {
        recentlyUsedContainer.classList.add('hidden');
        sectionDivider.classList.add('hidden');
        return;
    }

    recentlyUsedContainer.classList.remove('hidden');
    sectionDivider.classList.remove('hidden');
    
    recentlyUsedIds.forEach(id => {
        const app = appData.find(a => a.id === id);
        if (app) {
            const iconElement = createIconElement(app, false); 
            iconElement.querySelector('a').addEventListener('click', () => addRecentlyUsed(app.id));
            recentlyUsedGridContainer.appendChild(iconElement);
        }
    });
}

function createIconElement(app, showStar = true) {
    const item = document.createElement('div');
    item.className = `icon-item search-item`;
    item.dataset.id = app.id;
    item.dataset.searchText = app.searchText;
    
    let iconHTML;
    if (app.icon && (app.icon.startsWith('http') || app.icon.startsWith('data:'))) {
        iconHTML = `<img src="${app.icon}" class="icon-img" loading="lazy" alt="${app.label}" onerror="this.outerHTML='<i class=\\\'fas fa-globe fallback-icon\\\'></i>'">`;
    } else {
        iconHTML = `<i class="${app.icon || 'fas fa-globe'}" style="${app.style || ''}"></i>`;
    }

    let starHTML = '';
    if (showStar) {
        const starClass = app.isFavorite ? 'fas fa-star favorite-btn active' : 'far fa-star favorite-btn';
        starHTML = `<i class="${starClass}" onclick="toggleFavorite(event, ${app.id})"></i>`;
    }

    // Bustarainアイテムの場合のクリック動作（モーダルを開く）
    // IDが1000以上ならBustarainとみなす
    let linkHTML = '';
    if (app.id >= 1000) {
        linkHTML = `<a href="#" class="icon-link" onclick="openModal('${app.src}'); return false;">${iconHTML}</a>`;
    } else {
        linkHTML = `<a href="${app.url}" class="icon-link" target="_blank">${iconHTML}</a>`;
    }

    item.innerHTML = `
        ${linkHTML}
        ${starHTML}
        <div class="label-text">${app.label}</div>`; 
    
    if (app.id < 1000) {
        item.querySelector('a').addEventListener('click', () => addRecentlyUsed(app.id));
    }

    return item;
}

function renderAllIcons() {
    gridContainer.innerHTML = '';
    const sortedApps = [...appData].sort((a, b) => {
        if (a.isFavorite === b.isFavorite) return 0;
        return a.isFavorite ? -1 : 1;
    });

    sortedApps.forEach(app => {
        const iconElement = createIconElement(app, true);
        gridContainer.appendChild(iconElement);
    });
    filterContent();
}

// --- Bustarain機能 ---
function renderBustarainContent() {
    const trainContainer = document.getElementById('train-content');
    const busContainer = document.getElementById('bus-content');
    
    // 内容を一旦クリア（重複防止）
    trainContainer.innerHTML = '';
    busContainer.innerHTML = '';

    bustarainData.forEach(item => {
        const starClass = item.isFavorite ? 'active' : '';
        const html = `
            <div class="accordion-item search-item" data-search-text="${item.label}">
                <div class="accordion-header" data-src="${item.src}">
                    ${item.label}
                    <i class="fas fa-star accordion-star ${starClass}" data-id="${item.id}" onclick="toggleFavorite(event, ${item.id})"></i>
                    <i class="fas fa-chevron-down" style="margin-left:10px;"></i>
                </div>
                <div class="accordion-content"></div>
            </div>
        `;

        if (item.category === 'train') trainContainer.insertAdjacentHTML('beforeend', html);
        else if (item.category === 'bus') busContainer.insertAdjacentHTML('beforeend', html);
    });

    // アコーディオンのイベント再設定
    attachAccordionEvents();
}

function attachAccordionEvents() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        // 重複登録防止のため一度クローン
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);
        
        newHeader.addEventListener('click', function(e) {
            // スターボタンクリック時はアコーディオンを開閉しない
            if(e.target.classList.contains('accordion-star')) return;

            const content = this.nextElementSibling;
            const src = this.getAttribute('data-src');
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                setTimeout(() => { content.innerHTML = ''; }, 200);
            } else {
                content.innerHTML = `<iframe src="${src}" frameborder="0" style="width:100%; height:500px;"></iframe>`;
                content.style.maxHeight = "500px";
            }
        });
    });
}

function openModal(src) {
    const modal = document.getElementById('iframe-modal');
    const iframe = document.getElementById('modal-iframe');
    iframe.src = src;
    modal.classList.remove('hidden');
}

// --- FYタブ描画 ---
function renderFavoritesTab() {
    fyContentArea.innerHTML = '';
    
    // AppsとBustarain両方からお気に入りを抽出
    const favApps = appData.filter(a => a.isFavorite);
    const favBus = bustarainData.filter(b => b.isFavorite);
    
    const allFavs = [...favApps, ...favBus];

    if (allFavs.length === 0) {
        fyContentArea.innerHTML = '<p style="text-align:center; width:100%; color:#888;">お気に入りは登録されていません。</p>';
        return;
    }

    allFavs.forEach(item => {
        // 共通のcreateIconElementを使用。Bustarain(ID>=1000)はモーダルが開くリンクになる
        const iconElement = createIconElement(item, true);
        fyContentArea.appendChild(iconElement);
    });

    filterContent();
}

// --- 検索機能 ---
function filterContent() {
    const searchText = searchInput.value.toLowerCase();
    const clearBtn = document.getElementById('clearSearchBtn');
    
    clearBtn.classList.toggle('hidden', searchText.length === 0);

    let targetContainer;
    if (currentActiveTab === 'all-apps') targetContainer = gridContainer;
    else if (currentActiveTab === 'fy') targetContainer = fyContentArea;
    else if (currentActiveTab === 'bustarain') {
        // Bustarainは複数のコンテナがある
        const visibleSubTab = document.querySelector('.sub-tab-content:not(.hidden)');
        if(visibleSubTab) targetContainer = visibleSubTab;
        else return;
    } else return;

    const items = targetContainer.querySelectorAll('.search-item');
    items.forEach(item => {
        // data-search-text または label-text または accordion-headerのテキスト
        let text = item.dataset.searchText ? item.dataset.searchText.toLowerCase() : '';
        if(!text) {
             const label = item.querySelector('.label-text') || item.querySelector('.accordion-header');
             if(label) text = label.innerText.toLowerCase();
        }
        
        if (text.includes(searchText)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// --- 時計 ---
function parseTimeToDate(timeStr) {
    const today = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0);
}

function updateClock() {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[now.getDay()];
    
    // 日付に年を追加
    const dateStr = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} (${dayName})`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    document.getElementById('date').textContent = dateStr;
    document.getElementById('clock').textContent = timeStr;

    // カウントダウン
    let nextEvent = null;
    for (let item of schedule) {
        const startTime = parseTimeToDate(item.start);
        const endTime = parseTimeToDate(item.end);
        
        if (now < startTime) {
            nextEvent = { name: item.name, time: startTime, type: 'start' };
            break;
        } else if (now < endTime) {
            nextEvent = { name: item.name, time: endTime, type: 'end' };
            break;
        }
    }

    const countdownEl = document.getElementById('countdown');
    if (nextEvent) {
        const diff = nextEvent.time - now;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        const prefix = nextEvent.type === 'start' ? '開始まで' : '終了まで';
        countdownEl.textContent = `${nextEvent.name} ${prefix} ${minutes}分${seconds}秒`;
    } else {
        countdownEl.textContent = "本日の予定終了";
    }
}

// --- Bustarainタブ切り替え初期化 ---
function initBustarainTabs() {
    const btns = document.querySelectorAll('.sub-tab-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const targetId = btn.getAttribute('data-target');
            document.querySelectorAll('.sub-tab-content').forEach(c => c.classList.add('hidden'));
            document.getElementById(targetId).classList.remove('hidden');
        });
    });
}

function setTheme(mode) {
    if (mode === 'dark') {
        document.body.classList.add('dark-theme');
        saveItem(SAVE_KEYS.THEME, 'true');
    } else {
        document.body.classList.remove('dark-theme');
        saveItem(SAVE_KEYS.THEME, 'false');
    }
}

// --- メイン処理開始 ---
window.onload = function() {
    loadSaveSettings();
    loadAppData();

    if (saveSettings.theme) document.body.classList.add('dark-theme');

    // 初期化
    initBustarainTabs();
    // Bustarainの中身も生成しておく（FYタブで使う可能性があるため）
    renderBustarainContent(); 
    
    activateTab(saveSettings.mainTab);
    renderRecentlyUsed();

    // イベントリスナー
    refreshButton.addEventListener('click', () => location.reload());
    document.getElementById('speed-test-refresh-button').addEventListener('click', () => {
        document.getElementById('speed-frame').src = document.getElementById('speed-frame').src;
    });

    // モーダル閉じる
    document.querySelector('.close-modal-btn').addEventListener('click', () => {
        document.getElementById('iframe-modal').classList.add('hidden');
        document.getElementById('modal-iframe').src = '';
    });
    
    searchInput.addEventListener('input', filterContent);
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterContent();
    });

    updateClock();
    setInterval(updateClock, 1000);
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
};

function updateOnlineStatus() {
    const statusEl = document.getElementById('offline-status');
    if (navigator.onLine) {
        statusEl.style.display = 'none';
    } else {
        statusEl.textContent = 'オフライン';
        statusEl.style.display = 'block';
        statusEl.style.color = 'red';
        statusEl.style.fontWeight = 'bold';
    }
}
