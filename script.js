const mainGrid = document.getElementById('main-grid');
const statusContainer = document.getElementById('status-container');
const bustarainContainer = document.getElementById('bustarain-container');
const gridContainer = document.getElementById('gridContainer');
const refreshButton = document.getElementById('refresh-button');

const schedule=[{name:"1限",start:"08:50",end:"09:40"},{name:"休憩",start:"09:40",end:"09:50"},{name:"2限",start:"09:50",end:"10:40"},{name:"休憩",start:"10:40",end:"10:50"},{name:"3限",start:"10:50",end:"11:40"},{name:"休憩",start:"11:40",end:"11:50"},{name:"4限",start:"11:50",end:"12:40"},{name:"昼休み",start:"12:40",end:"13:20"},{name:"5限",start:"13:20",end:"14:10"},{name:"休憩",start:"14:10",end:"14:20"},{name:"6限",start:"14:20",end:"15:10"},{name:"休憩",start:"15:10",end:"15:20"},{name:"7限",start:"15:20",end:"16:10"},{name:"休憩",start:"16:10",end:"16:40"},{name:"8限",start:"16:40",end:"17:30"},{name:"休憩",start:"17:30",end:"17:40"},{name:"9限",start:"17:40",end:"18:30"}];
let appData = [];
// ▼▼▼ 変更：アプリアイコンの指定を削除し、GameカテゴリにgameTitleプロパティを追加 ▼▼▼
const initialAppData = [
    // --- Google Category ---
    {id:1,label:"Google",url:"https://www.google.com",category:"google",searchText:"Google グーグル"},
    {id:2,label:"Gmail",url:"https://mail.google.com",category:"google",searchText:"Gmail Google Mail メール"},
    {id:35,label:"Chat",url:"https://chat.google.com",category:"google",searchText:"Google Chat チャット"},
    {id:3,label:"Calendar",url:"https://calendar.google.com",category:"google",searchText:"Google Calendar カレンダー"},
    {id:4,label:"Photos",url:"https://photos.google.com",category:"google",searchText:"Google Photos フォト 写真"},
    {id:5,label:"Drive",url:"https://drive.google.com",category:"google",searchText:"Google Drive ドライブ"},
    {id:33,label:"Google Sites",url:"https://sites.google.com/new",category:"google",searchText:"Google Sites サイト作成"},
    {id:23,label:"Google AI",url:"https://aistudio.google.com/prompts/new_chat",category:"google",searchText:"Google AI Gemini"},
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
    {id:22,label:"ChatGPT",url:"https://chatgpt.com",category:"other",searchText:"ChatGPT AI"},
    {id:24,label:"Claude AI",url:"https://claude.ai",category:"other",searchText:"Claude AI クロード"},
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

const SAVE_KEYS = { THEME: 'siteSaveTheme', MAIN_TAB: 'siteSaveMainTab', SUB_FILTER: 'siteSaveSubFilter' };
let saveSettings = {};
function loadSaveSettings(){saveSettings={theme:localStorage.getItem(SAVE_KEYS.THEME)==='true',mainTab:localStorage.getItem(SAVE_KEYS.MAIN_TAB)==='true',subFilter:localStorage.getItem(SAVE_KEYS.SUB_FILTER)==='true'};if(localStorage.getItem(SAVE_KEYS.THEME)===null)saveSettings.theme=true;if(localStorage.getItem(SAVE_KEYS.MAIN_TAB)===null)saveSettings.mainTab=true;if(localStorage.getItem(SAVE_KEYS.SUB_FILTER)===null)saveSettings.subFilter=true}
function getSavedItem(e){let t=false;return"siteTheme"===e?t=saveSettings.theme:"siteActiveTab"===e?t=saveSettings.mainTab:("siteActiveSubFilter"===e||"siteActiveSubTab"===e)&&(t=saveSettings.subFilter),t?localStorage.getItem(e):null}
function saveItem(e,t){let a=false;"siteTheme"===e?a=saveSettings.theme:"siteActiveTab"===e?a=saveSettings.mainTab:("siteActiveSubFilter"===e||"siteActiveSubTab"===e)&&(a=saveSettings.subFilter),a&&localStorage.setItem(e,t)}
function loadAppData(){try{const e=localStorage.getItem("siteApps");appData=e?JSON.parse(e):JSON.parse(JSON.stringify(initialAppData))}catch(e){appData=JSON.parse(JSON.stringify(initialAppData))}}

// ▼▼▼ 変更：アイコンをURLから自動取得するロジックに変更 ▼▼▼
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

    item.innerHTML = `
        <a href="${app.url}" class="icon-link" target="_blank">${iconHTML}</a>
        <div class="label-text">${app.label}</div>`;
    return item;
}

function parseTimeToDate(t){const[e,n]=t.split(":").map(Number),o=new Date;return o.setHours(e,n,0,0),o}
function getCurrentPeriod(t){for(const e of schedule){const n=parseTimeToDate(e.start),o=parseTimeToDate(e.end);if(t>=n&&t<o)return{...e,startTime:n,endTime:o}}return null}
function updateCountdown(t){const e=getCurrentPeriod(t),n=document.getElementById("countdown");if(e){const o=e.endTime-t,a=e.endTime-e.startTime,s=a-o,r=Math.floor(s/a*100),i=Math.floor(o/1e3),l=String(Math.floor(i/3600)).padStart(2,"0"),c=String(Math.floor(i%3600/60)).padStart(2,"0"),d=String(i%60).padStart(2,"0");n.textContent=`${e.name} 残り: ${l}:${c}:${d} (${r}%)`,document.title=`${e.name} Left: ${l}:${c}:${d}`}else n.textContent="現在は授業時間外です",document.title="授業時間外"}
function updateClockAndDate(){const t=new Date,e=String(t.getHours()).padStart(2,"0"),n=String(t.getMinutes()).padStart(2,"0"),o=String(t.getSeconds()).padStart(2,"0");document.getElementById("clock").textContent=`${e}:${n}:${o}`;const a=t.getFullYear(),s=String(t.getMonth()+1).padStart(2,"0"),r=String(t.getDate()).padStart(2,"0"),i=["日","月","火","水","木","金","土"][t.getDay()];document.getElementById("date").textContent=`${a}/${s}/${r}(${i})`,updateCountdown(t)}
function setTheme(t){"dark"===t?(document.body.classList.add("dark-theme"),saveItem("siteTheme","dark")):(document.body.classList.remove("dark-theme"),saveItem("siteTheme","light"))}
function activateTab(e){document.querySelectorAll(".tab-item").forEach(e=>e.classList.remove("active")),document.getElementById(`tab-${e}`)?.classList.add("active"),mainGrid.style.display="none",statusContainer.style.display="none",bustarainContainer.style.display="none","status"===e?statusContainer.style.display="flex":"bustarain"===e?bustarainContainer.style.display="block":mainGrid.style.display="grid",saveItem("siteActiveTab",e)}

// ▼▼▼ 変更：フィルタリング処理を呼び出すだけのシンプルな関数に ▼▼▼
function filterIconsByCategory(category) {
    document.querySelectorAll(".sub-filter-btn").forEach(btn => btn.classList.toggle('active', btn.dataset.category === category));
    saveItem('siteActiveSubFilter', category);
    filterContent();
}

// ▼▼▼ 変更：Gameカテゴリのグループ表示と通常表示を切り替えるロジックを追加 ▼▼▼
function filterContent() {
    const gridContainer = document.getElementById('gridContainer');
    const searchInput = document.getElementById("appSearchInput").value.toLowerCase();
    const activeCategory = document.querySelector('.sub-filter-btn.active')?.dataset.category || 'all';

    gridContainer.innerHTML = ''; // 毎回コンテナをクリア

    // Gameカテゴリかつ検索していない場合のみ、グループ表示
    if (activeCategory === 'game' && searchInput === '') {
        gridContainer.className = 'grid-container-grouped'; // グループ表示用のクラス

        const gameApps = appData.filter(app => app.category === 'game');
        const groupedGames = gameApps.reduce((acc, app) => {
            const title = app.gameTitle || 'Other';
            if (!acc[title]) acc[title] = [];
            acc[title].push(app);
            return acc;
        }, {});
        
        const displayOrder = ['MK8DX', 'Splatoon3', 'MKWD', 'Apex Legends'];
        // 順序を維持しつつ、リストにないものも末尾に追加する
        const sortedGroupKeys = [...new Set([...displayOrder, ...Object.keys(groupedGames)])];

        sortedGroupKeys.forEach(title => {
            if (groupedGames[title]) {
                const groupWrapper = document.createElement('div');
                groupWrapper.className = 'game-group';
                groupWrapper.innerHTML = `
                    <h4 class="game-group-title">${title}</h4>
                    <div class="game-group-icons"></div>`;
                const iconsContainer = groupWrapper.querySelector('.game-group-icons');
                groupedGames[title].forEach(app => {
                    iconsContainer.appendChild(createIconElement(app));
                });
                gridContainer.appendChild(groupWrapper);
            }
        });

    } else { // 通常のフィルタリング表示
        gridContainer.className = 'grid-container'; // 通常表示用のクラス

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

function initAccordions(){document.querySelectorAll(".accordion-header").forEach(e=>e.addEventListener("click",()=>{const t=e.parentElement,a=t.classList.contains("active");e.closest(".sub-tab-content").querySelectorAll(".accordion-item").forEach(e=>e.classList.remove("active")),a||(t.classList.add("active"),(()=>{const t=e.nextElementSibling,a=e.dataset.src;if(a&&""===t.innerHTML.trim()){const e=document.createElement("iframe");e.className="accordion-iframe",e.loading="lazy",e.src=a,t.appendChild(e)}})())}))}
function activateSubTab(e){document.querySelectorAll(".sub-tab-content").forEach(e=>e.classList.add("hidden"));const t=document.getElementById(e);t&&(t.classList.remove("hidden"),(()=>{const e=t.querySelector("iframe[data-src]");e&&(e.src=e.dataset.src,e.removeAttribute("data-src"))})()),document.querySelectorAll(".sub-tab-btn").forEach(t=>t.classList.toggle("active",t.dataset.target===e)),saveItem("siteActiveSubTab",e)}
function setupModal(){const e=document.getElementById("iframe-modal"),t=document.getElementById("modal-iframe");document.querySelectorAll(".expand-btn").forEach(a=>a.addEventListener("click",n=>{const o=n.currentTarget;let i="";const l=o.closest(".status-card"),r=l?l.querySelector("iframe"):null;r&&(i=r.src||r.dataset.src),i&&(t.src=i,e.classList.remove("hidden"))})),e.addEventListener("click",a=>{a.target!==e&&!a.target.closest(".close-modal-btn")||(e.classList.add("hidden"),t.src="about:blank")})}
function lazyLoadIframes(){const e=document.querySelectorAll("iframe[data-src]");"IntersectionObserver"in window?new IntersectionObserver((e,t)=>{e.forEach(e=>{if(e.isIntersecting){const a=e.target;a.src=a.dataset.src,a.removeAttribute("data-src"),t.unobserve(a)}})}).forEach(t=>t.observe(e)):e.forEach(e=>{e.src=e.dataset.src,e.removeAttribute("data-src")})}
function updateOnlineStatus(){const e=document.getElementById("offline-status");navigator.onLine?(e.textContent="",e.style.display="none"):(e.textContent="オフライン",e.style.display="block")}
"undefined"==typeof window.initBusSchedule&&(window.initBusSchedule=()=>console.log("Bus schedule script not loaded."),window.updateBusCountdowns=()=>{},window.updateBusDisplay=()=>{});
function init(){loadSaveSettings();const e=getSavedItem("siteTheme"),t=getSavedItem("siteActiveTab"),a=getSavedItem("siteActiveSubTab");setTheme(e||"light"),updateClockAndDate(),loadAppData(),filterContent(),activateTab(t||"all-apps"),filterIconsByCategory(getSavedItem("siteActiveSubFilter")||"all"),initAccordions(),activateSubTab(a||"train-content"),setupModal(),lazyLoadIframes(),window.initBusSchedule(),updateOnlineStatus(),window.addEventListener("online",updateOnlineStatus),window.addEventListener("offline",updateOnlineStatus),document.getElementById("appSearchInput").addEventListener("input",()=>{document.getElementById("appSearchInput").value&&(activateTab("all-apps"),document.querySelectorAll(".sub-filter-btn").forEach(e=>e.classList.remove("active")),document.querySelector(".sub-filter-btn[data-category='all']").classList.add("active"),saveItem("siteActiveSubFilter","all")),filterContent()}),document.querySelectorAll(".sub-filter-btn").forEach(e=>e.addEventListener("click",e=>{filterIconsByCategory(e.currentTarget.dataset.category)})),document.querySelectorAll(".sub-tab-btn").forEach(e=>e.addEventListener("click",e=>{activateSubTab(e.currentTarget.dataset.target)})),refreshButton.addEventListener("click",()=>{location.reload()});const n=document.getElementById("speed-test-refresh-button");n&&n.addEventListener("click",()=>{const e=document.querySelector(".header-speed-test iframe");e&&navigator.onLine&&(e.src="https://fast.com/ja/")})}
setInterval(()=>{updateClockAndDate(),window.updateBusCountdowns&&document.getElementById("tab-status").classList.contains("active")&&window.updateBusCountdowns()},1e3),setInterval(()=>{window.updateBusDisplay&&document.getElementById("tab-status").classList.contains("active")&&window.updateBusDisplay()},3e4),document.addEventListener("DOMContentLoaded",init);
