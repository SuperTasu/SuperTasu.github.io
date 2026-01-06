// ------------------------------------------------------------------
// 1. Firebase Imports & Configuration
// ------------------------------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ★★★ 必ずご自身のAPIキーなどを入れてください ★★★
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ------------------------------------------------------------------
// 2. DOM Elements & Variables
// ------------------------------------------------------------------

const mainGrid = document.getElementById('main-grid');
const bustarainContainer = document.getElementById('bustarain-container');
const optionContainer = document.getElementById('option-container');
const fyContainer = document.getElementById('fy-container');
const fyContentArea = document.getElementById('fy-content-area');
const gridContainer = document.getElementById('gridContainer');
const authInfo = document.getElementById('auth-info');
const userNameEl = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');
const authIcon = document.getElementById('auth-icon');

// FY専用時計
const fyDateText = document.getElementById('fy-date-text');
const fyTimeText = document.getElementById('fy-time-text');

// ------------------------------------------------------------------
// 3. Application Data
// ------------------------------------------------------------------

const schedule = [{name:"1限",start:"08:50",end:"09:40"},{name:"休憩",start:"09:40",end:"09:50"},{name:"2限",start:"09:50",end:"10:40"},{name:"休憩",start:"10:40",end:"10:50"},{name:"3限",start:"10:50",end:"11:40"},{name:"休憩",start:"11:40",end:"11:50"},{name:"4限",start:"11:50",end:"12:40"},{name:"昼休み",start:"12:40",end:"13:20"},{name:"5限",start:"13:20",end:"14:10"},{name:"休憩",start:"14:10",end:"14:20"},{name:"6限",start:"14:20",end:"15:10"},{name:"休憩",start:"15:10",end:"15:20"},{name:"7,8限",start:"15:20",end:"17:00"}];

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
  {id:9,label:"YouTube",url:"https://www.youtube.com",icon:".ico",searchText:"YouTube ユーチューブ"},
  {id:10,label:"YT Shorts",url:"",icon:".ico",searchText:"YT Shorts YouTube ショート"},
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
  {id:82,label:"Neocities",url:"https://neocities.org/",icon:"https://neocities.org/favicon.ico",searchText:"Neocities ネオシティーズ"},
  {id:83,label:"Firebase",url:"https://console.firebase.google.com/u/0/mfa",icon:"https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png",searchText:"Firebase ファイアベース"},
  {id:84,label:"神戸市バスロケーション",url:"https://location.its-mo.com/kobe/",icon:"https://location.its-mo.com/kobe/favicon.ico",searchText:"神戸市バスロケーション バスロケ KOBE"},
];

const FAV_KEY = 'myLinkAppFavorites';
const BG_KEY = 'myLinkAppBg';
const TAB_KEY = 'myLinkAppLastTab';
const TEXT_COLOR_KEY = 'myLinkAppTextColor';
const SECTIONS_KEY = 'myLinkAppSections'; // 区間設定保存用

let favorites = JSON.parse(localStorage.getItem(FAV_KEY)) || [];
if (favorites.length < 60) {
    const padding = new Array(60 - favorites.length).fill(null);
    favorites = favorites.concat(padding);
}

// 区間設定データ: { name: 'Name', start: index, end: index }
let sections = JSON.parse(localStorage.getItem(SECTIONS_KEY)) || [];

let isEditMode = false;
let isSectionMode = false;
let selectedSlotIndex = null;
let sectionSelectionStart = null;
let currentUser = null; 

// ------------------------------------------------------------------
// 4. Initialization
// ------------------------------------------------------------------

window.onload = function() {
    updateClock();
    setInterval(updateClock, 1000);

    const savedTheme = localStorage.getItem('theme');
    if(savedTheme) setTheme(savedTheme);

    loadBackground();
    loadTextColor(); 

    if (typeof window.initOptionTabContent === 'function') window.initOptionTabContent();

    renderGrid(initialAppData);
    initBustarain();

    const lastTab = localStorage.getItem(TAB_KEY) || 'all-apps';
    activateTab(lastTab);
    
    adjustSpeedTestPosition();
    window.addEventListener('resize', adjustSpeedTestPosition);

    setupNetworkStatus();
    setupSpeedTestAutoRefresh();
    
    // バスフィルターの初期状態適用
    const busFilterMode = localStorage.getItem('bus_filter_mode') || 'ALL';
    applyBusFilter(busFilterMode);
};

// --- Network & Speed Test ---
function setupNetworkStatus() {
    const statusEl = document.getElementById('network-status');
    const updateStatus = () => {
        if (navigator.onLine) {
            statusEl.className = 'online'; statusEl.innerHTML = '<i class="fas fa-wifi"></i> <span>ON</span>';
        } else {
            statusEl.className = 'offline'; statusEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>OFF</span>';
        }
    };
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
}

function setupSpeedTestAutoRefresh() {
    setInterval(() => { if (navigator.onLine) reloadSpeedTest(); }, 120000);
}

// --- Firebase Auth Logic ---
authInfo.addEventListener('click', () => {
    if (currentUser) {
        // ログアウトかアカウント切り替えかを選択させる
        const choice = confirm("アカウントを切り替えますか？\n[OK] アカウント切り替え\n[キャンセル] ログアウトのみ");
        if (choice) {
            // アカウント切り替え（強制的に選択画面を表示）
            provider.setCustomParameters({ prompt: 'select_account' });
            signInWithPopup(auth, provider).then(() => {
                // パラメータリセット
                provider.setCustomParameters({});
            }).catch(e => console.error(e));
        } else {
            signOut(auth).then(() => alert('ログアウトしました'));
        }
    } else {
        signInWithPopup(auth, provider).catch(e => {
            alert("ログインエラー: " + e.code);
        });
    }
});

onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
        authIcon.style.display = 'none';
        userAvatar.style.display = 'block';
        userAvatar.src = user.photoURL;
        userNameEl.textContent = user.displayName;
        await loadFromCloud();
    } else {
        authIcon.style.display = 'block';
        userAvatar.style.display = 'none';
        userAvatar.src = "";
        userNameEl.textContent = "Guest";
    }
});

// --- Firestore Sync ---
async function loadFromCloud() {
    if (!currentUser) return;
    const docRef = doc(db, "users", currentUser.uid);
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.favorites) {
                favorites = data.favorites;
                localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
                renderGrid(initialAppData);
                renderFavoritesPage();
                initBustarain();
            }
            if (data.sections) {
                sections = data.sections;
                localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections));
                renderFavoritesPage();
            }
            if (data.background) saveBackground(data.background, false);
            if (data.busFilter) applyBusFilter(data.busFilter);
        } else {
            saveToCloud();
        }
    } catch (e) { console.error(e); }
}

async function saveToCloud() {
    if (!currentUser) return;
    try {
        const dataToSave = {
            favorites: favorites,
            sections: sections, // 区間設定も保存
            background: localStorage.getItem(BG_KEY) || 'none',
            busFilter: localStorage.getItem('bus_filter_mode') || 'ALL',
            updatedAt: new Date()
        };
        await setDoc(doc(db, "users", currentUser.uid), dataToSave, { merge: true });
    } catch (e) { console.error(e); }
}

// ------------------------------------------------------------------
// 5. App Logic
// ------------------------------------------------------------------

function adjustSpeedTestPosition() {
    const iframe = document.getElementById('speed-test-iframe');
    const refreshBtn = document.getElementById('speed-test-refresh-button');
    const headerContainer = document.getElementById('header-speed-test-container');
    const fyPlaceholder = document.getElementById('fy-speed-test-placeholder');
    if (!iframe || !refreshBtn || !headerContainer || !fyPlaceholder) return;

    if (window.innerWidth <= 650) {
        if (!fyPlaceholder.contains(iframe)) { fyPlaceholder.append(iframe, refreshBtn); }
    } else {
        if (!headerContainer.contains(iframe)) { headerContainer.prepend(iframe); headerContainer.appendChild(refreshBtn); }
    }
}

function getFaviconUrl(url) {
    try {
        if (!url || !url.startsWith('http')) return './icon.png';
        return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(url)}&size=128`;
    } catch (e) { return './icon.png'; }
}
function getDuckDuckGoFavicon(url) {
    try {
        if (!url || !url.startsWith('http')) return './icon.png';
        return `https://icons.duckduckgo.com/ip3/${new URL(url).hostname}.ico`;
    } catch (e) { return './icon.png'; }
}

// --- Background Image from File ---
window.handleBgImageSelect = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // 画像データをBase64として保存 (サイズに注意)
            // 大きすぎる場合は圧縮する処理が必要だが、今回は簡易実装
            try {
                saveBackground(e.target.result);
            } catch(e) {
                alert("画像サイズが大きすぎて保存できませんでした。");
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function saveBackground(urlData, sync = true) {
    try {
        localStorage.setItem(BG_KEY, urlData);
        applyBackground(urlData);
        if (sync && currentUser) saveToCloud();
    } catch (e) { alert('保存に失敗しました(容量オーバーの可能性があります)。'); }
}
function loadBackground() {
    const savedBg = localStorage.getItem(BG_KEY);
    if (savedBg) applyBackground(savedBg);
}
function applyBackground(urlData) {
    if (urlData && urlData !== 'none') document.body.style.setProperty('--custom-bg-image', `url('${urlData}')`);
    else document.body.style.setProperty('--custom-bg-image', 'none');
}
function resetBackground() {
    localStorage.removeItem(BG_KEY);
    applyBackground('none');
    if (currentUser) saveToCloud();
    document.getElementById('bg-image-input').value = '';
    alert('背景をリセットしました。');
}

function updateClock() {
    const now = new Date();
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const day = days[now.getDay()];
    const dateStr = `${now.getMonth() + 1}/${now.getDate()} (${day})`;
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5); // 秒カットでスペース節約
    document.getElementById('date').textContent = dateStr;
    document.getElementById('clock').textContent = timeStr;

    if (fyContainer.style.display !== 'none') {
        fyDateText.textContent = dateStr;
        fyTimeText.textContent = now.toTimeString().split(' ')[0];
    }

    const nowMin = now.getHours() * 60 + now.getMinutes();
    let msg = "終了";
    for (let item of schedule) {
        const [sh, sm] = item.start.split(':').map(Number);
        const [eh, em] = item.end.split(':').map(Number);
        const sMin = sh * 60 + sm; const eMin = eh * 60 + em;
        if (nowMin >= sMin && nowMin < eMin) {
            msg = `${item.name} (${Math.floor(((nowMin - sMin) / (eMin - sMin)) * 100)}%)`; break;
        } else if (nowMin < sMin) { msg = `次:${item.name}`; break; }
    }
    document.getElementById('countdown').textContent = msg;
}

// --- Cards & Grid ---
function createAppCard(app) {
    const card = document.createElement('div');
    card.className = 'app-card';
    card.dataset.appId = app.id;
    card.style.position = 'relative';

    const mainLink = document.createElement('a');
    mainLink.href = app.url;
    Object.assign(mainLink.style, {
        position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: '1',
        textDecoration: 'none', borderRadius: '28px'
    });
    
    const left = document.createElement('div'); left.className = 'card-left';
    const img = document.createElement('img');
    if (app.icon && app.icon.startsWith('http') && !app.icon.includes('google.com/s2/favicons') && !app.icon.includes('.ico')) {
        img.src = app.icon;
    } else { img.src = getFaviconUrl(app.url); }
    img.onerror = () => { img.onerror = () => { img.src = './icon.png'; }; img.src = getDuckDuckGoFavicon(app.url); };
    left.appendChild(img);

    const divider = document.createElement('div'); divider.className = 'card-divider';
    const right = document.createElement('div'); right.className = 'card-right';
    const header = document.createElement('div'); header.className = 'card-header';
    const title = document.createElement('span'); title.className = 'card-title';
    title.textContent = app.label; header.appendChild(title);

    const btnRow = document.createElement('div'); btnRow.className = 'card-buttons';
    btnRow.style.position = 'relative'; btnRow.style.zIndex = '2'; 

    const btnSame = document.createElement('button'); btnSame.className = 'card-btn';
    btnSame.innerHTML = '<i class="fas fa-arrow-circle-right"></i>';
    btnSame.onclick = (e) => { e.stopPropagation(); window.location.href = app.url; };

    const btnFav = document.createElement('button');
    const isFav = favorites.includes(app.id);
    btnFav.className = isFav ? 'card-btn fav-active' : 'card-btn';
    btnFav.innerHTML = '<i class="fas fa-star"></i>';
    btnFav.onclick = (e) => { e.stopPropagation(); toggleFavorite(app.id); };

    btnRow.append(btnSame, btnFav);
    right.append(header, btnRow);
    card.append(left, divider, right, mainLink);
    return card;
}

function renderGrid(data) {
    gridContainer.innerHTML = '';
    data.forEach(app => gridContainer.appendChild(createAppCard(app)));
}

function initBustarain() {
    document.querySelectorAll('#bustarain-container .accordion-item').forEach(item => {
        const id = item.dataset.id;
        const star = item.querySelector('.acc-fav-btn');
        if(!star) return;
        star.className = favorites.includes(id) ? 'fas fa-star acc-fav-btn active' : 'far fa-star acc-fav-btn';
        star.onclick = (e) => { e.stopPropagation(); toggleFavorite(id); };
    });
}

function toggleFavorite(id) {
    const idx = favorites.indexOf(id);
    if (idx !== -1) favorites[idx] = null;
    else {
        const empty = favorites.indexOf(null);
        if (empty !== -1) favorites[empty] = id; else favorites.push(id);
    }
    saveFavorites();
    renderGrid(initialAppData);
    if (document.getElementById('tab-fy').classList.contains('active')) renderFavoritesPage();
    initBustarain();
}
function saveFavorites() {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    if (currentUser) saveToCloud();
}

// --- FY Page Logic (Sections & Edit) ---
function toggleEditMode() {
    isEditMode = !isEditMode;
    isSectionMode = false;
    sectionSelectionStart = null;
    updateFyButtons();
    renderFavoritesPage();
}

function toggleSectionMode() {
    isSectionMode = !isSectionMode;
    isEditMode = false;
    sectionSelectionStart = null;
    updateFyButtons();
    renderFavoritesPage();
}

function updateFyButtons() {
    const editBtn = document.getElementById('fy-edit-btn');
    const sectBtn = document.getElementById('fy-section-btn');
    editBtn.style.background = isEditMode ? '#667eea' : 'var(--input-bg)';
    editBtn.style.color = isEditMode ? '#fff' : 'var(--text-color-secondary)';
    sectBtn.style.background = isSectionMode ? '#ff9800' : 'var(--input-bg)';
    sectBtn.style.color = isSectionMode ? '#fff' : 'var(--text-color-secondary)';
}

function renderFavoritesPage() {
    fyContentArea.innerHTML = '';
    fyContentArea.classList.toggle('edit-mode', isEditMode);
    fyContentArea.classList.toggle('section-mode', isSectionMode);

    // グリッドスロット生成 (60個)
    const slots = [];
    for (let i = 0; i < 60; i++) {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'grid-slot';
        slotDiv.dataset.index = i;
        
        // 区間設定モード: クリック処理
        if (isSectionMode) {
            slotDiv.onclick = (e) => handleSectionClick(i);
            if (sectionSelectionStart !== null && i === sectionSelectionStart) {
                slotDiv.classList.add('section-selected');
            }
        }
        // 並び替えモード: クリック処理
        else if (isEditMode) {
            slotDiv.onclick = (e) => handleSlotClick(i);
            if (selectedSlotIndex === i) slotDiv.classList.add('selected-slot');
        }

        const favId = favorites[i];
        if (favId === null) slotDiv.classList.add('empty');
        else {
            let contentDiv = null;
            if (typeof favId === 'number') {
                const app = initialAppData.find(a => a.id === favId);
                if(app) contentDiv = createAppCard(app);
            } else { // Traffic
                const el = document.querySelector(`.accordion-item[data-id="${favId}"]`);
                if(el) {
                    const titleStr = el.dataset.title;
                    const card = document.createElement('div'); card.className = 'app-card';
                    let iconClass = String(favId).startsWith('tr-') ? 'fa-train' : 'fa-bus';
                    
                    const left = document.createElement('div'); left.className = 'card-left';
                    left.innerHTML = `<i class="fas ${iconClass}" style="font-size:32px; color:#555;"></i>`;
                    left.onclick = () => { if(!isEditMode && !isSectionMode) jumpToTraffic(favId, el); };
                    
                    const divider = document.createElement('div'); divider.className = 'card-divider';
                    const right = document.createElement('div'); right.className = 'card-right';
                    const header = document.createElement('div'); header.className = 'card-header';
                    const title = document.createElement('span'); title.className = 'card-title';
                    title.textContent = titleStr; header.appendChild(title);

                    const btnRow = document.createElement('div'); btnRow.className = 'card-buttons';
                    const btnMove = document.createElement('button'); btnMove.className = 'card-btn';
                    btnMove.innerHTML = '<i class="fas fa-arrow-circle-right"></i>';
                    btnMove.onclick = (e) => { e.stopPropagation(); jumpToTraffic(favId, el); };
                    const btnFav = document.createElement('button'); btnFav.className = 'card-btn fav-active';
                    btnFav.innerHTML = '<i class="fas fa-star"></i>';
                    btnFav.onclick = (e) => { e.stopPropagation(); toggleFavorite(favId); };

                    btnRow.append(btnMove, btnFav);
                    right.append(header, btnRow);
                    card.append(left, divider, right);
                    contentDiv = card;
                }
            }
            if(contentDiv) slotDiv.appendChild(contentDiv);
        }
        slots.push(slotDiv);
    }

    // 区間表示のためのレンダリングロジック
    // slots配列を走査し、区間に含まれるものはwrapperに入れる
    // 区間に含まれないものはそのまま追加
    
    // index -> section map
    const indexToSection = {};
    sections.forEach(sec => {
        for(let i=sec.start; i<=sec.end; i++) indexToSection[i] = sec;
    });

    let i = 0;
    while (i < 60) {
        if (indexToSection[i]) {
            const sec = indexToSection[i];
            // wrapper作成
            const wrapper = document.createElement('div');
            wrapper.className = 'section-wrapper';
            
            // ラベル
            const label = document.createElement('div');
            label.className = 'section-label';
            // 削除機能もつける
            label.innerHTML = `${sec.name} <i class="fas fa-times" style="margin-left:5px; cursor:pointer;" onclick="removeSection('${sec.name}')"></i>`;
            wrapper.appendChild(label);

            // 終了までスロットを追加
            while (i <= sec.end && i < 60) {
                wrapper.appendChild(slots[i]);
                i++;
            }
            fyContentArea.appendChild(wrapper);
        } else {
            fyContentArea.appendChild(slots[i]);
            i++;
        }
    }
}

// 区間設定のクリックハンドラ
function handleSectionClick(index) {
    if (sectionSelectionStart === null) {
        sectionSelectionStart = index;
        renderFavoritesPage();
    } else {
        const start = Math.min(sectionSelectionStart, index);
        const end = Math.max(sectionSelectionStart, index);
        const name = prompt("区間の名前を入力してください:");
        if (name) {
            // 重複チェック: 既存の区間と被っていたら削除して上書き
            sections = sections.filter(s => !(s.start <= end && s.end >= start));
            sections.push({ name, start, end });
            saveSections();
        }
        sectionSelectionStart = null;
        renderFavoritesPage();
    }
}

window.removeSection = function(name) {
    if(!confirm(`区間「${name}」を解除しますか？`)) return;
    sections = sections.filter(s => s.name !== name);
    saveSections();
    renderFavoritesPage();
};

function saveSections() {
    localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections));
    if(currentUser) saveToCloud();
}

function handleSlotClick(clickedIndex) {
    if (selectedSlotIndex === null) {
        if (favorites[clickedIndex] === null) return;
        selectedSlotIndex = clickedIndex;
    } else {
        if (selectedSlotIndex !== clickedIndex) {
            const temp = favorites[selectedSlotIndex];
            favorites[selectedSlotIndex] = favorites[clickedIndex];
            favorites[clickedIndex] = temp;
            saveFavorites();
        }
        selectedSlotIndex = null; 
    }
    renderFavoritesPage();
}

// --- Tab Logic ---
function activateTab(tabName) {
    document.getElementById('main-grid').style.display = 'none';
    document.getElementById('bustarain-container').style.display = 'none';
    document.getElementById('option-container').style.display = 'none';
    document.getElementById('fy-container').style.display = 'none';
    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));

    localStorage.setItem(TAB_KEY, tabName);
    if(currentUser) saveToCloud();

    if (tabName === 'all-apps') {
        document.getElementById('main-grid').style.display = 'block';
        document.getElementById('tab-all-apps').classList.add('active');
    } else if (tabName === 'bustarain') {
        document.getElementById('bustarain-container').style.display = 'block';
        document.getElementById('tab-bustarain').classList.add('active');
    } else if (tabName === 'option') {
        document.getElementById('option-container').style.display = 'block';
        document.getElementById('tab-option').classList.add('active');
    } else if (tabName === 'fy') {
        document.getElementById('fy-container').style.display = 'block';
        document.getElementById('tab-fy').classList.add('active');
        updateClock();
        renderFavoritesPage();
        adjustSpeedTestPosition();
    }
}

function switchSubTab(targetId) {
    document.querySelectorAll('.sub-tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(targetId).classList.remove('hidden');
    document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Trainボタン or BusボタンのActive切り替え
    if(targetId === 'train-content') {
        document.querySelector('.sub-tab-btn[onclick*="train-content"]').classList.add('active');
    } else {
        document.getElementById('bus-tab-btn').classList.add('active');
    }
}

// --- Bus Filter Logic ---
window.toggleBusFilter = function(btn) {
    switchSubTab('bus-content'); // バス画面を表示
    
    const currentMode = localStorage.getItem('bus_filter_mode') || 'ALL';
    const newMode = currentMode === 'ALL' ? 'NON-ST' : 'ALL';
    applyBusFilter(newMode);
    
    if(currentUser) saveToCloud();
};

function applyBusFilter(mode) {
    localStorage.setItem('bus_filter_mode', mode);
    const label = document.getElementById('bus-filter-label');
    if(label) label.textContent = `(${mode})`;

    const allGroup = document.querySelector('.bus-group-all');
    const nonStGroup = document.querySelector('.bus-group-nonst');

    if (mode === 'ALL') {
        allGroup.classList.remove('hidden');
        nonStGroup.classList.add('hidden');
    } else {
        allGroup.classList.add('hidden');
        nonStGroup.classList.remove('hidden');
    }
}

function toggleAccordion(header) {
    const item = header.parentElement;
    const content = item.querySelector('.accordion-content');
    const iframe = content.querySelector('iframe');
    item.classList.toggle('active');
    if (item.classList.contains('active')) {
        if (iframe && !iframe.src && iframe.dataset.src) iframe.src = iframe.dataset.src;
    }
}

function jumpToTraffic(favId, element) {
    activateTab('bustarain');
    const parentId = element.parentElement.classList.contains('bus-group-all') || element.parentElement.classList.contains('bus-group-nonst') ? 'bus-content' : 'train-content';
    switchSubTab(parentId);
    
    // 強制表示ロジック
    if(parentId === 'bus-content') {
        const isNonSt = element.parentElement.classList.contains('bus-group-nonst');
        if(isNonSt && localStorage.getItem('bus_filter_mode') !== 'NON-ST') applyBusFilter('NON-ST');
        if(!isNonSt && localStorage.getItem('bus_filter_mode') === 'NON-ST') applyBusFilter('ALL');
    }

    if(!element.classList.contains('active')) toggleAccordion(element.querySelector('.accordion-header'));
    setTimeout(() => { 
        element.scrollIntoView({behavior: 'smooth', block: 'center'}); 
        element.classList.add('highlight-target');
        setTimeout(() => element.classList.remove('highlight-target'), 3000);
    }, 100);
}

function reloadSpeedTest() {
    const iframe = document.querySelector('.header-speed-test iframe') || document.getElementById('speed-test-iframe');
    if(iframe) iframe.src = iframe.src;
}

// Global Exposure
window.activateTab = activateTab;
window.toggleEditMode = toggleEditMode;
window.switchSubTab = switchSubTab;
window.toggleAccordion = toggleAccordion;
window.reloadSpeedTest = reloadSpeedTest;
window.saveBackground = saveBackground;
window.resetBackground = resetBackground;
window.adjustSpeedTestPosition = adjustSpeedTestPosition;
window.initialAppData = initialAppData;
window.getFaviconUrl = getFaviconUrl;
window.renderTakatoriBoard = window.renderTakatoriBoard;
