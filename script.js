// ------------------------------------------------------------------
// 1. Firebase Imports & Configuration
// ------------------------------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB9DW9T3UA-uuVCkQyTws9Jld7Xumr_vRA",
    authDomain: "linkfast--login.firebaseapp.com",
    projectId: "linkfast--login",
    storageBucket: "linkfast--login.firebasestorage.app",
    messagingSenderId: "691869871884",
    appId: "1:691869871884:web:4267ca37685cfbcda7e329",
    measurementId: "G-6LK1NSY24N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ★ アカウント切り替えを促す設定
provider.setCustomParameters({
    prompt: 'select_account'
});

// ------------------------------------------------------------------
// 2. DOM Elements & Variables
// ------------------------------------------------------------------

const mainGrid = document.getElementById('main-grid');
const bustarainContainer = document.getElementById('bustarain-container');
const fyContainer = document.getElementById('fy-container');
const fyContentArea = document.getElementById('fy-content-area');
const gridContainer = document.getElementById('gridContainer');
const searchInput = document.getElementById('globalSearchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const fyEditBtn = document.getElementById('fy-edit-btn'); 
const dateElement = document.getElementById('date');
const clockElement = document.getElementById('clock');
const countdownElement = document.getElementById('countdown');
const authBtn = document.getElementById('auth-btn');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');

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
  {id:85,label:"Twitch Drops",url:"https://www.twitch.tv/drops/inventory",icon:"https://www.twitch.tv/favicon.ico",searchText:"Twitch ツイッチ"},
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
  {id:86,label:"Kakeru",url:"https://kakeru.app/boards",icon:"https://kakeru.app/boards/favicon.ico",searchText:"Kakeru"},
  {id:87,label:"シャーロックホームズ　電子書籍1",url:"https://221b.jp",icon:"https://221b.jp/favicon.ico",searchText:"シャーロックホームズ　電子書籍1"},
  {id:88,label:"シャーロックホームズ　電子書籍2",url:"https://book.shishin-kyoto.com",icon:"https://book.shishin-kyoto.com/favicon.ico",searchText:"シャーロックホームズ　電子書籍2"},
  {id:87,label:"アーサーコナンドイル　電子書籍",url:"https://www.aozora.gr.jp/index_pages/person9.html",icon:"https://www.aozora.gr.jp/index_pages/person9.html/favicon.ico",searchText:"アーサーコナンドイル"},
];

const FAV_KEY = 'myLinkAppFavorites';
const BG_KEY = 'myLinkAppBg';
const TAB_KEY = 'myLinkAppLastTab';
const TEXT_COLOR_KEY = 'myLinkAppTextColor';

let favorites = JSON.parse(localStorage.getItem(FAV_KEY)) || [];
if (favorites.length < 60) {
    const padding = new Array(60 - favorites.length).fill(null);
    favorites = favorites.concat(padding);
}

let isEditMode = false;
let selectedSlotIndex = null;
let currentUser = null; 

// ------------------------------------------------------------------
// 4. Initialization & Event Listeners
// ------------------------------------------------------------------

window.onload = function() {
    updateClock();
    setInterval(updateClock, 1000);

    const savedTheme = localStorage.getItem('theme');
    if(savedTheme) setTheme(savedTheme);

    loadBackground();
    loadTextColor(); 

    renderGrid(initialAppData);
    initBustarain();

    let lastTab = localStorage.getItem(TAB_KEY) || 'all-apps';
    if(lastTab === 'option') lastTab = 'all-apps';
    activateTab(lastTab);
    
    adjustSpeedTestPosition();
    window.addEventListener('resize', adjustSpeedTestPosition);

    setupNetworkStatus();
    setupSpeedTestAutoRefresh();
    
    setupSearch();
    setupBackgroundInput();
};

function setupNetworkStatus() {
    const statusEl = document.getElementById('network-status');
    const updateStatus = () => {
        if (navigator.onLine) {
            statusEl.className = 'online';
            statusEl.innerHTML = '<i class="fas fa-wifi"></i> <span>ON</span>';
            statusEl.title = "オンライン";
        } else {
            statusEl.className = 'offline';
            statusEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>OFF</span>';
            statusEl.title = "オフライン";
        }
    };
    
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus(); 
}

function setupSpeedTestAutoRefresh() {
    setInterval(() => {
        if (navigator.onLine) {
            reloadSpeedTest();
            console.log("Speed test refreshed.");
        }
    }, 120000); 
}

// --- Firebase Auth Logic (Account Switching & Display Name) ---
authBtn.addEventListener('click', () => {
    if (currentUser) {
        signOut(auth).then(() => {
            alert('ログアウトしました');
            location.reload(); 
        }).catch((error) => {
            console.error('Sign Out Error', error);
        });
    } else {
        signInWithPopup(auth, provider).then((result) => {
            console.log("Login Success");
        }).catch((error) => {
            console.error('Sign In Error Details:', error);
            alert("ログインに失敗しました: " + error.message);
        });
    }
});

onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
        const icon = authBtn.querySelector('.fa-google');
        if(icon) icon.style.display = 'none';
        
        userAvatar.style.display = 'block';
        userAvatar.src = user.photoURL;
        
        userName.style.display = 'block';
        userName.textContent = user.displayName;

        authBtn.title = `アカウント切り替え / ログアウト (${user.displayName})`;
        
        await loadFromCloud();
    } else {
        const icon = authBtn.querySelector('.fa-google');
        if(icon) icon.style.display = 'block';
        userAvatar.style.display = 'none';
        userName.style.display = 'none';
        userAvatar.src = "";
        authBtn.title = "Googleログイン";
    }
});

// --- Firestore Sync Functions ---

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
                renderFavoritesPage(); 
                initBustarain(); 
            }
            if (data.background) {
                saveBackground(data.background, false); 
            }
            if (data.textColor) {
                saveTextColor(data.textColor, false);
            }
            if (data.lastTab) {
                if(data.lastTab !== 'option') {
                    activateTab(data.lastTab, false);
                }
            }
            console.log("Cloud data applied (Priority over local).");
        } else {
            saveToCloud();
        }
    } catch (e) {
        console.error("Error loading document: ", e);
    }
}

async function saveToCloud() {
    if (!currentUser) return;
    try {
        const dataToSave = {
            favorites: favorites,
            background: localStorage.getItem(BG_KEY) || 'none',
            textColor: localStorage.getItem(TEXT_COLOR_KEY) || '#000000',
            lastTab: localStorage.getItem(TAB_KEY) || 'all-apps',
            updatedAt: new Date()
        };
        await setDoc(doc(db, "users", currentUser.uid), dataToSave, { merge: true });
        console.log("Data synced to cloud.");
    } catch (e) {
        console.error("Error writing document: ", e);
    }
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

    if (window.innerWidth <= 700) {
        if (!fyPlaceholder.contains(iframe)) {
            fyPlaceholder.appendChild(iframe);
            fyPlaceholder.appendChild(refreshBtn);
        }
    } else {
        if (!headerContainer.contains(iframe)) {
            headerContainer.prepend(iframe);
            headerContainer.appendChild(refreshBtn);
        }
    }
}

function getFaviconUrl(url) {
    try {
        if (!url || !url.startsWith('http')) return './icon.png';
        return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(url)}&size=128`;
    } catch (e) {
        return './icon.png';
    }
}

function getDuckDuckGoFavicon(url) {
    try {
        if (!url || !url.startsWith('http')) return './icon.png';
        const domain = new URL(url).hostname;
        return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    } catch (e) {
        return './icon.png';
    }
}

// --- 背景画像関連 (修正版：ファイルアップロード) ---

function setupBackgroundInput() {
    const bgInput = document.getElementById('bg-file-input');
    if(bgInput) {
        bgInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if(!file) return;

            const reader = new FileReader();
            reader.onload = function(event) {
                const dataUrl = event.target.result;
                saveBackground(dataUrl);
                closeBgModal();
            };
            reader.readAsDataURL(file);
        });
    }
}

function openBgModal() {
    const modal = document.getElementById('bg-select-overlay');
    // リセット：前回の入力をクリア
    const bgInput = document.getElementById('bg-file-input');
    if(bgInput) bgInput.value = '';
    
    modal.classList.remove('hidden');
}

window.closeBgModal = function() {
    document.getElementById('bg-select-overlay').classList.add('hidden');
}

function saveBackground(urlData, sync = true) {
    try {
        localStorage.setItem(BG_KEY, urlData);
        applyBackground(urlData);
        if (sync && currentUser) saveToCloud();
    } catch (e) {
        console.error('Save BG failed', e);
        // localStorage quota exceeded fallback or warning could go here
    }
}
function loadBackground() {
    const savedBg = localStorage.getItem(BG_KEY);
    if (savedBg) applyBackground(savedBg);
}
function applyBackground(urlData) {
    if (urlData && urlData !== 'none') {
        document.body.style.setProperty('--custom-bg-image', `url('${urlData}')`);
    } else {
        document.body.style.setProperty('--custom-bg-image', 'none');
    }
}
function resetBackground() {
    localStorage.removeItem(BG_KEY);
    applyBackground('none');
    if (currentUser) saveToCloud();
    closeBgModal();
}

function saveTextColor(color, sync = true) {
    localStorage.setItem(TEXT_COLOR_KEY, color);
    applyTextColor(color);
    if (sync && currentUser) saveToCloud();
}
function loadTextColor() {
    const color = localStorage.getItem(TEXT_COLOR_KEY);
    if(color) applyTextColor(color);
}
function applyTextColor(color) {
    document.documentElement.style.setProperty('--text-color-primary', color);
}

function updateClock() {
    const now = new Date();
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = days[now.getDay()];

    const dateStr = `${year}/${month}/${date} (${day})`;
    const timeStr = now.toTimeString().split(' ')[0];
    if(dateElement) dateElement.textContent = dateStr;
    if(clockElement) clockElement.textContent = timeStr;

    if (fyContainer.style.display !== 'none') {
        if(fyDateText) fyDateText.textContent = dateStr;
        if(fyTimeText) fyTimeText.textContent = timeStr;
    }

    const nowMin = now.getHours() * 60 + now.getMinutes();
    let msg = "本日の予定は終了";

    for (let item of schedule) {
        const [sh, sm] = item.start.split(':').map(Number);
        const [eh, em] = item.end.split(':').map(Number);
        const sMin = sh * 60 + sm;
        const eMin = eh * 60 + em;

        if (nowMin >= sMin && nowMin < eMin) {
            const totalDuration = eMin - sMin;
            const elapsed = nowMin - sMin;
            const percentage = Math.floor((elapsed / totalDuration) * 100);
            msg = `${item.name} ${item.start} 〜 ${item.end} (${percentage}%)`;
            break;
        } else if (nowMin < sMin) {
            msg = `次は ${item.name} (${item.start}〜)`;
            break;
        }
    }
    if(countdownElement) countdownElement.textContent = msg;
}

function createAppCard(app) {
    const card = document.createElement('div');
    card.className = 'app-card';
    card.dataset.appId = app.id;
    card.style.position = 'relative';

    const mainLink = document.createElement('a');
    mainLink.href = app.url;
    Object.assign(mainLink.style, {
        position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
        zIndex: '1', textDecoration: 'none', borderRadius: '28px'
    });
    
    const left = document.createElement('div');
    left.className = 'card-left';
    const img = document.createElement('img');
    if (app.icon && app.icon.startsWith('http') && !app.icon.includes('google.com/s2/favicons') && !app.icon.includes('.ico')) {
        img.src = app.icon;
    } else {
        img.src = getFaviconUrl(app.url);
    }
    img.onerror = () => {
        img.onerror = () => { img.src = './icon.png'; };
        img.src = getDuckDuckGoFavicon(app.url);
    };
    left.appendChild(img);

    const divider = document.createElement('div');
    divider.className = 'card-divider';

    const right = document.createElement('div');
    right.className = 'card-right';

    const header = document.createElement('div');
    header.className = 'card-header';
    const title = document.createElement('span');
    title.className = 'card-title';
    title.textContent = app.label;
    title.title = app.label;
    header.appendChild(title);

    const btnRow = document.createElement('div');
    btnRow.className = 'card-buttons';
    btnRow.style.position = 'relative';
    btnRow.style.zIndex = '2'; 

    const btnSame = document.createElement('button');
    btnSame.className = 'card-btn';
    btnSame.innerHTML = '<i class="fas fa-arrow-circle-right"></i>';
    btnSame.title = "このページで開く";
    btnSame.onclick = (e) => { e.stopPropagation(); window.location.href = app.url; };

    const btnFav = document.createElement('button');
    const isFav = favorites.includes(app.id);
    btnFav.className = isFav ? 'card-btn fav-active' : 'card-btn';
    btnFav.innerHTML = '<i class="fas fa-star"></i>';
    btnFav.title = isFav ? "お気に入り解除" : "お気に入り登録";
    btnFav.onclick = (e) => { e.stopPropagation(); toggleFavorite(app.id); };

    btnRow.appendChild(btnSame);
    btnRow.appendChild(btnFav);
    right.appendChild(header);
    right.appendChild(btnRow);

    card.appendChild(left);
    card.appendChild(divider);
    card.appendChild(right);
    card.appendChild(mainLink);

    return card;
}

function renderGrid(data) {
    gridContainer.innerHTML = '';
    data.forEach(app => {
        const item = createAppCard(app);
        gridContainer.appendChild(item);
    });
}

function initBustarain() {
    const items = document.querySelectorAll('#bustarain-container .accordion-item');
    items.forEach(item => {
        const id = item.dataset.id;
        const star = item.querySelector('.acc-fav-btn');
        if(!star) return;

        if(favorites.includes(id)) {
            star.className = 'fas fa-star acc-fav-btn active';
            star.style.color = '#ffc107';
        } else {
            star.className = 'far fa-star acc-fav-btn';
            star.style.color = 'var(--text-color-primary)';
        }

        star.onclick = (e) => {
            e.stopPropagation();
            toggleFavorite(id);
        };
    });
}

function toggleFavorite(id) {
    const existingIndex = favorites.indexOf(id);
    if (existingIndex !== -1) {
        favorites[existingIndex] = null;
    } else {
        const emptyIndex = favorites.indexOf(null);
        if (emptyIndex !== -1) {
            favorites[emptyIndex] = id;
        } else {
            favorites.push(id);
        }
    }
    saveFavorites();
    renderGrid(initialAppData);
    if (document.getElementById('tab-fy').classList.contains('active')) {
        renderFavoritesPage();
    }
    initBustarain();
}

function saveFavorites() {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    if (currentUser) saveToCloud();
}

function renderFavoritesPage() {
    fyContentArea.innerHTML = '';

    favorites.forEach((favId, index) => {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'grid-slot';
        if (favId === null) slotDiv.classList.add('empty');
        
        let contentDiv = null;
        
        if (favId !== null) {
            if (typeof favId === 'number') {
                const app = initialAppData.find(a => a.id === favId);
                if(app) {
                    contentDiv = createAppCard(app);
                }
            } else {
                const el = document.querySelector(`.accordion-item[data-id="${favId}"]`);
                if(el) {
                    const titleStr = el.dataset.title;
                    const card = document.createElement('div');
                    card.className = 'app-card';
                    
                    let iconClass = 'fa-bus'; 
                    if (String(favId).startsWith('tr-')) iconClass = 'fa-train'; 
                    
                    const left = document.createElement('div');
                    left.className = 'card-left';
                    left.innerHTML = `<i class="fas ${iconClass}" style="font-size:32px; color:#555;"></i>`;
                    left.onclick = () => { if(!isEditMode) jumpToTraffic(favId, el); };
                    
                    const divider = document.createElement('div');
                    divider.className = 'card-divider';

                    const right = document.createElement('div');
                    right.className = 'card-right';
                    
                    const header = document.createElement('div');
                    header.className = 'card-header';
                    const title = document.createElement('span');
                    title.className = 'card-title';
                    title.textContent = titleStr;
                    header.appendChild(title);

                    const btnRow = document.createElement('div');
                    btnRow.className = 'card-buttons';
                    btnRow.style.zIndex = '2';
                    btnRow.style.position = 'relative';
                    
                    const btnMove = document.createElement('button');
                    btnMove.className = 'card-btn';
                    btnMove.innerHTML = '<i class="fas fa-arrow-circle-right"></i>';
                    btnMove.onclick = (e) => { e.stopPropagation(); jumpToTraffic(favId, el); };
                    
                    const btnFav = document.createElement('button');
                    btnFav.className = 'card-btn fav-active';
                    btnFav.innerHTML = '<i class="fas fa-star"></i>';
                    btnFav.onclick = (e) => { e.stopPropagation(); toggleFavorite(favId); };

                    btnRow.appendChild(btnMove);
                    btnRow.appendChild(btnFav);
                    
                    right.appendChild(header);
                    right.appendChild(btnRow);
                    
                    card.appendChild(left);
                    card.appendChild(divider);
                    card.appendChild(right);
                    
                    contentDiv = card;
                }
            }
        }

        if (contentDiv) {
            slotDiv.appendChild(contentDiv);
        }

        if (isEditMode) {
            slotDiv.onclick = (e) => {
                e.stopPropagation();
                handleSlotClick(index);
            };
            if (selectedSlotIndex === index) {
                slotDiv.classList.add('selected-slot');
            }
        }

        fyContentArea.appendChild(slotDiv);
    });

    if(isEditMode) {
        fyContentArea.classList.add('edit-mode');
        fyEditBtn.textContent = '完了';
        fyEditBtn.classList.add('editing');
        fyEditBtn.style.background = '#667eea';
        fyEditBtn.style.color = '#fff';
    } else {
        fyContentArea.classList.remove('edit-mode');
        fyEditBtn.textContent = '並び替え';
        fyEditBtn.classList.remove('editing');
        fyEditBtn.style.background = 'var(--input-bg)';
        fyEditBtn.style.color = 'var(--text-color-secondary)';
        selectedSlotIndex = null;
    }
}

function jumpToTraffic(favId, element) {
    activateTab('bustarain');
    const parentTabId = element.parentElement.id;
    switchSubTab(parentTabId);
    if(!element.classList.contains('active')) toggleAccordion(element.querySelector('.accordion-header'));
    setTimeout(() => { element.scrollIntoView({behavior: 'smooth', block: 'center'}); }, 100);
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    selectedSlotIndex = null;
    renderFavoritesPage();
}

function handleSlotClick(clickedIndex) {
    if (selectedSlotIndex === null) {
        if (favorites[clickedIndex] === null) return;
        selectedSlotIndex = clickedIndex;
        renderFavoritesPage();
        return;
    }
    if (selectedSlotIndex === clickedIndex) {
        selectedSlotIndex = null;
        renderFavoritesPage();
        return;
    }
    const temp = favorites[selectedSlotIndex];
    favorites[selectedSlotIndex] = favorites[clickedIndex];
    favorites[clickedIndex] = temp;
    saveFavorites();
    selectedSlotIndex = null; 
    renderFavoritesPage();
}

function activateTab(tabName, sync = true) {
    mainGrid.style.display = 'none';
    bustarainContainer.style.display = 'none';
    fyContainer.style.display = 'none';

    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));

    if(isEditMode) {
        isEditMode = false;
        renderFavoritesPage();
    }

    localStorage.setItem(TAB_KEY, tabName);
    if(sync && currentUser) saveToCloud();

    if (tabName === 'all-apps') {
        mainGrid.style.display = 'block';
        document.getElementById('tab-all-apps').classList.add('active');
    } else if (tabName === 'bustarain') {
        bustarainContainer.style.display = 'block';
        document.getElementById('tab-bustarain').classList.add('active');
    } else if (tabName === 'fy') {
        fyContainer.style.display = 'block';
        document.getElementById('tab-fy').classList.add('active');
        updateClock();
        renderFavoritesPage();
        adjustSpeedTestPosition();
    }
}

function switchSubTab(targetId) {
    document.querySelectorAll('.sub-tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(targetId).classList.remove('hidden');
    document.querySelectorAll('.sub-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('onclick').includes(targetId)) btn.classList.add('active');
    });
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

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        if(!localStorage.getItem(TEXT_COLOR_KEY)) {
            document.documentElement.style.setProperty('--text-color-primary', '#f5f5f5');
        }
    } else {
        document.body.classList.remove('dark-theme');
        if(!localStorage.getItem(TEXT_COLOR_KEY)) {
            document.documentElement.style.setProperty('--text-color-primary', '#000000');
        }
    }
    localStorage.setItem('theme', theme);
}

function reloadSpeedTest() {
    const iframe = document.querySelector('.header-speed-test iframe') || document.getElementById('speed-test-iframe');
    if(iframe) iframe.src = iframe.src;
}

// ★★★ 検索システム（修正版：点滅アニメーション付き） ★★★
function setupSearch() {
    const resultsContainer = document.getElementById('searchResults');
    let allContentCache = [];

    if (!searchInput || !resultsContainer) return;

    const kanaToRomajiMap = {
        'あ':'a','い':'i','う':'u','え':'e','お':'o',
        'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
        'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
        'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
        'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
        'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
        'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
        'や':'ya','ゆ':'yu','よ':'yo',
        'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
        'わ':'wa','を':'wo','ん':'n',
        'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
        'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
        'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
        'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
        'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
        'きゃ':'kya','きゅ':'kyu','きょ':'kyo',
        'しゃ':'sha','しゅ':'shu','しょ':'sho',
        'ちゃ':'cha','ちゅ':'chu','ちょ':'cho',
        'にゃ':'nya','にゅ':'nyu','にょ':'nyo',
        'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo',
        'みゃ':'mya','みゅ':'myu','みょ':'myo',
        'りゃ':'rya','りゅ':'ryu','りょ':'ryo',
        'ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo',
        'じゃ':'ja','じ':'ji','じゅ':'ju','じょ':'jo',
        'びゃ':'bya','びゅ':'byu','びょ':'byo',
        'ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
        'ふぁ':'fa','ふぃ':'fi','ふぇ':'fe','ふぉ':'fo'
    };

    function katakanaToHiragana(src) {
        return src.replace(/[\u30a1-\u30f6]/g, function(match) {
            var chr = match.charCodeAt(0) - 0x60;
            return String.fromCharCode(chr);
        });
    }

    function toRomaji(text) {
        let hira = katakanaToHiragana(text);
        let romaji = "";
        for (let i = 0; i < hira.length; i++) {
            let two = hira.substr(i, 2);
            if (kanaToRomajiMap[two]) {
                romaji += kanaToRomajiMap[two];
                i++;
                continue;
            }
            let one = hira.charAt(i);
            if (kanaToRomajiMap[one]) {
                romaji += kanaToRomajiMap[one];
            } else {
                romaji += one;
            }
        }
        return romaji;
    }

    function gatherAllSearchableContent() {
        const content = [];
        const accordions = document.querySelectorAll('.accordion-item');
        accordions.forEach(acc => {
            const headerSpan = acc.querySelector('.accordion-header span');
            const iframe = acc.querySelector('.accordion-iframe');
            if (headerSpan && iframe && iframe.dataset.src) {
                content.push({
                    type: 'traffic',
                    name: headerSpan.innerText.trim(),
                    url: iframe.dataset.src, 
                    el: acc,
                    img: './icon.png'
                });
            }
        });
        
        initialAppData.forEach(app => {
            let iconUrl = './icon.png';
            if(getFaviconUrl) {
                iconUrl = getFaviconUrl(app.url);
            }
            content.push({
                type: 'app',
                id: app.id,
                name: app.label,
                url: app.url,
                img: iconUrl,
                searchText: app.searchText || ""
            });
        });
        return content;
    }

    function performSearch(query) {
        const q = query.toLowerCase().trim();
        const qRomaji = toRomaji(q);

        resultsContainer.innerHTML = ''; 

        if (q.length === 0) {
            resultsContainer.classList.add('hidden');
            clearSearchBtn.classList.add('hidden');
            return;
        }

        clearSearchBtn.classList.remove('hidden');
        allContentCache = gatherAllSearchableContent();
        
        const matches = allContentCache.filter(item => {
            const nameLower = item.name.toLowerCase();
            const searchTxt = item.searchText ? item.searchText.toLowerCase() : "";
            
            if (nameLower.includes(q) || searchTxt.includes(q)) return true;
            if (qRomaji.length > 0) {
                if (nameLower.includes(qRomaji) || searchTxt.includes(qRomaji)) return true;
            }
            
            return false;
        });

        if (matches.length > 0) {
            resultsContainer.classList.remove('hidden');
            matches.forEach(item => {
                const itemLink = document.createElement('a');
                itemLink.className = 'search-result-item';
                
                const img = document.createElement('img');
                img.src = item.img || './icon.png';
                
                const span = document.createElement('span');
                span.innerText = item.name;

                const tag = document.createElement('span');
                tag.className = 'result-tag ' + (item.type === 'app' ? 'tag-app' : 'tag-traffic');
                tag.innerText = item.type === 'app' ? 'App' : 'Traffic';
                
                const icon = document.createElement('i');
                icon.className = 'fas fa-chevron-right';

                itemLink.appendChild(img);
                itemLink.appendChild(span);
                itemLink.appendChild(tag);
                itemLink.appendChild(icon);

                itemLink.addEventListener('click', (e) => {
                    e.preventDefault(); 
                    resultsContainer.classList.add('hidden');
                    searchInput.value = '';
                    clearSearchBtn.classList.add('hidden');
                    
                    if (item.type === 'traffic' && item.el) {
                        activateTab('bustarain');
                        const parentId = item.el.parentElement.id;
                        switchSubTab(parentId);
                        if(!item.el.classList.contains('active')) {
                            const header = item.el.querySelector('.accordion-header');
                            if(header) header.click();
                        }
                        setTimeout(() => { item.el.scrollIntoView({behavior: 'smooth', block: 'center'}); }, 100);
                    } else {
                        // アプリ選択時の挙動（Appsタブ移動＆強調）
                        activateTab('all-apps');
                        
                        setTimeout(() => {
                            const card = document.querySelector(`.app-card[data-app-id="${item.id}"]`);
                            if(card) {
                                card.scrollIntoView({behavior: 'smooth', block: 'center'});
                                
                                // アニメーションをリセットして再適用（連続検索対応）
                                card.classList.remove('highlight-target');
                                void card.offsetWidth; // リフロー強制
                                card.classList.add('highlight-target');
                                
                                // 3秒後にクラス削除（アニメーション終了後）
                                setTimeout(() => {
                                    card.classList.remove('highlight-target');
                                }, 3000);
                            }
                        }, 100);
                    }
                });
                resultsContainer.appendChild(itemLink);
            });
        } else {
            resultsContainer.classList.remove('hidden');
            const noRes = document.createElement('div');
            noRes.style.padding = '15px'; noRes.style.textAlign = 'center'; noRes.style.color = 'var(--text-color-secondary)';
            noRes.innerText = '見つかりませんでした';
            resultsContainer.appendChild(noRes);
        }
    }

    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });
    
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length > 0) performSearch(searchInput.value);
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        performSearch('');
        searchInput.focus();
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.classList.add('hidden');
        }
    });
}

// Global Exposure
window.activateTab = activateTab;
window.setTheme = setTheme;
window.toggleEditMode = toggleEditMode;
window.switchSubTab = switchSubTab;
window.toggleAccordion = toggleAccordion;
window.reloadSpeedTest = reloadSpeedTest;
window.openBgModal = openBgModal;
window.closeBgModal = window.closeBgModal;
window.resetBackground = resetBackground;
window.initialAppData = initialAppData;
window.getFaviconUrl = getFaviconUrl;
window.adjustSpeedTestPosition = adjustSpeedTestPosition;
