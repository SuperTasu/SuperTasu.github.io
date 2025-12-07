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
    const speedTestRefreshButton = document.getElementById('speed-test-refresh-button');

    // --- データ定義 ---
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

    const initialAppData = [
        {id:1,label:"Google",url:"https://www.google.com",icon:"https://www.google.com/favicon.ico",searchText:"Google グーグル"},
        {id:2,label:"Gmail",url:"https://mail.google.com",icon:"https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",searchText:"Gmail Google Mail メール"},
        {id:35,label:"Chat",url:"https://chat.google.com",icon:"https://ssl.gstatic.com/dynamite/images/favicon/chat_2020q4_192.png",searchText:"Google Chat チャット"},
        {id:3,label:"Calendar",url:"https://calendar.google.com",icon:"https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_3_2x.png",searchText:"Google Calendar カレンダー"},
        {id:4,label:"Photos",url:"https://photos.google.com",icon:"https://ssl.gstatic.com/images/branding/product/1x/photos_48dp.png",searchText:"Google Photos フォト 写真"},
        {id:5,label:"Drive",url:"https://drive.google.com",icon:"https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png",searchText:"Google Drive ドライブ"},
        {id:33,label:"Google Sites",url:"https://sites.google.com/new",icon:"https://ssl.gstatic.com/images/branding/product/1x/sites_48dp.png",searchText:"Google Sites サイト作成"},
        {id:44,label:"Docs",url:"https://docs.google.com/document/u/0/",icon:"https://ssl.gstatic.com/docs/documents/images/kix-favicon-2023q4.ico",searchText:"Google Documents ドキュメント"},
        {id:45,label:"Analytics",url:"https://analytics.google.com/analytics/web/",icon:"https://www.google.com/analytics/favicon.ico",searchText:"Google Analytics アナリティクス"},
        {id:46,label:"App Script",url:"https://script.google.com/home",icon:"https://ssl.gstatic.com/script/images/favicon.png",searchText:"Google App Script GAS"},
        {id:47,label:"Google翻訳",url:"https://translate.google.co.jp/",icon:"https://www.google.com/images/icons/product/translate-32.png",searchText:"Google Translate 翻訳"},
        {id:40,label:"Family Club",url:"https://www.fc-member.familyclub.jp",icon:"https://www.familyclub.jp/img/common/favicon.ico",searchText:"Family Club ファンクラブ"},
        {id:38,label:"SixTONES",url:"https://www.sixtones.jp",icon:"https://www.sixtones.jp/favicon.ico",searchText:"SixTONES ジャニーズ"},
        {id:39,label:"ART-PUT",url:"https://art-put.com",icon:"https://art-put.com/favicon.ico",searchText:"ART-PUT アート"},
        {id:42,label:"Number i",url:"https://tobe-official.jp/artists/number_i",icon:"https://tobe-official.jp/favicon.ico",searchText:"Number i tobe"},
        {id:41,label:"H. Kitayama",url:"https://tobe-official.jp/artists/hiromitsukitayama",icon:"https://tobe-official.jp/favicon.ico",searchText:"Hiromitsu Kitayama tobe"},
        {id:22,label:"ChatGPT",url:"https://chatgpt.com",icon:"https://chat.openai.com/favicon.ico",searchText:"ChatGPT AI"},
        {id:24,label:"Claude AI",url:"https://claude.ai",icon:"https://claude.ai/favicon.ico",searchText:"Claude AI クロード"},
        {id:23,label:"Google AI",url:"https://aistudio.google.com/prompts/new_chat",icon:"https://aistudio.google.com/favicon.ico",searchText:"Google AI Studio Gemini"},
        {id:75,label:"Perplexity",url:"https://www.perplexity.ai",icon:"https://www.perplexity.ai/favicon.ico",searchText:"Perplexity AI パープレキシティ"},
        {id:76,label:"Gemini",url:"https://gemini.google.com/app",icon:"https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030da8.png",searchText:"Google Gemini ジェミニ"},
        {id:77,label:"Copilot",url:"https://copilot.microsoft.com",icon:"https://copilot.microsoft.com/favicon.ico",searchText:"Microsoft Copilot コパイロット Bing"},
        {id:7,label:"X",url:"https://x.com/i/timeline",icon:"https://x.com/favicon.ico",searchText:"X Twitter ツイッター"},
        {id:8,label:"Instagram",url:"https://www.instagram.com",icon:"https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png",searchText:"Instagram インスタグラム"},
        {id:9,label:"YouTube",url:"https://www.youtube.com/feed/subscriptions",icon:"https://www.youtube.com/favicon.ico",searchText:"YouTube ユーチューブ"},
        {id:10,label:"YT Shorts",url:"https://www.youtube.com/feed/subscriptions/shorts",icon:"https://www.youtube.com/favicon.ico",searchText:"YT Shorts YouTube ショート"},
        {id:12,label:"TikTok",url:"https://www.tiktok.com",icon:"https://www.tiktok.com/favicon.ico",searchText:"TikTok ティックトック"},
        {id:13,label:"Twitch",url:"https://www.twitch.tv",icon:"https://www.twitch.tv/favicon.ico",searchText:"Twitch ツイッチ"},
        {id:15,label:"Discord",url:"https://discord.com/channels/@me",icon:"https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg",searchText:"Discord ディスコード"},
        {id:14,label:"Abema",url:"https://abema.tv/",icon:"https://abema.tv/favicon.ico",searchText:"Abema アベマ"},
        {id:16,label:"Spotify",url:"https://open.spotify.com/intl-ja",icon:"https://open.spotify.com/favicon.ico",searchText:"Spotify スポティファイ"},
        {id:36,label:"U-NEXT",url:"https://video.unext.jp/",icon:"https://video.unext.jp/favicon.ico",searchText:"U-NEXT ユーネクスト"},
        {id:71,label:"Pinterest",url:"https://jp.pinterest.com",icon:"https://jp.pinterest.com/favicon.ico",searchText:"Pinterest ピンタレスト 画像"},
        {id:57,label:"Apex Status",url:"https://apexlegendsstatus.com/current-map",icon:"https://apexlegendsstatus.com/favicon-32x32.png",searchText:"Apex Legends Status"},
        {id:58,label:"Splatoon Map",url:"https://www.splatoon3-schedule.net",icon:"https://www.splatoon3-schedule.net/favicon.ico",searchText:"Splatoon 3 スプラトゥーン マップ"},
        {id:59,label:"Splatoon Note",url:"https://support.nintendo.com/jp/switch/software_support/av5ja/1010.html",icon:"https://support.nintendo.com/favicon.ico",searchText:"Splatoon 3 パッチノート"},
        {id:60,label:"MKBuilder",url:"https://mk8dxbuilder.com",icon:"https://mk8dxbuilder.com/favicon.ico",searchText:"MK8DX Builder マリオカート"},
        {id:61,label:"MK Lounge",url:"https://lounge.mkcentral.com/mk8dx",icon:"https://lounge.mkcentral.com/favicon.ico",searchText:"MK8DX Lounge Status"},
        {id:62,label:"MK Blog",url:"https://japan-mk.blog.jp",icon:"https://japan-mk.blog.jp/favicon.ico",searchText:"MK Blog マリオカート"},
        {id:63,label:"MK Central",url:"https://mkcentral.com/en-us",icon:"https://mkcentral.com/favicon.ico",searchText:"MK Central"},
        {id:64,label:"MK Overlay",url:"https://statsoverlay.prismillon.com/",icon:"https://statsoverlay.prismillon.com/assets/icon.png",searchText:"MK8DX Overlay"},
        {id:65,label:"MK8DX Note",url:"https://support-jp.nintendo.com/app/answers/detail/a_id/34464",icon:"https://support.nintendo.com/favicon.ico",searchText:"MK8DX パッチノート"},
        {id:66,label:"MKWD Note",url:"https://support.nintendo.com/jp/switch2/software_support/aaaaa/index.html",icon:"https://support.nintendo.com/favicon.ico",searchText:"MKWD パッチノート"},
        {id:17,label:"Y2mate",url:"https://www-y2mate.com/ja23/",icon:"https://www-y2mate.com/themes/images/logo_y2mate.png",searchText:"y2mate ダウンロード"},
        {id:18,label:"SpotiDown",url:"https://spotidownloader.com/jp",icon:"https://spotidownloader.com/favicon.ico",searchText:"Spotify Downloader ダウンロード"},
        {id:19,label:"SpotiMate",url:"https://spotimate.io/",icon:"https://spotimate.io/favicon.ico",searchText:"Spotify mate ダウンロード"},
        {id:6,label:"Yahoo!",url:"https://www.yahoo.co.jp",icon:"https://www.yahoo.co.jp/favicon.ico",searchText:"Yahoo! ヤフー"},
        {id:48,label:"知恵袋",url:"https://chiebukuro.yahoo.co.jp/notification",icon:"https://s.yimg.jp/c/icon/s/bsc/2.0/favicon.ico",searchText:"Yahoo 知恵袋"},
        {id:11,label:"Remote It",url:"https://app.remote.it",icon:"https://app.remote.it/favicon.ico",searchText:"Remote It リモート"},
        {id:20,label:"神戸市交通局",url:"https://kotsu.city.kobe.lg.jp/",icon:"https://kotsu.city.kobe.lg.jp/common/img/favicon.ico",searchText:"神戸市交通局 地下鉄 バス"},
        {id:21,label:"GigaFile",url:"https://gigafile.nu/",icon:"https://gigafile.nu/favicon.ico",searchText:"GigaFile ギガファイル便"},
        {id:49,label:"Deepl翻訳",url:"https://www.deepl.com/translator",icon:"https://www.deepl.com/img/favicon/deepl_favicon_32x32.png",searchText:"Deepl 翻訳"},
        {id:25,label:"BUSTARAIN",url:"https://sites.google.com/view/bustar/home",icon:"https://sites.google.com/favicon.ico",searchText:"BUSTARAIN バスタレイン"},
        {id:26,label:"Answer I",url:"https://sites.google.com/view/answer-i/home",icon:"https://sites.google.com/favicon.ico",searchText:"Answer I アンサー"},
        {id:27,label:"Rawkuro",url:"https://rawkuro.net/manga/bururokku004/di285hua",icon:"https://rawkuro.net/favicon.ico",searchText:"Rawkuro ブルーロック 漫画"},
        {id:28,label:"Manga4U",url:"https://mn4u.net/tgm-84/",icon:"https://mn4u.net/favicon.ico",searchText:"MN4U ブルーロック 漫画"},
        {id:29,label:"マガポケ",url:"https://pocket.shonenmagazine.com/title/00617/episode/426754",icon:"https://kmanga.kodansha.com/favicon.ico",searchText:"講談社 ブルーロック 漫画"},
        {id:30,label:"メルカリ",url:"https://www.mercari.com/jp/",icon:"https://mercari.com/favicon.ico",searchText:"メルカリ フリマ"},
        {id:31,label:"Yahoo!フリマ",url:"https://paypayfleamarket.yahoo.co.jp/",icon:"https://paypayfleamarket.yahoo.co.jp/favicon.ico",searchText:"Yahoo!フリマ ヤフー"},
        {id:37,label:"Amazon",url:"https://www.amazon.co.jp/",icon:"https://www.amazon.co.jp/favicon.ico",searchText:"Amazon アマゾン"},
        {id:32,label:"ヤマト運輸",url:"https://www.kuronekoyamato.co.jp/",icon:"https://www.kuronekoyamato.co.jp/favicon.ico",searchText:"ヤマト運輸 宅急便"},
        {id:34,label:"GitHub",url:"https://github.com",icon:"https://github.com/favicon.ico",searchText:"GitHub ギットハブ"},
        {id:43,label:"AMEFURASSHI",url:"https://amefurasshi.jp",icon:"https://amefurasshi.jp/wp-content/themes/amefurasshi/assets/images/favicon.ico",searchText:"AMEFURASSHI"},
        {id:50,label:"画像圧縮",url:"https://www.iloveimg.com/ja/compress-image",icon:"https://www.iloveimg.com/img/favicons/favicon-32x32.png",searchText:"iloveimg compress"},
        {id:51,label:"PDF圧縮",url:"https://www.ilovepdf.com/ja/compress_pdf",icon:"https://www.ilovepdf.com/img/favicons/favicon-32x32.png",searchText:"ilovepdf compress"},
        {id:52,label:"enHack",url:"https://enhack.app/app/#!/index/you/home/",icon:"https://enhack.app/favicon.ico",searchText:"enHack"},
        {id:53,label:"Scribd",url:"https://www.scribd.com",icon:"https://www.scribd.com/favicon.ico",searchText:"Scribd"},
        {id:54,label:"背景透過",url:"https://www.iloveimg.com/ja/remove-background",icon:"https://www.iloveimg.com/img/favicons/favicon-32x32.png",searchText:"iloveimg remove background"},
        {id:55,label:"便利ツール",url:"https://jp.piliapp.com",icon:"https://jp.piliapp.com/favicon.ico",searchText:"piliapp 工具"},
        {id:56,label:"QR作成",url:"https://qr.quel.jp/url.php",icon:"https://qr.quel.jp/favicon.ico",searchText:"QRコード作成 quel"},
        {id:67,label:"方眼ノート",url:"https://houganshi.net/note.php",icon:"https://houganshi.net/favicon.ico",searchText:"ノート作成 houganshi"},
        {id:68,label:"マナビジョン",url:"https://manabi.benesse.ne.jp",icon:"https://manabi.benesse.ne.jp/favicon.ico",searchText:"Benesse ベネッセ"},
        {id:69, label:"兵庫県警報・注意報", url:"https://weathernews.jp/onebox/warn/hyogo/2810000/", icon:"https://weathernews.jp/favicon.ico", searchText:"警報 注意報 天気 兵庫 weathernews"},
        {id:70, label:"文字数カウント", url:"https://sundryst.com/convenienttool/strcount.html", icon:"https://sundryst.com/favicon.ico", searchText:"文字数 カウント tool"},
        {id:72,label:"UKARO",url:"https://www.ucaro.net",icon:"https://www.ucaro.net/favicon.ico",searchText:"UKARO ウカロ 受験 大学"},
        {id:73,label:"Wordpress",url:"https://wordpress.com/home/answeri.wordpress.com",icon:"https://s1.wp.com/i/favicon.ico",searchText:"Wordpress ワードプレス ブログ answeri"},
        {id:74,label:"受かる英語",url:"https://ukaru-eigo.com",icon:"https://ukaru-eigo.com/favicon.ico",searchText:"受かる英語 英語学習"},
        {id:78,label:"背景透過2",url:"https://www.remove.bg/ja",icon:"https://www.remove.bg/favicon.ico",searchText:"remove.bg 背景透過 removebg"},
        {id:79,label:"Microsoft Form",url:"https://forms.cloud.microsoft/Pages/DesignPageV2.aspx?origin=Marketing",icon:"https://forms.office.com/favicon.ico",searchText:"Microsoft Forms フォーム アンケート"},
        {id:80,label:"PDF圧縮2",url:"https://tools.pdf24.org/ja/compress-pdf",icon:"https://tools.pdf24.org/favicon.ico",searchText:"PDF24 compress 圧縮"},
        {id:81,label:"画像アッシュクマ",url:"https://imguma.com/",icon:"https://imguma.com/favicon.ico",searchText:"imguma アッシュクマ 画像圧縮"},
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

    // --- CSS注入 ---
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        .icon-item {
            position: relative;
        }
        /* お気に入りボタンを右上に配置 */
        .favorite-btn {
            position: absolute;
            top: 5px; /* bottomからtopへ変更 */
            right: 5px;
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
        /* アクティブタブの強調表示 */
        .tab-item.active {
            background-color: #007bff;
            color: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.15);
        }
        .tab-item.active i {
            color: white !important; /* アイコンも白く */
        }
        body.dark-theme .tab-item.active {
            background-color: #0056b3;
        }
    `;
    document.head.appendChild(styleElement);

    // --- 初期化処理 ---
    loadSaveSettings();
    loadAppData();
    initTheme();
    
    // 初期タブのアクティブ化
    const savedTab = getSavedItem(SAVE_KEYS.MAIN_TAB) || 'all-apps';
    activateTab(savedTab);
    
    renderRecentlyUsed();
    renderAllIcons();
    startClock();

    // --- イベントリスナー ---
    refreshButton.addEventListener('click', () => location.reload());
    
    if (speedTestRefreshButton) {
        speedTestRefreshButton.addEventListener('click', () => {
            const iframe = document.querySelector('.header-speed-test iframe');
            if(iframe) iframe.src = iframe.src;
        });
    }

    searchInput.addEventListener('input', filterContent);
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterContent();
    });

    // Bustarainサブタブ
    document.querySelectorAll('.sub-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.sub-tab-content').forEach(c => c.classList.add('hidden'));
            
            e.currentTarget.classList.add('active');
            const targetId = e.currentTarget.dataset.target;
            document.getElementById(targetId).classList.remove('hidden');
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
                if(src && !content.hasChildNodes()) {
                   // iframeをロード (data-srcがURLの場合)
                   // もしくは、サイト内のiframeを表示するロジック
                   content.innerHTML = `<iframe src="${src}" style="width:100%; height:400px; border:none;"></iframe>`;
                }
                content.style.maxHeight = content.scrollHeight + "px"; // 簡易的な高さアニメーション
                content.style.display = "block";
            } else {
                // 閉じる処理
                content.style.display = "none";
            }
        });
    });

    // --- 関数定義 ---

    // 設定ロード
    function loadSaveSettings() {
        saveSettings = {
            theme: localStorage.getItem(SAVE_KEYS.THEME) === 'true',
            mainTab: localStorage.getItem(SAVE_KEYS.MAIN_TAB) || 'all-apps',
        };
        if (localStorage.getItem(SAVE_KEYS.THEME) === null) saveSettings.theme = false;
        
        // 古い形式対応
        if (saveSettings.mainTab === 'true') saveSettings.mainTab = 'all-apps';
        if (saveSettings.mainTab === 'false') saveSettings.mainTab = 'all-apps';

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
            appData = JSON.parse(JSON.stringify(initialAppData));
            appData.forEach(app => {
                app.isFavorite = favoriteIds.includes(app.id);
            });
        } catch(e) { 
            appData = JSON.parse(JSON.stringify(initialAppData)); 
        } 
    }

    // タブ切り替え
    window.activateTab = function(tabName) {
        currentActiveTab = tabName;
        saveItem(SAVE_KEYS.MAIN_TAB, tabName);

        // タブメニューの見た目更新 (強調表示)
        document.querySelectorAll('.tab-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeTabBtn = document.getElementById(`tab-${tabName}`);
        if(activeTabBtn) activeTabBtn.classList.add('active');

        // コンテンツ表示切替
        mainGrid.style.display = 'none';
        bustarainContainer.style.display = 'none';
        optionContainer.style.display = 'none';
        fyContainer.style.display = 'none';

        if (tabName === 'all-apps') {
            mainGrid.style.display = 'block';
            renderAllIcons();
        } else if (tabName === 'bustarain') {
            bustarainContainer.style.display = 'block';
        } else if (tabName === 'option') {
            optionContainer.style.display = 'block';
        } else if (tabName === 'fy') {
            fyContainer.style.display = 'block';
            renderFavoritesTab();
        }
        
        // 検索状態をリセットまたは再適用
        searchInput.value = '';
        clearSearchBtn.classList.add('hidden');
        filterContent();
    };

    // お気に入り機能
    window.toggleFavorite = function(e, appId) {
        e.preventDefault();
        e.stopPropagation();

        if (favoriteIds.includes(appId)) {
            favoriteIds = favoriteIds.filter(id => id !== appId);
        } else {
            favoriteIds.push(appId);
        }
        saveItem(SAVE_KEYS.FAVORITES, JSON.stringify(favoriteIds));

        // appData更新
        const app = appData.find(a => a.id === appId);
        if (app) {
            app.isFavorite = favoriteIds.includes(appId);
        }

        // 表示更新
        if (currentActiveTab === 'fy') {
            renderFavoritesTab();
        } else if (currentActiveTab === 'all-apps') {
            renderAllIcons(); 
        }
        renderRecentlyUsed(); // 最近使用した項目のお気に入り状態も更新
    };

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
                // 最近使用した項目ではスターを表示するかは任意ですが、ここでは表示しない設定にします
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
            fyContentArea.innerHTML = '<p style="text-align:center; width:100%; color:#888; margin-top:20px;">お気に入りはまだ登録されていません。<br>Appsタブの☆ボタンで追加できます。</p>';
            return;
        }

        favApps.forEach(app => {
            const el = createIconElement(app, true);
            el.querySelector('a').addEventListener('click', () => addRecentlyUsed(app.id));
            fyContentArea.appendChild(el);
        });
    }

    // アイコン要素作成 (途切れていた部分を補完)
    function createIconElement(app, showStar = true) {
        const item = document.createElement('div');
        item.className = `icon-item search-item`; 
        item.dataset.id = app.id;
        item.dataset.searchText = app.searchText;
        
        const link = document.createElement('a');
        link.href = app.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        
        // アイコン画像とテキスト
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
            // クラスに favorite-btn を付与 (CSSで右上配置)
            star.className = app.isFavorite ? 'fas fa-star favorite-btn active' : 'far fa-star favorite-btn';
            star.onclick = (e) => toggleFavorite(e, app.id);
            item.appendChild(star);
        }

        return item;
    }

    // 検索フィルタリング
    function filterContent() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query.length > 0) {
            clearSearchBtn.classList.remove('hidden');
        } else {
            clearSearchBtn.classList.add('hidden');
        }

        // 現在表示されているコンテナ内のsearch-itemを対象にする
        // ただしBustarainやOption内は構造が違うため、主にAppsとFYを対象とする
        let targets = [];
        if (currentActiveTab === 'all-apps') {
             // 最近使用した項目は検索時は隠す、または検索対象にする
             // ここでは全アプリのみ検索対象として表示
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
        
        // 検索クリア時に最近使用した項目を復帰
        if (query.length === 0 && currentActiveTab === 'all-apps') {
            const hasRecently = getRecentlyUsed().length > 0;
            if(hasRecently){
                recentlyUsedContainer.classList.remove('hidden');
                sectionDivider.classList.remove('hidden');
            }
        }
    }

    // テーマ設定
    window.setTheme = function(mode) {
        if (mode === 'light') {
            document.body.classList.remove('dark-theme');
            saveSettings.theme = false;
        } else {
            document.body.classList.add('dark-theme');
            saveSettings.theme = true;
        }
        saveItem(SAVE_KEYS.THEME, saveSettings.theme);
    };

    function initTheme() {
        if (saveSettings.theme) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    // 時計機能
    function startClock() {
        const dateEl = document.getElementById('date');
        const clockEl = document.getElementById('clock');
        const countdownEl = document.getElementById('countdown');
        const offlineEl = document.getElementById('offline-status');

        function update() {
            const now = new Date();
            
            // 日付
            const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
            if(dateEl) dateEl.textContent = now.toLocaleDateString('ja-JP', options);
            
            // 時計
            if(clockEl) clockEl.textContent = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            // オフライン判定
            if(offlineEl) {
                if(!navigator.onLine) {
                    offlineEl.textContent = "Offline";
                    offlineEl.style.color = "red";
                } else {
                    offlineEl.textContent = "";
                }
            }
            
            // カウントダウン (次のチャイムまで)
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
            el.innerHTML = `${nextEvent.name}${nextEvent.type}まで <span style="font-weight:bold; color:#007bff;">${diff}分</span>`;
        } else {
            el.textContent = "本日の予定は終了しました";
        }
    }
});
