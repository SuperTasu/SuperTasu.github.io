const mainGrid = document.getElementById('main-grid');
const statusContainer = document.getElementById('status-container');
const bustarainContainer = document.getElementById('bustarain-container');
const gridContainer = document.getElementById('gridContainer');
const refreshButton = document.getElementById('refresh-button');

const schedule=[{name:"1限",start:"08:50",end:"09:40"},{name:"休憩",start:"09:40",end:"09:50"},{name:"2限",start:"09:50",end:"10:40"},{name:"休憩",start:"10:40",end:"10:50"},{name:"3限",start:"10:50",end:"11:40"},{name:"休憩",start:"11:40",end:"11:50"},{name:"4限",start:"11:50",end:"12:40"},{name:"昼休み",start:"12:40",end:"13:20"},{name:"5限",start:"13:20",end:"14:10"},{name:"休憩",start:"14:10",end:"14:20"},{name:"6限",start:"14:20",end:"15:10"},{name:"休憩",start:"15:10",end:"15:20"},{name:"7限",start:"15:20",end:"16:10"},{name:"休憩",start:"16:10",end:"16:40"},{name:"8限",start:"16:40",end:"17:30"},{name:"休憩",start:"17:30",end:"17:40"},{name:"9限",start:"17:40",end:"18:30"}];
let appData = [];
// ▼▼▼ 変更：Spotify関連のアプリを削除 ▼▼▼
const initialAppData = [
    {id:1,label:"Google",url:"https://www.google.com",icon:"https://www.google.com/favicon.ico",category:"google",searchText:"Google グーグル"},
    {id:2,label:"Gmail",url:"https://mail.google.com",icon:"https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",category:"google",searchText:"Gmail Google Mail メール"},
    {id:35,label:"Chat",url:"https://chat.google.com",icon:"https://ssl.gstatic.com/dynamite/images/favicon/chat_2020q4_192.png",category:"google",searchText:"Google Chat チャット"},
    {id:3,label:"Calendar",url:"https://calendar.google.com",icon:"https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_3_2x.png",category:"google",searchText:"Google Calendar カレンダー"},
    {id:4,label:"Photos",url:"https://photos.google.com",icon:"https://ssl.gstatic.com/images/branding/product/1x/photos_48dp.png",category:"google",searchText:"Google Photos フォト 写真"},
    {id:5,label:"Drive",url:"https://drive.google.com",icon:"https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png",category:"google",searchText:"Google Drive ドライブ"},
    {id:33,label:"Google Sites",url:"https://sites.google.com/new",icon:"https://ssl.gstatic.com/images/branding/product/1x/sites_48dp.png",category:"google",searchText:"Google Sites サイト作成"},
    {id:23,label:"Google AI",url:"https://aistudio.google.com/prompts/new_chat",icon:"https://aistudio.google.com/favicon.ico",category:"google",searchText:"Google AI Gemini"},
    {id:7,label:"X",url:"https://x.com/i/timeline",icon:"https://x.com/favicon.ico",category:"sns",searchText:"X Twitter ツイッター"},
    {id:8,label:"Instagram",url:"https://www.instagram.com",icon:"https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png",category:"sns",searchText:"Instagram インスタグラム"},
    {id:9,label:"YouTube",url:"https://www.youtube.com/feed/subscriptions",icon:"https://www.youtube.com/favicon.ico",category:"sns",searchText:"YouTube ユーチューブ"},
    {id:10,label:"YT Shorts",url:"https://www.youtube.com/feed/subscriptions/shorts",icon:"https://www.youtube.com/favicon.ico",category:"sns",searchText:"YT Shorts YouTube ショート"},
    {id:36,label:"U-NEXT",url:"https://video.unext.jp/",icon:"https://video.unext.jp/favicon.ico",category:"other",searchText:"U-NEXT ユーネクスト"},
    {id:12,label:"TikTok",url:"https://www.tiktok.com",icon:"https://www.tiktok.com/favicon.ico",category:"sns",searchText:"TikTok ティックトック"},
    {id:13,label:"Twitch",url:"https://www.twitch.tv",icon:"https://www.twitch.tv/favicon.ico",category:"sns",searchText:"Twitch ツイッチ"},
    {id:15,label:"Discord",url:"https://discord.com/channels/@me",icon:"https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg",category:"sns",searchText:"Discord ディスコード"},
    {id:17,label:"Y2mate",url:"https://www-y2mate.com/ja23/",icon:"https://www-y2mate.com/themes/images/logo_y2mate.png",category:"downloader",searchText:"y2mate ダウンロード"},
    {id:6,label:"Yahoo!",url:"https://www.yahoo.co.jp",icon:"https://www.yahoo.co.jp/favicon.ico",category:"other",searchText:"Yahoo! ヤフー"},
    {id:11,label:"Remote It",url:"https://app.remote.it",icon:"https://app.remote.it/favicon.ico",category:"other",searchText:"Remote It リモート"},
    {id:14,label:"Abema",url:"https://abema.tv/",icon:"https://abema.tv/favicon.ico",category:"other",searchText:"Abema アベマ"},
    {id:20,label:"神戸市交通局",url:"https://kotsu.city.kobe.lg.jp/",icon:"https://kotsu.city.kobe.lg.jp/common/img/favicon.ico",category:"other",searchText:"神戸市交通局 地下鉄 バス"},
    {id:21,label:"GigaFile",url:"https://gigafile.nu/",icon:"https://gigafile.nu/favicon.ico",category:"other",searchText:"GigaFile ギガファイル便"},
    {id:22,label:"ChatGPT",url:"https://chatgpt.com",icon:"https://chat.openai.com/favicon.ico",category:"other",searchText:"ChatGPT AI"},
    {id:24,label:"Claude AI",url:"https://claude.ai",icon:"https://claude.ai/favicon.ico",category:"other",searchText:"Claude AI クロード"},
    {id:25,label:"BUSTARAIN",url:"https://sites.google.com/view/bustar/home",icon:"https://sites.google.com/favicon.ico",category:"other",searchText:"BUSTARAIN バスタレイン"},
    {id:26,label:"Answer I",url:"https://sites.google.com/view/answer-i/home",icon:"https://sites.google.com/favicon.ico",category:"other",searchText:"Answer I アンサー"},
    {id:27,label:"Rawkuro",url:"https://rawkuro.net/manga/bururokku004/di285hua",icon:"https://rawkuro.net/favicon.ico",category:"other",searchText:"Rawkuro ブルーロック 漫画"},
    {id:28,label:"Manga4U",url:"https://mn4u.net/tgm-84/",icon:"https://mn4u.net/favicon.ico",category:"other",searchText:"MN4U ブルーロック 漫画"},
    {id:29,label:"マガポケ",url:"https://pocket.shonenmagazine.com/title/00617/episode/426754",icon:"https://kmanga.kodansha.com/favicon.ico",category:"other",searchText:"講談社 ブルーロック 漫画"},
    {id:30,label:"メルカリ",url:"https://www.mercari.com/jp/",icon:"https://mercari.com/favicon.ico",category:"other",searchText:"メルカリ フリマ"},
    {id:31,label:"Yahoo!フリマ",url:"https://paypayfleamarket.yahoo.co.jp/",icon:"https://paypayfleamarket.yahoo.co.jp/favicon.ico",category:"other",searchText:"Yahoo!フリマ ヤフー"},
    {id:37,label:"Amazon",url:"https://www.amazon.co.jp/",icon:"https://www.amazon.co.jp/favicon.ico",category:"other",searchText:"Amazon アマゾン"},
    {id:32,label:"ヤマト運輸",url:"https://www.kuronekoyamato.co.jp/",icon:"https://www.kuronekoyamato.co.jp/favicon.ico",category:"other",searchText:"ヤマト運輸 宅急便"},
    {id:34,label:"GitHub",url:"https://github.com",icon:"https://github.com/favicon.ico",category:"other",searchText:"GitHub ギットハブ"},
    {id:38,label:"SixTONES",url:"https://www.sixtones.jp",icon:"https://www.sixtones.jp/favicon.ico",category:"other",searchText:"SixTONES ジャニーズ"},
    {id:39,label:"ART-PUT",url:"https://art-put.com",icon:"https://art-put.com/favicon.ico",category:"other",searchText:"ART-PUT アート"},
    {id:40,label:"Family Club",url:"https://fc-securesignon.familyclub.jp",icon:"https://www.familyclub.jp/img/common/favicon.ico",category:"other",searchText:"Family Club ファンクラブ"},
    {id:41,label:"H. Kitayama",url:"https://tobe-official.jp/artists/hiromitsukitayama",icon:"https://tobe-official.jp/favicon.ico",category:"other",searchText:"Hiromitsu Kitayama tobe"},
    {id:42,label:"Number i",url:"https://tobe-official.jp/artists/number_i",icon:"https://tobe-official.jp/favicon.ico",category:"other",searchText:"Number i tobe"},
    {id:43,label:"AMEFURASSHI",url:"https://amefurasshi.jp",icon:"https://amefurasshi.jp/wp-content/themes/amefurasshi/assets/images/favicon.ico",category:"other",searchText:"AMEFURASSHI"},
];

const RECENTLY_USED_APPS_KEY = 'siteRecentlyUsedApps';
const MAX_RECENT_APPS = 5;

function getRecentlyUsedApps() {
    try {
        const recent = localStorage.getItem(RECENTLY_USED_APPS_KEY);
        return recent ? JSON.parse(recent) : [];
    } catch (e) {
        console.error("Failed to parse recently used apps from localStorage", e);
        return [];
    }
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
}
const SAVE_KEYS = {
    THEME: 'siteSaveTheme',
    MAIN_TAB: 'siteSaveMainTab',
    SUB_FILTER: 'siteSaveSubFilter'
};
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

    if (saveSettingFlag) {
        return localStorage.getItem(key);
    }
    return null; 
}

function saveItem(key, value) {
    let saveSettingFlag = false;
    if (key === 'siteTheme') saveSettingFlag = saveSettings.theme;
    else if (key === 'siteActiveTab') saveSettingFlag = saveSettings.mainTab;
    else if (key === 'siteActiveSubFilter' || key === 'siteActiveSubTab') saveSettingFlag = saveSettings.subFilter;

    if (saveSettingFlag) {
        localStorage.setItem(key, value);
    }
}

function loadAppData() { 
    try { 
        const d = localStorage.getItem('siteApps'); 
        appData = d ? JSON.parse(d) : JSON.parse(JSON.stringify(initialAppData)); 
    } catch(e) { 
        appData = JSON.parse(JSON.stringify(initialAppData)); 
    } 
}

function createIconElement(app) {
    const item = document.createElement('div');
    item.className = `icon-item`;
    item.dataset.id = app.id;
    
    let iconHTML;
    if (app.icon && (app.icon.startsWith('http') || app.icon.startsWith('data:'))) {
        iconHTML = `<img src="${app.icon}" class="icon-img" loading="lazy" alt="${app.label}" onerror="this.outerHTML='<i class=\\\'fas fa-globe fallback-icon\\\'></i>'">`;
    } else {
        iconHTML = `<i class="${app.icon || 'fas fa-globe'}" style="${app.style || ''}"></i>`;
    }

    item.innerHTML = `
        <a href="${app.url}" class="icon-link" target="_blank">${iconHTML}</a>
        <div class="label-text">${app.label}</div>`;
    
    item.querySelector('.icon-link').addEventListener('click', () => {
        recordAppClick(app.id);
    });
    
    return item;
}

function renderAllIcons() {
    const allAppsContainer = document.getElementById('gridContainer');
    allAppsContainer.innerHTML = '';
    appData.forEach(app => {
        const iconElement = createIconElement(app);
        iconElement.classList.add('search-item');
        iconElement.dataset.category = app.category;
        iconElement.dataset.searchText = app.searchText;
        allAppsContainer.appendChild(iconElement);
    });
    filterIconsByCategory(getSavedItem('siteActiveSubFilter') || 'all');
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
            const iconElement = createIconElement(app);
            recentContainer.appendChild(iconElement);
        }
    });
    
    recentSection.classList.remove('hidden');
    divider.classList.remove('hidden');
}


function parseTimeToDate(t){const[e,n]=t.split(":").map(Number),o=new Date;return o.setHours(e,n,0,0),o}
function getCurrentPeriod(t){for(const e of schedule){const n=parseTimeToDate(e.start),o=parseTimeToDate(e.end);if(t>=n&&t<o)return{...e,startTime:n,endTime:o}}return null}
function updateCountdown(t){const e=getCurrentPeriod(t),n=document.getElementById("countdown");if(e){const o=e.endTime-t,a=e.endTime-e.startTime,s=a-o,r=Math.floor(s/a*100),i=Math.floor(o/1e3),l=String(Math.floor(i/3600)).padStart(2,"0"),c=String(Math.floor(i%3600/60)).padStart(2,"0"),d=String(i%60).padStart(2,"0");n.textContent=`${e.name} 残り: ${l}:${c}:${d} (${r}%)`,document.title=`${e.name} Left: ${l}:${c}:${d}`}else n.textContent="現在は授業時間外です",document.title="授業時間外"}
function updateClockAndDate(){const t=new Date,e=String(t.getHours()).padStart(2,"0"),n=String(t.getMinutes()).padStart(2,"0"),o=String(t.getSeconds()).padStart(2,"0");document.getElementById("clock").textContent=`${e}:${n}:${o}`;const a=t.getFullYear(),s=String(t.getMonth()+1).padStart(2,"0"),r=String(t.getDate()).padStart(2,"0"),i=["日","月","火","水","木","金","土"][t.getDay()];document.getElementById("date").textContent=`${a}/${s}/${r}(${i})`,updateCountdown(t)}

function setTheme(t){
    if ("dark"===t) {
        document.body.classList.add("dark-theme");
        saveItem('siteTheme', 'dark');
    } else {
        document.body.classList.remove("dark-theme");
        saveItem('siteTheme', 'light');
    }
}

function activateTab(tabId) {
    document.querySelectorAll(".tab-item").forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tabId}`)?.classList.add('active');

    mainGrid.style.display = 'none'; 
    statusContainer.style.display = 'none'; 
    bustarainContainer.style.display = 'none'; 

    if (tabId === 'status') { statusContainer.style.display = 'flex'; }
    else if (tabId === 'bustarain') { bustarainContainer.style.display = 'block'; }
    else { mainGrid.style.display = 'grid'; }

    saveItem('siteActiveTab', tabId);
}
function filterIconsByCategory(category) {
    document.querySelectorAll(".sub-filter-btn").forEach(btn => btn.classList.toggle('active', btn.dataset.category === category));
    saveItem('siteActiveSubFilter', category);
    filterContent();
}

function filterContent(){ 
    const s = document.getElementById("appSearchInput").value.toLowerCase(); 
    const c = getSavedItem('siteActiveSubFilter') || 'all'; 
    document.querySelectorAll("#gridContainer .search-item").forEach(i => { 
        const categoryMatch = (c === 'all' || i.dataset.category === c); 
        const searchMatch = i.dataset.searchText.toLowerCase().includes(s) || i.querySelector('.label-text').textContent.toLowerCase().includes(s); 
        i.style.display = (categoryMatch && searchMatch) ? 'block' : 'none'; 
    }); 
}

function initAccordions() { 
    document.querySelectorAll('.accordion-header').forEach(h => h.addEventListener('click', () => { 
        const item = h.parentElement; 
        const wasActive = item.classList.contains('active'); 
        h.closest('.sub-tab-content').querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active')); 
        if (!wasActive) { 
            item.classList.add('active'); 
            const content = h.nextElementSibling, src = h.dataset.src; 
            if (src && content.innerHTML.trim() === '') { 
                const iframe = document.createElement('iframe'); 
                iframe.className = 'accordion-iframe'; 
                iframe.loading = 'lazy';
                iframe.src = src; 
                content.appendChild(iframe); 
            } 
        } 
    })); 
}

function activateSubTab(targetId) {
    document.querySelectorAll('.sub-tab-content').forEach(c => c.classList.add('hidden'));
    const targetContent = document.getElementById(targetId);
    if(targetContent) {
        targetContent.classList.remove('hidden');
        const iframe = targetContent.querySelector('iframe[data-src]');
        if (iframe) {
            iframe.src = iframe.dataset.src;
            iframe.removeAttribute('data-src');
        }
    }
    document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.target === targetId));
    saveItem('siteActiveSubTab', targetId);
}

// ▼▼▼ 削除：initMediaPlayer() 関数を削除しました ▼▼▼

function setupModal() {
    const iframeModal = document.getElementById('iframe-modal');
    const modalIframe = document.getElementById('modal-iframe');

    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget;
            let iframeSrc = '';
            
            // ▼▼▼ 変更：メディアプレイヤーが削除されたため、関連するロジックを削除 ▼▼▼
            const card = target.closest('.status-card');
            const iframe = card ? card.querySelector('iframe') : null;
            if (iframe) iframeSrc = iframe.src || iframe.dataset.src;
            
            if (iframeSrc) {
                modalIframe.src = iframeSrc;
                iframeModal.classList.remove('hidden');
            }
        });
    });
    
    iframeModal.addEventListener('click', (e) => {
        if (e.target === iframeModal || e.target.closest('.close-modal-btn')) {
            iframeModal.classList.add('hidden');
            modalIframe.src = 'about:blank';
        }
    });
}

function lazyLoadIframes() {
    const lazyIframes = document.querySelectorAll('iframe[data-src]');
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    iframe.src = iframe.dataset.src;
                    iframe.removeAttribute('data-src');
                    observer.unobserve(iframe);
                }
            });
        });
        lazyIframes.forEach(iframe => observer.observe(iframe));
    } else {
        lazyIframes.forEach(iframe => {
            iframe.src = iframe.dataset.src;
            iframe.removeAttribute('data-src');
        });
    }
}

if (typeof window.initBusSchedule === 'undefined') { window.initBusSchedule = () => console.log("Bus schedule script not loaded."); window.updateBusCountdowns = () => {}; window.updateBusDisplay = () => {}; }

function init() {
    loadSaveSettings();

    const savedTheme = getSavedItem('siteTheme');
    const savedTab = getSavedItem('siteActiveTab');
    const savedSubTab = getSavedItem('siteActiveSubTab'); 

    setTheme(savedTheme || 'light');
    updateClockAndDate();
    loadAppData(); 
    
    renderRecentlyUsedIcons();
    renderAllIcons();

    activateTab(savedTab || 'all-apps');
    initAccordions();
    activateSubTab(savedSubTab || 'train-content');
    
    // ▼▼▼ 削除：initMediaPlayer() の呼び出しを削除しました ▼▼▼
    setupModal();
    lazyLoadIframes();

    window.initBusSchedule();
    document.getElementById('appSearchInput').addEventListener('input', () => { 
        if(document.getElementById("appSearchInput").value) { 
            activateTab('all-apps'); 
            document.querySelectorAll(".sub-filter-btn").forEach(btn => btn.classList.remove('active'));
            document.querySelector(".sub-filter-btn[data-category='all']").classList.add('active');
        }
        filterContent(); 
    });
    document.querySelectorAll('.sub-filter-btn').forEach(btn => btn.addEventListener('click', (e) => {
        filterIconsByCategory(e.currentTarget.dataset.category);
    }));
    document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.addEventListener('click', (e) => {
        activateSubTab(e.currentTarget.dataset.target);
    }));

    refreshButton.addEventListener('click', () => {
        location.reload(); 
    });

    // ▼▼▼ 追加：速度テストのリフレッシュボタンの機能 ▼▼▼
    const speedTestRefreshButton = document.getElementById('speed-test-refresh-button');
    if (speedTestRefreshButton) {
        speedTestRefreshButton.addEventListener('click', () => {
            const speedTestIframe = document.querySelector('.header-speed-test iframe');
            if (speedTestIframe) {
                // iframeのsrcを再設定することでリロードします。
                // fast.comのURLは固定なので、直接指定するのが確実です。
                speedTestIframe.src = 'https://fast.com/ja/';
            }
        });
    }
}

setInterval(() => { updateClockAndDate(); if (window.updateBusCountdowns && document.getElementById('tab-status').classList.contains('active')) window.updateBusCountdowns(); }, 1000);
setInterval(() => { if (window.updateBusDisplay && document.getElementById('tab-status').classList.contains('active')) window.updateBusDisplay(); }, 30000);
document.addEventListener('DOMContentLoaded', init);
