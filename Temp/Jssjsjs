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
// 3. Application Data & Schedule
// ------------------------------------------------------------------

const schedule = [
    {name:"1限",start:"08:50",end:"09:40"},{name:"休憩",start:"09:40",end:"09:50"},
    {name:"2限",start:"09:50",end:"10:40"},{name:"休憩",start:"10:40",end:"10:50"},
    {name:"3限",start:"10:50",end:"11:40"},{name:"休憩",start:"11:40",end:"11:50"},
    {name:"4限",start:"11:50",end:"12:40"},{name:"昼休み",start:"12:40",end:"13:20"},
    {name:"5限",start:"13:20",end:"14:10"},{name:"休憩",start:"14:10",end:"14:20"},
    {name:"6限",start:"14:20",end:"15:10"},{name:"休憩",start:"15:10",end:"15:20"},
    {name:"7,8限",start:"15:20",end:"17:00"}
];

/**
 * アプリケーションデータ
 * url: メインリンク
 * urlA〜D: 追加ボタン用リンク（空なら非表示）
 * iconA〜D: Font Awesomeクラス名
 * titleA〜D: ホバー時のツールチップ
 */
const initialAppData = [
  {
    id:1, label:"Google", url:"https://www.google.com",
    urlA:"", iconA:"", titleA:"",
    urlB:"", iconB:"", titleB:"",
    urlC:"", iconC:"", titleC:"",
    urlD:"", iconD:"", titleD:"",
    icon:"https://www.google.com/favicon.ico", searchText:"Google グーグル"
  },
  {
    id:2, label:"Gmail", url:"https://mail.google.com",
    urlA:"", iconA:"", titleA:"", // urlAを消去
    urlB:"", iconB:"", titleB:"", // urlBを消去
    urlC:"https://mail.google.com/mail/u/0/#all", iconC:"fas fa-file-alt", titleC:"全てのメール",
    urlD:"", iconD:"", titleD:"",
    icon:"https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico", searchText:"Gmail Google Mail メール"
  },
  { id:35, label:"Chat", url:"https://chat.google.com", icon:"https://ssl.gstatic.com/dynamite/images/favicon/chat_2020q4_192.png", searchText:"Google Chat チャット" },
  { id:3, label:"Calendar", url:"https://calendar.google.com", icon:"https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_3_2x.png", searchText:"Google Calendar カレンダー" },
  { id:4, label:"Photos", url:"https://photos.google.com", icon:"https://ssl.gstatic.com/images/branding/product/1x/photos_48dp.png", searchText:"Google Photos フォト 写真" },
  { id:5, label:"Drive", url:"https://drive.google.com", icon:"https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png", searchText:"Google Drive ドライブ" },
  { id:33, label:"Google Sites", url:"https://sites.google.com/new", icon:"https://ssl.gstatic.com/images/branding/product/1x/sites_48dp.png", searchText:"Google Sites サイト作成" },
  { id:44, label:"Docs", url:"https://docs.google.com/document/u/0/", icon:"https://ssl.gstatic.com/docs/documents/images/kix-favicon-2023q4.ico", searchText:"Google Documents ドキュメント" },
  { id:45, label:"Analytics", url:"https://analytics.google.com/analytics/web/", icon:"https://www.google.com/analytics/favicon.ico", searchText:"Google Analytics アナリティクス" },
  { id:46, label:"App Script", url:"https://script.google.com/home", icon:"https://ssl.gstatic.com/script/images/favicon.png", searchText:"Google App Script GAS" },
  { id:47, label:"Google翻訳", url:"https://translate.google.co.jp/", icon:"https://www.google.com/images/icons/product/translate-32.png", searchText:"Google Translate 翻訳" },
  { id:40, label:"Family Club", url:"https://www.fc-member.familyclub.jp", icon:"https://www.familyclub.jp/img/common/favicon.ico", searchText:"Family Club ファンクラブ" },
  { id:38, label:"SixTONES", url:"https://www.sixtones.jp", icon:"https://www.sixtones.jp/favicon.ico", searchText:"SixTONES ジャニーズ" },
  { id:39, label:"ART-PUT", url:"https://art-put.com", icon:"https://art-put.com/favicon.ico", searchText:"ART-PUT アート" },
  { id:42, label:"Number i", url:"https://tobe-official.jp/artists/number_i", icon:"https://tobe-official.jp/favicon.ico", searchText:"Number i tobe" },
  { id:41, label:"H. Kitayama", url:"https://tobe-official.jp/artists/hiromitsukitayama", icon:"https://tobe-official.jp/favicon.ico", searchText:"Hiromitsu Kitayama tobe" },
  { id:22, label:"ChatGPT", url:"https://chatgpt.com", icon:"https://chat.openai.com/favicon.ico", searchText:"ChatGPT AI" },
  { id:24, label:"Claude AI", url:"https://claude.ai", icon:"https://claude.ai/favicon.ico", searchText:"Claude AI クロード" },
  { id:23, label:"Google AI", url:"https://aistudio.google.com/prompts/new_chat", icon:"https://aistudio.google.com/favicon.ico", searchText:"Google AI Studio Gemini" },
  { id:75, label:"Perplexity", url:"https://www.perplexity.ai", icon:"https://www.perplexity.ai/favicon.ico", searchText:"Perplexity AI パープレキシティ" },
  { id:76, label:"Gemini", url:"https://gemini.google.com/app", icon:"https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030da8.png", searchText:"Google Gemini ジェミニ" },
  { id:77, label:"Copilot", url:"https://copilot.microsoft.com", icon:"https://copilot.microsoft.com/favicon.ico", searchText:"Microsoft Copilot コパイロット Bing" },
  {
    id:7, label:"X", url:"https://x.com/i/timeline",
    urlA:"https://x.com/notifications", iconA:"fas fa-bell", titleA:"通知",
    urlB:"https://x.com/i/chat", iconB:"fas fa-envelope", titleB:"メッセージ", // urlBを変更
    icon:"https://x.com/favicon.ico", searchText:"X Twitter ツイッター"
  },
  {
    id:8, label:"Instagram", url:"https://www.instagram.com",
    urlA:"https://www.instagram.com/notifications/", iconA:"fas fa-heart", titleA:"通知", // titleAを通知に変更
    urlB:"https://www.instagram.com/direct/inbox/", iconB:"fas fa-paper-plane", titleB:"メッセージ", // titleBをメッセージに変更
    icon:"https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png", searchText:"Instagram インスタグラム"
  },
  { 
    id:9, label:"YouTube", url:"https://www.youtube.com", 
    urlA:"https://www.youtube.com/feed/subscriptions", iconA:"fas fa-bell", titleA:"登録済み", // 追加
    urlB:"https://www.youtube.com/shorts", iconB:"fas fa-play", titleB:"Short動画", // 追加
    icon:"https://www.youtube.com/favicon.ico", searchText:"YouTube ユーチューブ" 
  },
  { id:10, label:"YT Shorts", url:"https://www.youtube.com/shorts", icon:"https://www.youtube.com/favicon.ico", searchText:"YT Shorts YouTube ショート" },
  { id:12, label:"TikTok", url:"https://www.tiktok.com", urlA:"https://www.tiktok.com/notifications", iconA:"fas fa-bell", urlB:"https://www.tiktok.com/messages", iconB:"fas fa-comment", icon:"https://www.tiktok.com/favicon.ico", searchText:"TikTok ティックトック" },
  { 
    id:13, label:"Twitch", url:"https://www.twitch.tv", 
    urlA:"https://www.twitch.tv/drops/inventory", iconA:"fas fa-gift", titleA:"Drop", // 追加
    icon:"https://www.twitch.tv/favicon.ico", searchText:"Twitch ツイッチ" 
  },
  { id:85, label:"Twitch Drops", url:"https://www.twitch.tv/drops/inventory", icon:"https://www.twitch.tv/favicon.ico", searchText:"Twitch ツイッチ" },
  { id:15, label:"Discord", url:"https://discord.com/channels/@me", icon:"https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg", searchText:"Discord ディスコード" },
  { id:14, label:"Abema", url:"https://abema.tv/", icon:"https://abema.tv/favicon.ico", searchText:"Abema アベマ" },
  { id:16, label:"Spotify", url:"https://open.spotify.com/intl-ja", icon:"https://open.spotify.com/favicon.ico", searchText:"Spotify スポティファイ" },
  { id:36, label:"U-NEXT", url:"https://video.unext.jp/", icon:"https://video.unext.jp/favicon.ico", searchText:"U-NEXT ユーネクスト" },
  { id:71, label:"Pinterest", url:"https://jp.pinterest.com", icon:"https://jp.pinterest.com/favicon.ico", searchText:"Pinterest ピンタレスト 画像" },
  { id:57, label:"Apex Status", url:"https://apexlegendsstatus.com/current-map", icon:"https://apexlegendsstatus.com/favicon-32x32.png", searchText:"Apex Legends Status" },
  { id:58, label:"Splatoon Map", url:"https://www.splatoon3-schedule.net", icon:"https://www.splatoon3-schedule.net/favicon.ico", searchText:"Splatoon 3 スプラトゥーン マップ" },
  { id:59, label:"Splatoon Note", url:"https://support.nintendo.com/jp/switch/software_support/av5ja/1010.html", icon:"https://support.nintendo.com/favicon.ico", searchText:"Splatoon 3 パッチノート" },
  { id:60, label:"MKBuilder", url:"https://mk8dxbuilder.com", icon:"https://mk8dxbuilder.com/favicon.ico", searchText:"MK8DX Builder マリオカート" },
  { id:61, label:"MK Lounge", url:"https://lounge.mkcentral.com/mk8dx", icon:"https://lounge.mkcentral.com/favicon.ico", searchText:"MK8DX Lounge Status" },
  { id:62, label:"MK Blog", url:"https://japan-mk.blog.jp", icon:"https://japan-mk.blog.jp/favicon.ico", searchText:"MK Blog マリオカート" },
  { id:63, label:"MK Central", url:"https://mkcentral.com/en-us", icon:"https://mkcentral.com/favicon.ico", searchText:"MK Central" },
  { id:64, label:"MK Overlay", url:"https://statsoverlay.prismillon.com/", icon:"https://statsoverlay.prismillon.com/assets/icon.png", searchText:"MK8DX Overlay" },
  { id:65, label:"MK8DX Note", url:"https://support-jp.nintendo.com/app/answers/detail/a_id/34464", icon:"https://support.nintendo.com/favicon.ico", searchText:"MK8DX パッチノート" },
  { id:66, label:"MKWD Note", url:"https://support.nintendo.com/jp/switch2/software_support/aaaaa/index.html", icon:"https://support.nintendo.com/favicon.ico", searchText:"MKWD パッチノート" },
  { id:17, label:"Y2mate", url:"https://www-y2mate.com/ja23/", icon:"https://www-y2mate.com/themes/images/logo_y2mate.png", searchText:"y2mate ダウンロード" },
  { id:18, label:"SpotiDown", url:"https://spotidownloader.com/jp", icon:"https://spotidownloader.com/favicon.ico", searchText:"Spotify Downloader ダウンロード" },
  { id:19, label:"SpotiMate", url:"https://spotimate.io/", icon:"https://spotimate.io/favicon.ico", searchText:"Spotify mate ダウンロード" },
  { id:6, label:"Yahoo!", url:"https://www.yahoo.co.jp", icon:"https://www.yahoo.co.jp/favicon.ico", searchText:"Yahoo! ヤフー" },
  { id:48, label:"知恵袋", url:"https://chiebukuro.yahoo.co.jp/notification", icon:"https://s.yimg.jp/c/icon/s/bsc/2.0/favicon.ico", searchText:"Yahoo 知恵袋" },
  { id:11, label:"Remote It", url:"https://app.remote.it", icon:"https://app.remote.it/favicon.ico", searchText:"Remote It リモート" },
  { id:20, label:"神戸市交通局", url:"https://kotsu.city.kobe.lg.jp/", icon:"https://kotsu.city.kobe.lg.jp/common/img/favicon.ico", searchText:"神戸市交通局 地下鉄 バス" },
  { id:21, label:"GigaFile", url:"https://gigafile.nu/", icon:"https://gigafile.nu/favicon.ico", searchText:"GigaFile ギガファイル便" },
  { id:49, label:"Deepl翻訳", url:"https://www.deepl.com/translator", icon:"https://www.deepl.com/img/favicon/deepl_favicon_32x32.png", searchText:"Deepl 翻訳" },
  { id:25, label:"BUSTARAIN", url:"https://sites.google.com/view/bustar/home", icon:"https://sites.google.com/favicon.ico", searchText:"BUSTARAIN バスタレイン" },
  { id:26, label:"Answer I", url:"https://sites.google.com/view/answer-i/home", icon:"https://sites.google.com/favicon.ico", searchText:"Answer I アンサー" },
  { id:27, label:"Rawkuro", url:"https://rawkuro.net/manga/bururokku004/di285hua", icon:"https://rawkuro.net/favicon.ico", searchText:"Rawkuro ブルーロック 漫画" },
  { id:28, label:"Manga4U", url:"https://mn4u.net/tgm-84/", icon:"https://mn4u.net/favicon.ico", searchText:"MN4U ブルーロック 漫画" },
  { id:29, label:"マガポケ", url:"https://pocket.shonenmagazine.com/title/00617/episode/426754", icon:"https://kmanga.kodansha.com/favicon.ico", searchText:"講談社 ブルーロック 漫画" },
  { id:30, label:"メルカリ", url:"https://www.mercari.com/jp/", urlA:"https://jp.mercari.com/notifications", iconA:"fas fa-bell", icon:"https://mercari.com/favicon.ico", searchText:"メルカリ フリマ" },
  { id:31, label:"Yahoo!フリマ", url:"https://paypayfleamarket.yahoo.co.jp/", icon:"https://paypayfleamarket.yahoo.co.jp/favicon.ico", searchText:"Yahoo!フリマ ヤフー" },
  { id:37, label:"Amazon", url:"https://www.amazon.co.jp/", icon:"https://www.amazon.co.jp/favicon.ico", searchText:"Amazon アマゾン" },
  { id:32, label:"ヤマト運輸", url:"https://www.kuronekoyamato.co.jp/", icon:"https://www.kuronekoyamato.co.jp/favicon.ico", searchText:"ヤマト運輸 宅急便" },
  { id:34, label:"GitHub", url:"https://github.com", 
    urlA:"", iconA:"", titleA:"", // urlAを消去
    icon:"https://github.com/favicon.ico", searchText:"GitHub ギットハブ" 
  },
  { id:43, label:"AMEFURASSHI", url:"https://amefurasshi.jp", icon:"https://amefurasshi.jp/wp-content/themes/amefurasshi/assets/images/favicon.ico", searchText:"AMEFURASSHI" },
  { id:50, label:"画像圧縮", url:"https://www.iloveimg.com/ja/compress-image", icon:"https://www.iloveimg.com/img/favicons/favicon-32x32.png", searchText:"iloveimg compress" },
  { id:51, label:"PDF圧縮", url:"https://www.ilovepdf.com/ja/compress_pdf", icon:"https://www.ilovepdf.com/img/favicons/favicon-32x32.png", searchText:"ilovepdf compress" },
  { id:52, label:"enHack", url:"https://enhack.app/app/#!/index/you/home/", icon:"https://enhack.app/favicon.ico", searchText:"enHack" },
  { id:53, label:"Scribd", url:"https://www.scribd.com", icon:"https://www.scribd.com/favicon.ico", searchText:"Scribd" },
  { id:54, label:"背景透過", url:"https://www.iloveimg.com/ja/remove-background", icon:"https://www.iloveimg.com/img/favicons/favicon-32x32.png", searchText:"iloveimg remove background" },
  { id:55, label:"便利ツール", url:"https://jp.piliapp.com", icon:"https://jp.piliapp.com/favicon.ico", searchText:"piliapp 工具" },
  { id:56, label:"QR作成", url:"https://qr.quel.jp/url.php", icon:"https://qr.quel.jp/favicon.ico", searchText:"QRコード作成 quel" },
  { id:67, label:"方眼ノート", url:"https://houganshi.net/note.php", icon:"https://houganshi.net/favicon.ico", searchText:"ノート作成 houganshi" },
  { id:68, label:"マナビジョン", url:"https://manabi.benesse.ne.jp", icon:"https://manabi.benesse.ne.jp/favicon.ico", searchText:"Benesse ベネッセ" },
  { id:69, label:"兵庫県警報・注意報", url:"https://weathernews.jp/onebox/warn/hyogo/2810000/", icon:"https://weathernews.jp/favicon.ico", searchText:"警報 注意報 天気 兵庫 weathernews" },
  { id:70, label:"文字数カウント", url:"https://sundryst.com/convenienttool/strcount.html", icon:"https://sundryst.com/favicon.ico", searchText:"文字数 カウント tool" },
  { id:72, label:"UKARO", url:"https://www.ucaro.net", icon:"https://www.ucaro.net/favicon.ico", searchText:"UKARO ウカロ 受験 大学" },
  { id:73, label:"Wordpress", url:"https://wordpress.com/home/answeri.wordpress.com", icon:"https://s1.wp.com/i/favicon.ico", searchText:"Wordpress ワードプレス ブログ answeri" },
  { id:74, label:"受かる英語", url:"https://ukaru-eigo.com", icon:"https://ukaru-eigo.com/favicon.ico", searchText:"受かる英語 英語学習" },
  { id:78, label:"背景透過2", url:"https://www.remove.bg/ja", icon:"https://www.remove.bg/favicon.ico", searchText:"remove.bg 背景透過 removebg" },
  { id:79, label:"Microsoft Form", url:"https://forms.cloud.microsoft/Pages/DesignPageV2.aspx?origin=Marketing", icon:"https://forms.office.com/favicon.ico", searchText:"Microsoft Forms フォーム アンケート" },
  { id:80, label:"PDF圧縮2", url:"https://tools.pdf24.org/ja/compress-pdf", icon:"https://tools.pdf24.org/favicon.ico", searchText:"PDF24 compress 圧縮" },
  { id:81, label:"画像アッシュクマ", url:"https://imguma.com/", icon:"https://imguma.com/favicon.ico", searchText:"imguma アッシュクマ 画像圧縮" },
  { id:82, label:"Neocities", url:"https://neocities.org/", icon:"https://neocities.org/favicon.ico", searchText:"Neocities ネオシティーズ" },
  { id:83, label:"Firebase", url:"https://console.firebase.google.com/u/0/mfa", icon:"https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png", searchText:"Firebase ファイアベース" },
  { id:84, label:"神戸市バスロケーション", url:"https://location.its-mo.com/kobe/", icon:"https://location.its-mo.com/kobe/favicon.ico", searchText:"神戸市バスロケーション バスロケ KOBE" },
  { id:86, label:"Kakeru", url:"https://kakeru.app/boards", icon:"https://kakeru.app/boards/favicon.ico", searchText:"Kakeru" },
  { id:87, label:"シャーロックホームズ 電子書籍1", url:"https://221b.jp", icon:"https://221b.jp/favicon.ico", searchText:"シャーロックホームズ 電子書籍1" },
  { id:88, label:"シャーロックホームズ 電子書籍2", url:"https://book.shishin-kyoto.com", icon:"https://book.shishin-kyoto.com/favicon.ico", searchText:"シャーロックホームズ 電子書籍2" },
  { id:89, label:"アーサーコナンドイル 電子書籍", url:"https://www.aozora.gr.jp/index_pages/person9.html", icon:"https://www.aozora.gr.jp/index_pages/person9.html/favicon.ico", searchText:"アーサーコナンドイル" },
  { id:90, label:"公式ライン Manager", url:"https://manager.line.biz/", icon:"https://manager.line.biz//favicon.ico", searchText:"公式ライン Manager" },
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
    // メモタブがないため、もし前回のタブがメモだった場合は全アプリに飛ばす
    if(lastTab === 'option' || lastTab === 'memo') lastTab = 'all-apps';
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

// --- Firebase Auth Logic ---
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
            if (data.background) saveBackground(data.background, false);
            if (data.textColor) saveTextColor(data.textColor, false);
            if (data.lastTab && data.lastTab !== 'option') activateTab(data.lastTab, false);
            console.log("Cloud data applied.");
        } else {
            saveToCloud();
        }
    } catch (e) { console.error("Error loading document: ", e); }
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
    } catch (e) { console.error("Error writing document: ", e); }
}

// ------------------------------------------------------------------
// 5. Core App Logic
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
    } catch (e) { return './icon.png'; }
}

function getDuckDuckGoFavicon(url) {
    try {
        if (!url || !url.startsWith('http')) return './icon.png';
        const domain = new URL(url).hostname;
        return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    } catch (e) { return './icon.png'; }
}

// --- 背景画像関連 ---
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
    } catch (e) { console.error('Save BG failed', e); }
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
    const dateStr = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} (${days[now.getDay()]})`;
    const timeStr = now.toTimeString().split(' ')[0];
    if(dateElement) dateElement.textContent = dateStr;
    if(clockElement) clockElement.textContent = timeStr;
    if(fyDateText) fyDateText.textContent = dateStr;
    if(fyTimeText) fyTimeText.textContent = timeStr;

    const nowMin = now.getHours() * 60 + now.getMinutes();
    let msg = "本日の予定は終了";
    for (let item of schedule) {
        const [sh, sm] = item.start.split(':').map(Number);
        const [eh, em] = item.end.split(':').map(Number);
        const sMin = sh * 60 + sm;
        const eMin = eh * 60 + em;
        if (nowMin >= sMin && nowMin < eMin) {
            const percentage = Math.floor(((nowMin - sMin) / (eMin - sMin)) * 100);
            msg = `${item.name} ${item.start} 〜 ${item.end} (${percentage}%)`;
            break;
        } else if (nowMin < sMin) {
            msg = `次は ${item.name} (${item.start}〜)`;
            break;
        }
    }
    if(countdownElement) countdownElement.textContent = msg;
}

/**
 * ★ アプリカードの生成 (urlA〜D対応版)
 */
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
    img.src = (app.icon && app.icon.startsWith('http')) ? app.icon : getFaviconUrl(app.url);
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
    header.appendChild(title);

    const btnRow = document.createElement('div');
    btnRow.className = 'card-buttons';
    btnRow.style.zIndex = '2'; 

    // カスタムボタン(urlA,B,C,D)の動的生成
    const addSubButton = (url, iconClass, tooltip) => {
        if (!url) return;
        const btn = document.createElement('button');
        btn.className = 'card-btn';
        btn.innerHTML = `<i class="${iconClass || 'fas fa-link'}"></i>`;
        btn.title = tooltip || "";
        btn.onclick = (e) => { e.stopPropagation(); window.open(url, '_blank'); };
        btnRow.appendChild(btn);
    };

    addSubButton(app.urlA, app.iconA, app.titleA);
    addSubButton(app.urlB, app.iconB, app.titleB);
    addSubButton(app.urlC, app.iconC, app.titleC);
    addSubButton(app.urlD, app.iconD, app.titleD);

    const btnFav = document.createElement('button');
    const isFav = favorites.includes(app.id);
    btnFav.className = isFav ? 'card-btn fav-active' : 'card-btn';
    btnFav.innerHTML = '<i class="fas fa-star"></i>';
    btnFav.onclick = (e) => { e.stopPropagation(); toggleFavorite(app.id); };
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
        gridContainer.appendChild(createAppCard(app));
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
        star.onclick = (e) => { e.stopPropagation(); toggleFavorite(id); };
    });
}

function toggleFavorite(id) {
    const existingIndex = favorites.indexOf(id);
    if (existingIndex !== -1) {
        favorites[existingIndex] = null;
    } else {
        const emptyIndex = favorites.indexOf(null);
        if (emptyIndex !== -1) favorites[emptyIndex] = id;
        else favorites.push(id);
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
                if(app) contentDiv = createAppCard(app);
            } else {
                const el = document.querySelector(`.accordion-item[data-id="${favId}"]`);
                if(el) {
                    const card = document.createElement('div');
                    card.className = 'app-card';
                    const left = document.createElement('div');
                    left.className = 'card-left';
                    const iconClass = String(favId).startsWith('tr-') ? 'fa-train' : 'fa-bus';
                    left.innerHTML = `<i class="fas ${iconClass}" style="font-size:32px; color:#555;"></i>`;
                    left.onclick = () => { if(!isEditMode) jumpToTraffic(favId, el); };
                    const right = document.createElement('div');
                    right.className = 'card-right';
                    const header = document.createElement('div');
                    header.className = 'card-header';
                    header.innerHTML = `<span class="card-title">${el.dataset.title}</span>`;
                    const btnRow = document.createElement('div');
                    btnRow.className = 'card-buttons';
                    const btnMove = document.createElement('button');
                    btnMove.className = 'card-btn';
                    btnMove.innerHTML = '<i class="fas fa-arrow-circle-right"></i>';
                    btnMove.onclick = (e) => { e.stopPropagation(); jumpToTraffic(favId, el); };
                    const btnFav = document.createElement('button');
                    btnFav.className = 'card-btn fav-active';
                    btnFav.innerHTML = '<i class="fas fa-star"></i>';
                    btnFav.onclick = (e) => { e.stopPropagation(); toggleFavorite(favId); };
                    btnRow.appendChild(btnMove); btnRow.appendChild(btnFav);
                    right.appendChild(header); right.appendChild(btnRow);
                    card.appendChild(left); 
                    const divi = document.createElement('div'); divi.className='card-divider'; card.appendChild(divi);
                    card.appendChild(right);
                    contentDiv = card;
                }
            }
        }
        if (contentDiv) slotDiv.appendChild(contentDiv);
        if (isEditMode) {
            slotDiv.onclick = (e) => { e.stopPropagation(); handleSlotClick(index); };
            if (selectedSlotIndex === index) slotDiv.classList.add('selected-slot');
        }
        fyContentArea.appendChild(slotDiv);
    });

    if(isEditMode) {
        fyEditBtn.textContent = '完了';
        fyEditBtn.classList.add('editing');
    } else {
        fyEditBtn.textContent = '並び替え';
        fyEditBtn.classList.remove('editing');
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
    if(isEditMode) { isEditMode = false; renderFavoritesPage(); }

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
    if (item.classList.contains('active') && iframe && !iframe.src) {
        iframe.src = iframe.dataset.src;
    }
}

function setTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
}

function reloadSpeedTest() {
    const iframe = document.getElementById('speed-test-iframe');
    if(iframe) iframe.src = iframe.src;
}

// ------------------------------------------------------------------
// 検索システム
// ------------------------------------------------------------------
function setupSearch() {
    const resultsContainer = document.getElementById('searchResults');
    if (!searchInput || !resultsContainer) return;

    const performSearch = (query) => {
        const q = query.toLowerCase().trim();
        resultsContainer.innerHTML = ''; 
        if (q.length === 0) {
            resultsContainer.classList.add('hidden');
            clearSearchBtn.classList.add('hidden');
            return;
        }
        clearSearchBtn.classList.remove('hidden');
        resultsContainer.classList.remove('hidden');

        // アプリの検索
        const appMatches = initialAppData.filter(a => a.label.toLowerCase().includes(q) || (a.searchText && a.searchText.toLowerCase().includes(q)));
        // トラフィックの検索
        const traffics = Array.from(document.querySelectorAll('.accordion-item')).map(acc => ({
            name: acc.querySelector('.accordion-header span').innerText.trim(),
            el: acc,
            type: 'traffic'
        })).filter(t => t.name.toLowerCase().includes(q));

        [...appMatches.map(a => ({...a, type:'app'})), ...traffics].forEach(item => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            const img = document.createElement('img');
            img.src = item.type === 'app' ? getFaviconUrl(item.url) : './icon.png';
            const span = document.createElement('span');
            span.innerText = item.label || item.name;
            div.appendChild(img); div.appendChild(span);

            div.onclick = () => {
                resultsContainer.classList.add('hidden');
                searchInput.value = '';
                if(item.type === 'app') {
                    activateTab('all-apps');
                    setTimeout(() => {
                        const card = document.querySelector(`.app-card[data-app-id="${item.id}"]`);
                        if(card) {
                            card.scrollIntoView({behavior:'smooth', block:'center'});
                            card.classList.add('highlight-target');
                            setTimeout(() => card.classList.remove('highlight-target'), 3000);
                        }
                    }, 200);
                } else {
                    jumpToTraffic(null, item.el);
                }
            };
            resultsContainer.appendChild(div);
        });
    };

    searchInput.addEventListener('input', (e) => performSearch(e.target.value));
    clearSearchBtn.addEventListener('click', () => { searchInput.value = ''; performSearch(''); });
}

// Global Exposure
window.activateTab = activateTab;
window.setTheme = setTheme;
window.toggleEditMode = toggleEditMode;
window.switchSubTab = switchSubTab;
window.toggleAccordion = toggleAccordion;
window.reloadSpeedTest = reloadSpeedTest;
window.openBgModal = openBgModal;
window.resetBackground = resetBackground;
