document.addEventListener('DOMContentLoaded', () => {
    // --- DOM要素の取得 ---
    const mainGrid = document.getElementById('main-grid');
    const bustarainContainer = document.getElementById('bustarain-container');
    const optionContainer = document.getElementById('option-container');
    const fyContainer = document.getElementById('fy-container');
    const fyContentArea = document.getElementById('fy-content-area');

    const gridContainer = document.getElementById('gridContainer');
    const recentlyUsedGridContainer = document.getElementById('recentlyUsedGridContainer');
    const recentlyUsedContainer = document.getElementById('recently-used-apps-container');
    const sectionDivider = document.getElementById('section-divider');
    const searchInput = document.getElementById('appSearchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    
    // Header controls
    const refreshButton = document.getElementById('refresh-button');

    // --- データ定義 (スケジュール) ---
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

    let appData = [];

    // --- データ定義 (アプリリスト) ---
    const initialAppData = [
        {id:1,label:"Google",url:"https://www.google.com",icon:"https://www.google.com/favicon.ico",searchText:"Google グーグル"},
        {id:2,label:"Gmail",url:"https://mail.google.com",icon:"https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",searchText:"Gmail Google Mail メール"},
        {id:3,label:"Calendar",url:"https://calendar.google.com",icon:"https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_3_2x.png",searchText:"Google Calendar カレンダー"},
        {id:4,label:"Photos",url:"https://photos.google.com",icon:"https://ssl.gstatic.com/images/branding/product/1x/photos_48dp.png",searchText:"Google Photos フォト 写真"},
        {id:5,label:"Drive",url:"https://drive.google.com",icon:"https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png",searchText:"Google Drive ドライブ"},
        {id:6,label:"YouTube",url:"https://www.youtube.com",icon:"https://www.youtube.com/favicon.ico",searchText:"YouTube ユーチューブ 動画"},
        {id:7,label:"X",url:"https://x.com",icon:"https://x.com/favicon.ico",searchText:"X Twitter ツイッター"},
        {id:8,label:"Instagram",url:"https://www.instagram.com",icon:"https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png",searchText:"Instagram インスタグラム"},
        {id:9,label:"Yahoo!",url:"https://www.yahoo.co.jp",icon:"https://www.yahoo.co.jp/favicon.ico",searchText:"Yahoo! ヤフー"},
        {id:10,label:"Amazon",url:"https://www.amazon.co.jp/",icon:"https://www.amazon.co.jp/favicon.ico",searchText:"Amazon アマゾン 通販"},
        {id:11,label:"ChatGPT",url:"https://chatgpt.com",icon:"https://chat.openai.com/favicon.ico",searchText:"ChatGPT AI"},
        {id:12,label:"DeepL",url:"https://www.deepl.com/translator",icon:"https://www.deepl.com/img/favicon/deepl_favicon_32x32.png",searchText:"Deepl 翻訳"},
        {id:20,label:"神戸市交通局",url:"https://kotsu.city.kobe.lg.jp/",icon:"https://kotsu.city.kobe.lg.jp/common/img/favicon.ico",searchText:"神戸市交通局 地下鉄 バス"},
        // 必要に応じてリストを追加してください
        {id:50,label:"画像圧縮",url:"https://www.iloveimg.com/ja/compress-image",icon:"https://www.iloveimg.com/img/favicons/favicon-32x32.png",searchText:"iloveimg compress"},
    ];

    const GOOGLE_FAVICON_API_BASE = 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=';
    initialAppData.forEach(app => {
        // アイコンがない、または特殊なURLでない場合にGoogleのAPIを使用
        if (!app.icon || (app.icon.startsWith('http') && !app.icon.includes(GOOGLE_FAVICON_API_BASE) && !app.icon.includes('.ico') && !app.icon.includes('.png'))) {
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

    // --- 初期化処理 ---
    loadSaveSettings();
    loadAppData();
    initTheme();
    
    // 初期タブのアクティブ化
    const savedTab = getSavedItem(SAVE_KEYS.MAIN_TAB) || 'all-apps';
    // グローバル関数として登録してから呼び出す
    window.activateTab = activateTabLogic;
    window.setTheme = setThemeLogic;
    window.toggleFavorite = toggleFavoriteLogic;

    activateTabLogic(savedTab);
    
    renderRecentlyUsed();
    renderAllIcons();
    startClock();

    // --- イベントリスナー ---
    if(refreshButton) refreshButton.addEventListener('click', () => location.reload());
    
    searchInput.addEventListener('input', filterContent);
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterContent();
    });

    // Bustarainサブタブ制御
    document.querySelectorAll('.sub-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.sub-tab-content').forEach(c => c.classList.add('hidden'));
            
            e.currentTarget.classList.add('active');
            const targetId = e.currentTarget.dataset.target;
            const targetContent = document.getElementById(targetId);
            if(targetContent) targetContent.classList.remove('hidden');
        });
    });

    // アコーディオン制御
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (this.classList.contains('active')) {
                // 開く処理
                const src = this.dataset.src;
                // コンテンツが空で、かつsrc属性がある場合のみiframe生成
                if(src && content.innerHTML.trim() === "") {
                   content.innerHTML = `<iframe src="${src}" style="width:100%; height:400px; border:none;" loading="lazy"></iframe>`;
                }
                content.style.display = "block";
            } else {
                // 閉じる処理
                content.style.display = "none";
            }
        });
    });

    // --- ロジック関数 ---

    // 設定ロード
    function loadSaveSettings() {
        saveSettings = {
            theme: localStorage.getItem(SAVE_KEYS.THEME) === 'true',
            mainTab: localStorage.getItem(SAVE_KEYS.MAIN_TAB) || 'all-apps',
        };
        if (localStorage.getItem(SAVE_KEYS.THEME) === null) saveSettings.theme = false;
        
        // 互換性対応
        if (saveSettings.mainTab === 'true') saveSettings.mainTab = 'all-apps';

        const favData = localStorage.getItem(SAVE_KEYS.FAVORITES);
        favoriteIds = favData ? JSON.parse(favData) : [];
    }

    function getSavedItem(key) {
        if (key === SAVE_KEYS.THEME) return saveSettings.theme;
        if (key === SAVE_KEYS.MAIN_TAB) return saveSettings.mainTab;
        if (key === SAVE_KEYS.RECENTLY_USED) return localStorage.getItem(key);
        return null; 
    }

    function saveItem(key, value) {
        if (key === SAVE_KEYS.THEME) localStorage.setItem(key, value);
        else if (key === SAVE_KEYS.MAIN_TAB) localStorage.setItem(key, value);
        else if (key === SAVE_KEYS.RECENTLY_USED) localStorage.setItem(key, value);
        else if (key === SAVE_KEYS.FAVORITES) localStorage.setItem(key, value);
    }

    // アプリデータ準備
    function loadAppData() { 
        try { 
            // Deep copy
            appData = JSON.parse(JSON.stringify(initialAppData));
            // お気に入り情報のマージ
            appData.forEach(app => {
                app.isFavorite = favoriteIds.includes(app.id);
            });
        } catch(e) { 
            appData = JSON.parse(JSON.stringify(initialAppData)); 
        } 
    }

    // タブ切り替えロジック
    function activateTabLogic(tabName) {
        currentActiveTab = tabName;
        saveItem(SAVE_KEYS.MAIN_TAB, tabName);

        // タブボタンのスタイル更新（activeクラスの付け替え）
        document.querySelectorAll('.tab-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeTabBtn = document.getElementById(`tab-${tabName}`);
        if(activeTabBtn) activeTabBtn.classList.add('active');

        // コンテンツエリアの表示切替
        mainGrid.classList.add('hidden');
        bustarainContainer.classList.add('hidden');
        optionContainer.classList.add('hidden');
        fyContainer.classList.add('hidden');

        if (tabName === 'all-apps') {
            mainGrid.classList.remove('hidden');
            renderAllIcons(); // 再描画でお気に入り状態を反映
        } else if (tabName === 'bustarain') {
            bustarainContainer.classList.remove('hidden');
        } else if (tabName === 'option') {
            optionContainer.classList.remove('hidden');
        } else if (tabName === 'fy') {
            fyContainer.classList.remove('hidden');
            renderFavoritesTab();
        }
        
        // 検索ボックスリセット
        searchInput.value = '';
        clearSearchBtn.classList.add('hidden');
        filterContent();
    }

    // お気に入り切替ロジック
    function toggleFavoriteLogic(e, appId) {
        e.preventDefault();
        e.stopPropagation();

        if (favoriteIds.includes(appId)) {
            favoriteIds = favoriteIds.filter(id => id !== appId);
        } else {
            favoriteIds.push(appId);
        }
        saveItem(SAVE_KEYS.FAVORITES, JSON.stringify(favoriteIds));

        // データ更新
        const app = appData.find(a => a.id === appId);
        if (app) {
            app.isFavorite = favoriteIds.includes(appId);
        }

        // 画面更新
        if (currentActiveTab === 'fy') {
            renderFavoritesTab(); // お気に入りタブならリストから消す
        } else {
            renderAllIcons(); // Appsタブなら星の色を変える
        }
        renderRecentlyUsed();
    }

    // 最近使用したアプリ
    function getRecentlyUsed() {
        const data = getSavedItem(SAVE_KEYS.RECENTLY_USED);
        return data ? JSON.parse(data) : [];
    }

    function addRecentlyUsed(appId) {
        let recentlyUsed = getRecentlyUsed();
        recentlyUsed = recentlyUsed.filter(id => id !== appId);
        recentlyUsed.unshift(appId);
        if (recentlyUsed.length > MAX_RECENTLY_USED) {
            recentlyUsed.pop();
        }
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
                // 最近使用した欄では星を表示しない設定(false)
                const iconElement = createIconElement(app, false); 
                iconElement.querySelector('a').addEventListener('click', () => {
                    addRecentlyUsed(app.id);
                });
                recentlyUsedGridContainer.appendChild(iconElement);
            }
        });
    }

    // 全アプリアイコン描画
    function renderAllIcons() {
        gridContainer.innerHTML = '';
        appData.forEach(app => {
            const el = createIconElement(app, true);
            el.querySelector('a').addEventListener('click', () => addRecentlyUsed(app.id));
            gridContainer.appendChild(el);
        });
    }

    // FYタブ描画
    function renderFavoritesTab() {
        fyContentArea.innerHTML = '';
        const favApps = appData.filter(app => app.isFavorite);

        if (favApps.length === 0) {
            fyContentArea.innerHTML = '<p style="text-align:center; width:100%; color:#888; margin-top:20px;">お気に入りは登録されていません。<br>Appsタブの☆マークを押して追加できます。</p>';
            return;
        }

        favApps.forEach(app => {
            const el = createIconElement(app, true);
            el.querySelector('a').addEventListener('click', () => addRecentlyUsed(app.id));
            fyContentArea.appendChild(el);
        });
    }

    // アイコンDOM生成
    function createIconElement(app, showStar = true) {
        const item = document.createElement('div');
        item.className = `icon-item search-item`; 
        item.dataset.id = app.id;
        item.dataset.searchText = app.searchText;
        
        const link = document.createElement('a');
        link.href = app.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.style.width = "100%";
        link.style.height = "100%";
        link.style.display = "flex";
        link.style.flexDirection = "column";
        link.style.alignItems = "center";
        link.style.justifyContent = "center";
        
        link.innerHTML = `
            <div class="icon-img-wrapper">
                <img src="${app.icon}" alt="${app.label}" loading="lazy" onerror="this.src='favicon.ico';">
            </div>
            <span class="label-text">${app.label}</span>
        `;
        
        item.appendChild(link);

        // お気に入りスター
        if (showStar) {
            const star = document.createElement('i');
            // CSSで右上(top, right)に配置済
            star.className = app.isFavorite ? 'fas fa-star favorite-btn active' : 'far fa-star favorite-btn';
            star.onclick = (e) => toggleFavoriteLogic(e, app.id);
            item.appendChild(star);
        }

        return item;
    }

    // 検索機能
    function filterContent() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query.length > 0) {
            clearSearchBtn.classList.remove('hidden');
        } else {
            clearSearchBtn.classList.add('hidden');
        }

        let targets = [];
        // 現在のタブに応じて検索対象を変更
        if (currentActiveTab === 'all-apps') {
             // 検索中は「最近使用した項目」を隠して、全アプリのみ対象にする
             recentlyUsedContainer.classList.add('hidden'); 
             sectionDivider.classList.add('hidden');
             targets = gridContainer.querySelectorAll('.search-item');
        } else if (currentActiveTab === 'fy') {
             targets = fyContentArea.querySelectorAll('.search-item');
        }

        if (targets.length > 0) {
            targets.forEach(item => {
                const text = item.dataset.searchText ? item.dataset.searchText.toLowerCase() : '';
                if (text.includes(query)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        }
        
        // 検索クリア時の復帰処理
        if (query.length === 0 && currentActiveTab === 'all-apps') {
            const hasRecently = getRecentlyUsed().length > 0;
            if(hasRecently){
                recentlyUsedContainer.classList.remove('hidden');
                sectionDivider.classList.remove('hidden');
            }
        }
    }

    // テーマ設定
    function setThemeLogic(mode) {
        if (mode === 'light') {
            document.body.classList.remove('dark-theme');
            saveSettings.theme = false;
        } else {
            document.body.classList.add('dark-theme');
            saveSettings.theme = true;
        }
        saveItem(SAVE_KEYS.THEME, saveSettings.theme);
    }

    function initTheme() {
        if (saveSettings.theme) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    // 時計・カウントダウン
    function startClock() {
        const dateEl = document.getElementById('date');
        const clockEl = document.getElementById('clock');
        const countdownEl = document.getElementById('countdown');
        const offlineEl = document.getElementById('offline-status');

        function update() {
            const now = new Date();
            
            // 日付
            const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
            if(dateEl) dateEl.textContent = now.toLocaleDateString('ja-JP', options);
            
            // 時計
            if(clockEl) clockEl.textContent = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            // オフライン判定
            if(offlineEl) {
                if(!navigator.onLine) {
                    offlineEl.textContent = "Offline";
                    offlineEl.style.color = "red";
                    offlineEl.style.marginLeft = "10px";
                    offlineEl.style.fontWeight = "bold";
                } else {
                    offlineEl.textContent = "";
                }
            }
            
            // カウントダウン
            if(countdownEl) updateCountdown(now, countdownEl);
        }

        setInterval(update, 1000);
        update();
    }

    function updateCountdown(now, el) {
        const currentTime = now.getHours() * 60 + now.getMinutes();
        let nextEvent = null;

        for (let item of schedule) {
            const [sh, sm] = item.start.split(':').map(Number);
            const [eh, em] = item.end.split(':').map(Number);
            const startM = sh * 60 + sm;
            const endM = eh * 60 + em;

            if (currentTime < startM) {
                nextEvent = { name: item.name, time: startM, type: '開始' };
                break;
            }
            if (currentTime < endM) {
                nextEvent = { name: item.name, time: endM, type: '終了' };
                break;
            }
        }

        if (nextEvent) {
            const diff = nextEvent.time - currentTime;
            el.innerHTML = `${nextEvent.name}${nextEvent.type}まで <span style="font-weight:bold; color:#007bff; margin-left:3px;">${diff}分</span>`;
        } else {
            el.textContent = "本日の予定は終了しました";
        }
    }
});
