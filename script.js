const mainGrid = document.getElementById('main-grid');
const statusContainer = document.getElementById('status-container');
const bustarainContainer = document.getElementById('bustarain-container');
const gridContainer = document.getElementById('gridContainer');
const refreshButton = document.getElementById('refresh-button');

const schedule=[{name:"1限",start:"08:50",end:"09:40"},{name:"休憩",start:"09:40",end:"09:50"},{name:"2限",start:"09:50",end:"10:40"},{name:"休憩",start:"10:40",end:"10:50"},{name:"3限",start:"10:50",end:"11:40"},{name:"休憩",start:"11:40",end:"11:50"},{name:"4限",start:"11:50",end:"12:40"},{name:"昼休み",start:"12:40",end:"13:20"},{name:"5限",start:"13:20",end:"14:10"},{name:"休憩",start:"14:10",end:"14:20"},{name:"6限",start:"14:20",end:"15:10"},{name:"休憩",start:"15:10",end:"15:20"},{name:"7限",start:"15:20",end:"16:10"},{name:"休憩",start:"16:10",end:"16:40"},{name:"8限",start:"16:40",end:"17:30"},{name:"休憩",start:"17:30",end:"17:40"},{name:"9限",start:"17:40",end:"18:30"}];
let appData = [];
const initialAppData = [
    // --- Favorite Category ---
    {id:40,label:"Family Club",url:"https://fc-securesignon.familyclub.jp",category:"favorite",searchText:"Family Club ファンクラブ"},
    {id:38,label:"SixTONES",url:"https://www.sixtones.jp",category:"favorite",searchText:"SixTONES ジャニーズ"},
    {id:39,label:"ART-PUT",url:"https://art-put.com",category:"favorite",searchText:"ART-PUT アート"},
    {id:42,label:"Number i",url:"https://tobe-official.jp/artists/number_i",category:"favorite",searchText:"Number i tobe"},
    {id:41,label:"H. Kitayama",url:"https://tobe-official.jp/artists/hiromitsukitayama",category:"favorite",searchText:"Hiromitsu Kitayama tobe"},

    // --- AI Category ---
    {id:22,label:"ChatGPT",url:"https://chatgpt.com",category:"ai",searchText:"ChatGPT AI"},
    {id:24,label:"Claude AI",url:"https://claude.ai",category:"ai",searchText:"Claude AI クロード"},
    {id:23,label:"Google AI",url:"https://aistudio.google.com/prompts/new_chat",category:"ai",searchText:"Google AI Gemini"},
    
    // --- Google Category ---
    {id:1,label:"Google",url:"https://www.google.com",category:"google",searchText:"Google グーグル"},
    {id:2,label:"Gmail",url:"https://mail.google.com",category:"google",searchText:"Gmail Google Mail メール"},
    {id:35,label:"Chat",url:"https://chat.google.com",category:"google",searchText:"Google Chat チャット"},
    {id:3,label:"Calendar",url:"https://calendar.google.com",category:"google",searchText:"Google Calendar カレンダー"},
    {id:4,label:"Photos",url:"https://photos.google.com",category:"google",searchText:"Google Photos フォト 写真"},
    {id:5,label:"Drive",url:"https://drive.google.com",category:"google",searchText:"Google Drive ドライブ"},
    {id:33,label:"Google Sites",url:"https://sites.google.com/new",category:"google",searchText:"Google Sites サイト作成"},
    {id:44,label:"Docs",url:"https://docs.google.com/document/u/0/",category:"google",searchText:"Google Documents ドキュメント"},
    {id:45,label:"Analytics",url:"https://analytics.google.com/analytics/web/",category:"google",searchText:"Google Analytics アナリティクス"},
    {id:46,label:"App Script",url:"https://script.google.com/home",category:"google",searchText:"Google App Script GAS"},
    {id:47,label:"Google翻訳",url:"https://translate.google.co.jp/",category:"google",searchText:"Google Translate 翻訳"},
    
    // --- SNS Category ---
    {id:7,label:"X",url:"https://x.com/i/timeline",category:"sns",searchText:"X Twitter ツイッター"},
    {id:8,label:"Instagram",url:"https://www.instagram.com",category:"sns",searchText:"Instagram インスタグラム"},
    {id:9,label:"YouTube",url:"https://www.youtube.com/feed/subscriptions",category:"sns",searchText:"YouTube ユーチューブ"},
    {id:10,label:"YT Shorts",url:"https://www.youtube.com/feed/subscriptions/shorts",category:"sns",searchText:"YT Shorts YouTube ショート"},
    {id:12,label:"TikTok",url:"https://www.tiktok.com",category:"sns",searchText:"TikTok ティックトック"},
    {id:13,label:"Twitch",url:"https://www.twitch.tv",category:"sns",searchText:"Twitch ツイッチ"},
    {id:15,label:"Discord",url:"https://discord.com/channels/@me",category:"sns",searchText:"Discord ディスコード"},
    
    // --- Game Category ---
    {id:57,label:"Apex Status",url:"https://apexlegendsstatus.com/current-map",category:"game",searchText:"Apex Legends Status", gameTitle: "Apex Legends"},
    {id:58,label:"Splatoon Map",url:"https://www.splatoon3-schedule.net",category:"game",searchText:"Splatoon 3 スプラトゥーン マップ", gameTitle: "Splatoon3"},
    {id:59,label:"パッチノート",url:"https://support.nintendo.com/jp/switch/software_support/av5ja/1010.html",category:"game",searchText:"Splatoon 3 パッチノート", gameTitle: "Splatoon3"},
    {id:60,label:"MKBuilder",url:"https://mk8dxbuilder.com",category:"game",searchText:"MK8DX Builder マリオカート", gameTitle: "MK8DX"},
    {id:61,label:"MK Lounge",url:"https://lounge.mkcentral.com/mk8dx",category:"game",searchText:"MK8DX Lounge Status", gameTitle: "MK8DX"},
    {id:62,label:"MK Blog",url:"https://japan-mk.blog.jp",category:"game",searchText:"MK Blog マリオカート", gameTitle: "MK8DX"},
    {id:63,label:"MK Central",url:"https://mkcentral.com/en-us",category:"game",searchText:"MK Central", gameTitle: "MK8DX"},
    {id:64,label:"MK Overlay",url:"https://statsoverlay.prismillon.com/",category:"game",searchText:"MK8DX Overlay", gameTitle: "MK8DX"},
    {id:65,label:"パッチノート",url:"https://support-jp.nintendo.com/app/answers/detail/a_id/34464",category:"game",searchText:"MK8DX パッチノート", gameTitle: "MK8DX"},
    {id:66,label:"パッチノート",url:"https://support.nintendo.com/jp/switch2/software_support/aaaaa/index.html",category:"game",searchText:"MKWD パッチノート", gameTitle: "MKWD"},

    // --- Downloader Category ---
    {id:17,label:"Y2mate",url:"https://www-y2mate.com/ja23/",category:"downloader",searchText:"y2mate ダウンロード"},
    {id:18,label:"SpotiDown",url:"https://spotidownloader.com/jp",category:"downloader",searchText:"Spotify Downloader ダウンロード"},
    {id:19,label:"SpotiMate",url:"https://spotimate.io/",category:"downloader",searchText:"Spotify mate ダウンロード"},
    
    // --- Other Category ---
    {id:6,label:"Yahoo!",url:"https://www.yahoo.co.jp",category:"other",searchText:"Yahoo! ヤフー"},
    {id:48,label:"知恵袋",url:"https://chiebukuro.yahoo.co.jp/notification",category:"other",searchText:"Yahoo 知恵袋"},
    {id:11,label:"Remote It",url:"https://app.remote.it",category:"other",searchText:"Remote It リモート"},
    {id:14,label:"Abema",url:"https://abema.tv/",category:"other",searchText:"Abema アベマ"},
    {id:16,label:"Spotify",url:"https://open.spotify.com/intl-ja",category:"other",searchText:"Spotify スポティファイ"},
    {id:36,label:"U-NEXT",url:"https://video.unext.jp/",category:"other",searchText:"U-NEXT ユーネクスト"},
    {id:20,label:"神戸市交通局",url:"https://kotsu.city.kobe.lg.jp/",category:"other",searchText:"神戸市交通局 地下鉄 バス"},
    {id:21,label:"GigaFile",url:"https://gigafile.nu/",category:"other",searchText:"GigaFile ギガファイル便"},
    {id:49,label:"Deepl翻訳",url:"https://www.deepl.com/translator",category:"other",searchText:"Deepl 翻訳"},
    {id:25,label:"BUSTARAIN",url:"https://sites.google.com/view/bustar/home",category:"other",searchText:"BUSTARAIN バスタレイン"},
    {id:26,label:"Answer I",url:"https://sites.google.com/view/answer-i/home",category:"other",searchText:"Answer I アンサー"},
    {id:27,label:"Rawkuro",url:"https://rawkuro.net/manga/bururokku004/di285hua",category:"other",searchText:"Rawkuro ブルーロック 漫画"},
    {id:28,label:"Manga4U",url:"https://mn4u.net/tgm-84/",category:"other",searchText:"MN4U ブルーロック 漫画"},
    {id:29,label:"マガポケ",url:"https://pocket.shonenmagazine.com/title/00617/episode/426754",category:"other",searchText:"講談社 ブルーロック 漫画"},
    {id:30,label:"メルカリ",url:"https://www.mercari.com/jp/",category:"other",searchText:"メルカリ フリマ"},
    {id:31,label:"Yahoo!フリマ",url:"https://paypayfleamarket.yahoo.co.jp/",category:"other",searchText:"Yahoo!フリマ ヤフー"},
    {id:37,label:"Amazon",url:"https://www.amazon.co.jp/",category:"other",searchText:"Amazon アマゾン"},
    {id:32,label:"ヤマト運輸",url:"https://www.kuronekoyamato.co.jp/",category:"other",searchText:"ヤマト運輸 宅急便"},
    {id:34,label:"GitHub",url:"https://github.com",category:"other",searchText:"GitHub ギットハブ"},
    {id:50,label:"画像圧縮",url:"https://www.iloveimg.com/ja/compress-image",category:"other",searchText:"iloveimg compress"},
    {id:51,label:"PDF圧縮",url:"https://www.ilovepdf.com/ja/compress_pdf",category:"other",searchText:"ilovepdf compress"},
    {id:52,label:"enHack",url:"https://enhack.app/app/#!/index/you/home/",category:"other",searchText:"enHack"},
    {id:53,label:"Scribd",url:"https://www.scribd.com",category:"other",searchText:"Scribd"},
    {id:54,label:"背景透過",url:"https://www.iloveimg.com/ja/remove-background",category:"other",searchText:"iloveimg remove background"},
    {id:55,label:"便利ツール",url:"https://jp.piliapp.com",category:"other",searchText:"piliapp 工具"},
    {id:56,label:"QR作成",url:"https://qr.quel.jp/url.php",category:"other",searchText:"QRコード作成 quel"},
    {id:67,label:"方眼ノート",url:"https://houganshi.net/note.php",category:"other",searchText:"ノート作成 houganshi"},
    {id:68,label:"マナビジョン",url:"https://manabi.benesse.ne.jp",category:"other",searchText:"Benesse ベネッセ"},
];

const RECENTLY_USED_APPS_KEY = 'siteRecentlyUsedApps';
const MAX_RECENT_APPS = 5;

function getRecentlyUsedApps() {
    try {
        const recent = localStorage.getItem(RECENTLY_USED_APPS_KEY);
        return recent ? JSON.parse(recent) : [];
    } catch (e) { console.error("Failed to parse recently used apps from localStorage", e); return []; }
}

function saveRecentlyUsedApps(recentApps) {
    localStorage.setItem(RECENTLY_USED_APPS_KEY, JSON.stringify(recentApps));
}

function recordAppClick(appId) {
    let recentlyUsed = getRecentlyUsedApps();
    recentlyUsed = recentlyUsed.filter(id => id !== appId);
    recentlyUsed.unshift(appId);
    if (recentlyUsed.length > MAX_RECENT_APPS) {
        recentlyUsed.splice(MAX_RECENT_APPS);
    }
    saveRecentlyUsedApps(recentlyUsed);
    renderRecentlyUsedIcons();
}

const SAVE_KEYS = { THEME: 'siteSaveTheme', MAIN_TAB: 'siteSaveMainTab', SUB_FILTER: 'siteSaveSubFilter' };
let saveSettings = {};

function loadSaveSettings() {
    saveSettings = {
        theme: localStorage.getItem(SAVE_KEYS.THEME) === 'true',
        mainTab: localStorage.getItem(SAVE_KEYS.MAIN_TAB) === 'true',
        subFilter: localStorage.getItem(SAVE_KEYS.SUB_FILTER) === 'true'
    };
    if (localStorage.getItem(SAVE_KEYS.THEME) === null) saveSettings.theme = true;
    if (localStorage.getItem(SAVE_KEYS.MAIN_TAB) === null) saveSettings.mainTab = true;
    if (localStorage.getItem(SAVE_KEYS.SUB_FILTER) === null) saveSettings.subFilter = true;
}

function getSavedItem(key) {
    let saveSettingFlag = false;
    if (key === 'siteTheme') saveSettingFlag = saveSettings.theme;
    else if (key === 'siteActiveTab') saveSettingFlag = saveSettings.mainTab;
    else if (key === 'siteActiveSubFilter' || key === 'siteActiveSubTab') saveSettingFlag = saveSettings.subFilter;

    if (saveSettingFlag) { return localStorage.getItem(key); }
    return null;
}

function saveItem(key, value) {
    let saveSettingFlag = false;
    if (key === 'siteTheme') saveSettingFlag = saveSettings.theme;
    else if (key === 'siteActiveTab') saveSettingFlag = saveSettings.mainTab;
    else if (key === 'siteActiveSubFilter' || key === 'siteActiveSubTab') saveSettingFlag = saveSettings.subFilter;

    if (saveSettingFlag) { localStorage.setItem(key, value); }
}

function loadAppData() {
    try {
        const d = localStorage.getItem('siteApps');
        appData = d ? JSON.parse(d) : JSON.parse(JSON.stringify(initialAppData));
    } catch (e) {
        appData = JSON.parse(JSON.stringify(initialAppData));
    }
}

function createIconElement(app) {
    const item = document.createElement('div');
    item.className = 'icon-item';
    item.dataset.id = app.id;

    let iconHTML;
    try {
        const hostname = new URL(app.url).hostname;
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
        iconHTML = `<img src="${faviconUrl}" class="icon-img" loading="lazy" alt="${app.label}" onerror="this.outerHTML='<i class=\\\'fas fa-globe fallback-icon\\\'></i>'">`;
    } catch (e) {
        iconHTML = `<i class="fas fa-globe fallback-icon"></i>`;
    }

    item.innerHTML = `<a href="${app.url}" class="icon-link" target="_blank">${iconHTML}</a><div class="label-text">${app.label}</div>`;
    item.querySelector('.icon-link').addEventListener('click', () => {
        recordAppClick(app.id);
    });
    return item;
}

function renderRecentlyUsedIcons() {
    const recentContainer = document.getElementById('recentlyUsedGridContainer');
    const recentSection = document.getElementById('recently-used-apps-container');
    const divider = document.getElementById('section-divider');
    recentContainer.innerHTML = '';

    const recentlyUsedIds = getRecentlyUsedApps();
    if (recentlyUsedIds.length === 0) {
        recentSection.classList.add('hidden');
        divider.classList.add('hidden');
        return;
    }

    recentlyUsedIds.forEach(id => {
        const app = appData.find(app => app.id === id);
        if (app) {
            recentContainer.appendChild(createIconElement(app));
        }
    });
    recentSection.classList.remove('hidden');
    divider.classList.remove('hidden');
}

function parseTimeToDate(t) { const [e, n] = t.split(":").map(Number), o = new Date; return o.setHours(e, n, 0, 0), o }
function getCurrentPeriod(t) { for (const e of schedule) { const n = parseTimeToDate(e.start), o = parseTimeToDate(e.end); if (t >= n && t < o) return { ...e, startTime: n, endTime: o } } return null }
function updateCountdown(t) { const e = getCurrentPeriod(t), n = document.getElementById("countdown"); if (e) { const o = e.endTime - t, a = e.endTime - e.startTime, s = a - o, r = Math.floor(s / a * 100), i = Math.floor(o / 1e3), l = String(Math.floor(i / 3600)).padStart(2, "0"), c = String(Math.floor(i % 3600 / 60)).padStart(2, "0"), d = String(i % 60).padStart(2, "0"); n.textContent = `${e.name} 残り: ${l}:${c}:${d} (${r}%)`, document.title = `${e.name} Left: ${l}:${c}:${d}` } else n.textContent = "現在は授業時間外です", document.title = "授業時間外" }
function updateClockAndDate() { const t = new Date, e = String(t.getHours()).padStart(2, "0"), n = String(t.getMinutes()).padStart(2, "0"), o = String(t.getSeconds()).padStart(2, "0"); document.getElementById("clock").textContent = `${e}:${n}:${o}`; const a = t.getFullYear(), s = String(t.getMonth() + 1).padStart(2, "0"), r = String(t.getDate()).padStart(2, "0"), i = ["日", "月", "火", "水", "木", "金", "土"][t.getDay()]; document.getElementById("date").textContent = `${a}/${s}/${r}(${i})`, updateCountdown(t) }
function setTheme(t) { if ("dark" === t) { document.body.classList.add("dark-theme"); saveItem('siteTheme', 'dark'); } else { document.body.classList.remove("dark-theme"); saveItem('siteTheme', 'light'); } }
function activateTab(tabId) { document.querySelectorAll(".tab-item").forEach(t => t.classList.remove('active')); document.getElementById(`tab-${tabId}`)?.classList.add('active'); mainGrid.style.display = 'none'; statusContainer.style.display = 'none'; bustarainContainer.style.display = 'none'; if (tabId === 'status') { statusContainer.style.display = 'flex'; } else if (tabId === 'bustarain') { bustarainContainer.style.display = 'block'; } else { mainGrid.style.display = 'grid'; } saveItem('siteActiveTab', tabId); }

function filterIconsByCategory(category) {
    document.querySelectorAll(".sub-filter-btn").forEach(btn => btn.classList.toggle('active', btn.dataset.category === category));
    saveItem('siteActiveSubFilter', category);
    filterContent();
}

// ▼▼▼ 修正：サブタブ切り替えのバグを修正した最終版 ▼▼▼
function filterContent() {
    const searchInput = document.getElementById("appSearchInput").value.toLowerCase();
    const activeCategory = document.querySelector('.sub-filter-btn.active')?.dataset.category || 'all';

    gridContainer.innerHTML = ''; // コンテナをクリア
    gridContainer.className = 'grid-container'; // ★重要：最初に必ず標準のクラス名に戻す

    if (activeCategory === 'game' && searchInput === '') {
        gridContainer.className = 'grid-container-grouped'; // Gameカテゴリの場合のみ、クラス名を変更

        const gameApps = appData.filter(app => app.category === 'game');
        const groupedGames = gameApps.reduce((acc, app) => {
            const title = app.gameTitle || 'Other';
            if (!acc[title]) acc[title] = [];
            acc[title].push(app);
            return acc;
        }, {});
        
        const displayOrder = ['MK8DX', 'Splatoon3', 'MKWD', 'Apex Legends'];
        const sortedGroupKeys = [...new Set([...displayOrder, ...Object.keys(groupedGames)])];

        sortedGroupKeys.forEach(title => {
            if (groupedGames[title]) {
                const groupWrapper = document.createElement('div');
                groupWrapper.className = 'game-group';
                groupWrapper.innerHTML = `<h4 class="game-group-title">${title}</h4><div class="game-group-icons"></div>`;
                const iconsContainer = groupWrapper.querySelector('.game-group-icons');
                groupedGames[title].forEach(app => {
                    iconsContainer.appendChild(createIconElement(app));
                });
                gridContainer.appendChild(groupWrapper);
            }
        });
    } else {
        const filteredApps = appData.filter(app => {
            const categoryMatch = (activeCategory === 'all' || app.category === activeCategory);
            const searchMatch = searchInput === '' || app.searchText.toLowerCase().includes(searchInput) || app.label.toLowerCase().includes(searchInput);
            return categoryMatch && searchMatch;
        });

        filteredApps.forEach(app => {
            gridContainer.appendChild(createIconElement(app));
        });
    }
}

function initAccordions() { document.querySelectorAll('.accordion-header').forEach(h => h.addEventListener('click', () => { const item = h.parentElement; const wasActive = item.classList.contains('active'); h.closest('.sub-tab-content').querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active')); if (!wasActive) { item.classList.add('active'); const content = h.nextElementSibling, src = h.dataset.src; if (src && content.innerHTML.trim() === '') { const iframe = document.createElement('iframe'); iframe.className = 'accordion-iframe'; iframe.loading = 'lazy'; iframe.src = src; content.appendChild(iframe); } } })); }
function activateSubTab(targetId) { document.querySelectorAll('.sub-tab-content').forEach(c => c.classList.add('hidden')); const targetContent = document.getElementById(targetId); if(targetContent) { targetContent.classList.remove('hidden'); const iframe = targetContent.querySelector('iframe[data-src]'); if (iframe) { iframe.src = iframe.dataset.src; iframe.removeAttribute('data-src'); } } document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.target === targetId)); saveItem('siteActiveSubTab', targetId); }
function setupModal() { const iframeModal = document.getElementById('iframe-modal'); const modalIframe = document.getElementById('modal-iframe'); document.querySelectorAll('.expand-btn').forEach(btn => { btn.addEventListener('click', (e) => { const target = e.currentTarget; let iframeSrc = ''; const card = target.closest('.status-card'); const iframe = card ? card.querySelector('iframe') : null; if (iframe) iframeSrc = iframe.src || iframe.dataset.src; if (iframeSrc) { modalIframe.src = iframeSrc; iframeModal.classList.remove('hidden'); } }); }); iframeModal.addEventListener('click', (e) => { if (e.target === iframeModal || e.target.closest('.close-modal-btn')) { iframeModal.classList.add('hidden'); modalIframe.src = 'about:blank'; } }); }
function lazyLoadIframes() { const lazyIframes = document.querySelectorAll('iframe[data-src]'); if ("IntersectionObserver" in window) { const observer = new IntersectionObserver((entries, observer) => { entries.forEach(entry => { if (entry.isIntersecting) { const iframe = entry.target; iframe.src = iframe.dataset.src; iframe.removeAttribute('data-src'); observer.unobserve(iframe); } }); }); lazyIframes.forEach(iframe => observer.observe(iframe)); } else { lazyIframes.forEach(iframe => { iframe.src = iframe.dataset.src; iframe.removeAttribute('data-src'); }); } }
function updateOnlineStatus() { const offlineStatusElement = document.getElementById('offline-status'); if (navigator.onLine) { offlineStatusElement.textContent = ''; offlineStatusElement.style.display = 'none'; } else { offlineStatusElement.textContent = 'オフライン'; offlineStatusElement.style.display = 'block'; } }
if (typeof window.initBusSchedule === 'undefined') { window.initBusSchedule = () => console.log("Bus schedule script not loaded."); window.updateBusCountdowns = () => {}; window.updateBusDisplay = () => {}; }

function init() {
    loadSaveSettings();
    const savedTheme = getSavedItem('siteTheme');
    const savedTab = getSavedItem('siteActiveTab');
    const savedSubFilter = getSavedItem('siteActiveSubFilter');
    const savedSubTab = getSavedItem('siteActiveSubTab');

    setTheme(savedTheme || 'light');
    updateClockAndDate();
    loadAppData();

    renderRecentlyUsedIcons();
    activateTab(savedTab || 'all-apps');
    filterIconsByCategory(savedSubFilter || 'all');

    initAccordions();
    activateSubTab(savedSubTab || 'train-content');

    setupModal();
    lazyLoadIframes();

    window.initBusSchedule();
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineS
