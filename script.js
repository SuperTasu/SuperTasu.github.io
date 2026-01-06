// ------------------------------------------------------------------
// 1. Firebase Imports & Configuration
// ------------------------------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ★★★ ご自身のAPIキーを入れてください ★★★
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
// アカウント切り替えを促す設定
provider.setCustomParameters({ prompt: 'select_account' });

// ------------------------------------------------------------------
// 2. DOM Elements & Variables
// ------------------------------------------------------------------

const mainGrid = document.getElementById('main-grid');
const bustarainContainer = document.getElementById('bustarain-container');
const optionContainer = document.getElementById('option-container');
const fyContainer = document.getElementById('fy-container');
const fyContentArea = document.getElementById('fy-content-area');
const gridContainer = document.getElementById('gridContainer');
const fyEditBtn = document.getElementById('fy-edit-btn'); 
const fySectionBtn = document.getElementById('fy-section-btn');
const dateElement = document.getElementById('date');
const clockElement = document.getElementById('clock');
const countdownElement = document.getElementById('countdown');
const authBtn = document.getElementById('auth-btn');
const userAvatar = document.getElementById('user-avatar');
const userNameDisplay = document.getElementById('user-name-display');

// FY専用時計
const fyDateText = document.getElementById('fy-date-text');
const fyTimeText = document.getElementById('fy-time-text');

// ------------------------------------------------------------------
// 3. Application Data
// ------------------------------------------------------------------

const schedule = [{name:"1限",start:"08:50",end:"09:40"},{name:"休憩",start:"09:40",end:"09:50"},{name:"2限",start:"09:50",end:"10:40"},{name:"休憩",start:"10:40",end:"10:50"},{name:"3限",start:"10:50",end:"11:40"},{name:"休憩",start:"11:40",end:"11:50"},{name:"4限",start:"11:50",end:"12:40"},{name:"昼休み",start:"12:40",end:"13:20"},{name:"5限",start:"13:20",end:"14:10"},{name:"休憩",start:"14:10",end:"14:20"},{name:"6限",start:"14:20",end:"15:10"},{name:"休憩",start:"15:10",end:"15:20"},{name:"7,8限",start:"15:20",end:"17:00"}];

const initialAppData = [
  {id:1,label:"Google",url:"https://www.google.com",searchText:"Google グーグル"},
  {id:2,label:"Gmail",url:"https://mail.google.com",searchText:"Gmail Google Mail メール"},
  {id:9,label:"YouTube",url:"https://www.youtube.com",searchText:"YouTube ユーチューブ"},
  {id:6,label:"Yahoo!",url:"https://www.yahoo.co.jp",searchText:"Yahoo! ヤフー"},
  {id:20,label:"神戸市交通局",url:"https://kotsu.city.kobe.lg.jp/",searchText:"神戸市交通局 地下鉄 バス"},
  // ... (必要なデータを維持)
];
// デモ用にデータを短縮していますが、元の全リストをご使用ください

const FAV_KEY = 'myLinkAppFavorites';
const SECTION_KEY = 'myLinkAppSections';
const BG_KEY = 'myLinkAppBg';
const TAB_KEY = 'myLinkAppLastTab';
const BUS_FILTER_KEY = 'myLinkAppBusFilter';

let favorites = JSON.parse(localStorage.getItem(FAV_KEY)) || [];
if (favorites.length < 60) {
    const padding = new Array(60 - favorites.length).fill(null);
    favorites = favorites.concat(padding);
}
let sections = JSON.parse(localStorage.getItem(SECTION_KEY)) || [];

let isEditMode = false;
let isSectionMode = false;
let sectionStartSlot = null;
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
    renderGrid(initialAppData);
    initBustarain();

    const lastTab = localStorage.getItem(TAB_KEY) || 'all-apps';
    activateTab(lastTab);
    
    // バスフィルター初期化
    const savedFilter = localStorage.getItem(BUS_FILTER_KEY) || 'ALL';
    document.getElementById('bus-filter').value = savedFilter;
    filterBusContent();

    adjustSpeedTestPosition();
    window.addEventListener('resize', adjustSpeedTestPosition);
    setupNetworkStatus();
    setupSpeedTestAutoRefresh();
};

function setupNetworkStatus() {
    const statusEl = document.getElementById('network-status');
    const updateStatus = () => {
        if (navigator.onLine) {
            statusEl.className = 'online';
            statusEl.innerHTML = '<i class="fas fa-wifi"></i> <span>ON</span>';
        } else {
            statusEl.className = 'offline';
            statusEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>OFF</span>';
        }
    };
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
}

function setupSpeedTestAutoRefresh() {
    setInterval(() => {
        if (navigator.onLine) reloadSpeedTest();
    }, 120000);
}

// --- Auth Login / Switch ---
authBtn.addEventListener('click', () => {
    // ログイン済みならログアウトするか聞くのではなく、アカウント切り替え機能としてPopupを開く
    signInWithPopup(auth, provider).then((result) => {
        console.log("Account Switched/Logged in");
    }).catch((error) => {
        console.error('Auth Error:', error);
        alert("認証エラー: " + error.message);
    });
});

onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
        const icon = authBtn.querySelector('.fa-google');
        if(icon) icon.style.display = 'none';
        userAvatar.style.display = 'block';
        userAvatar.src = user.photoURL;
        userNameDisplay.style.display = 'inline';
        userNameDisplay.textContent = user.displayName;
        authBtn.title = `アカウント切り替え (${user.displayName})`;
        await loadFromCloud();
    } else {
        const icon = authBtn.querySelector('.fa-google');
        if(icon) icon.style.display = 'block';
        userAvatar.style.display = 'none';
        userNameDisplay.style.display = 'none';
        authBtn.title = "Googleログイン";
    }
});

// --- Cloud Sync ---
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
            }
            if (data.sections) {
                sections = data.sections;
                localStorage.setItem(SECTION_KEY, JSON.stringify(sections));
            }
            if (data.busFilter) {
                document.getElementById('bus-filter').value = data.busFilter;
                localStorage.setItem(BUS_FILTER_KEY, data.busFilter);
                filterBusContent();
            }
            if (data.background) saveBackground(data.background, false);
            renderGrid(initialAppData);
            renderFavoritesPage();
            initBustarain();
        } else {
            saveToCloud();
        }
    } catch (e) {
        console.error("Cloud Load Error: ", e);
    }
}

async function saveToCloud() {
    if (!currentUser) return;
    try {
        const dataToSave = {
            favorites: favorites,
            sections: sections,
            background: localStorage.getItem(BG_KEY) || 'none',
            busFilter: localStorage.getItem(BUS_FILTER_KEY) || 'ALL',
            updatedAt: new Date()
        };
        await setDoc(doc(db, "users", currentUser.uid), dataToSave, { merge: true });
    } catch (e) {
        console.error("Cloud Save Error: ", e);
    }
}

// ------------------------------------------------------------------
// 5. Core Functions
// ------------------------------------------------------------------

function adjustSpeedTestPosition() {
    const iframe = document.getElementById('speed-test-iframe');
    const refreshBtn = document.getElementById('speed-test-refresh-button');
    const headerContainer = document.getElementById('header-speed-test-container');
    const fyPlaceholder = document.getElementById('fy-speed-test-placeholder');

    if (!iframe || !refreshBtn || !headerContainer || !fyPlaceholder) return;
    if (window.innerWidth <= 650) {
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
    if (!url || !url.startsWith('http')) return './icon.png';
    return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(url)}&size=128`;
}

function updateClock() {
    const now = new Date();
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const dateStr = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} (${days[now.getDay()]})`;
    const timeStr = now.toTimeString().split(' ')[0];
    
    dateElement.textContent = dateStr;
    clockElement.textContent = timeStr;
    if (fyContainer.style.display !== 'none') {
        fyDateText.textContent = dateStr;
        fyTimeText.textContent = timeStr;
    }

    const nowMin = now.getHours() * 60 + now.getMinutes();
    let msg = "予定終了";
    for (let item of schedule) {
        const [sh, sm] = item.start.split(':').map(Number);
        const [eh, em] = item.end.split(':').map(Number);
        const sMin = sh * 60 + sm;
        const eMin = eh * 60 + em;
        if (nowMin >= sMin && nowMin < eMin) {
            msg = `${item.name} (${item.start}〜)`;
            break;
        } else if (nowMin < sMin) {
            msg = `次: ${item.name} (${item.start}〜)`;
            break;
        }
    }
    countdownElement.textContent = msg;
}

// --- Card Creation ---
function createAppCard(app) {
    const card = document.createElement('div');
    card.className = 'app-card';
    card.dataset.appId = app.id;
    
    const mainLink = document.createElement('a');
    mainLink.href = app.url;
    Object.assign(mainLink.style, { position:'absolute', top:'0', left:'0', width:'100%', height:'100%', zIndex:'1', borderRadius:'28px' });
    
    const left = document.createElement('div');
    left.className = 'card-left';
    const img = document.createElement('img');
    img.src = getFaviconUrl(app.url);
    img.onerror = () => { img.src = './icon.png'; };
    left.appendChild(img);

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
    
    const btnSame = document.createElement('button');
    btnSame.className = 'card-btn';
    btnSame.innerHTML = '<i class="fas fa-arrow-circle-right"></i>';
    btnSame.onclick = (e) => { e.stopPropagation(); window.location.href = app.url; };

    const btnFav = document.createElement('button');
    const isFav = favorites.includes(app.id);
    btnFav.className = isFav ? 'card-btn fav-active' : 'card-btn';
    btnFav.innerHTML = '<i class="fas fa-star"></i>';
    btnFav.onclick = (e) => { e.stopPropagation(); toggleFavorite(app.id); };

    btnRow.appendChild(btnSame);
    btnRow.appendChild(btnFav);
    right.appendChild(header);
    right.appendChild(btnRow);

    card.appendChild(left);
    card.appendChild(document.createElement('div')).className='card-divider';
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

// --- FY / Favorites Logic ---
function renderFavoritesPage() {
    fyContentArea.innerHTML = '';
    
    favorites.forEach((favId, index) => {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'grid-slot';
        
        // 区間表示ロジック
        const section = sections.find(s => index >= s.start && index <= s.end);
        if (section) {
            slotDiv.classList.add('section-grouped');
            if (index === section.start) {
                slotDiv.classList.add('section-start');
                const label = document.createElement('div');
                label.className = 'section-label';
                label.textContent = section.label;
                
                // 区間削除ボタン (区間設定モード時のみ)
                if (isSectionMode) {
                   label.textContent += " ×";
                   label.style.cursor = "pointer";
                   label.onclick = (e) => { e.stopPropagation(); removeSection(section); };
                }
                slotDiv.appendChild(label);
            } else if (index === section.end) {
                slotDiv.classList.add('section-end');
            } else {
                slotDiv.classList.add('section-mid');
            }
        }

        if (favId !== null) {
            // データからカード生成 (アプリ or 交通情報)
            let contentDiv = null;
            if (typeof favId === 'number') {
                const app = initialAppData.find(a => a.id === favId);
                if (app) contentDiv = createAppCard(app);
            } else {
                // Traffic Item
                const el = document.querySelector(`.accordion-item[data-id="${favId}"]`);
                if (el) {
                    const titleStr = el.dataset.title;
                    const card = document.createElement('div');
                    card.className = 'app-card';
                    let iconClass = 'fa-bus';
                    if (String(favId).startsWith('tr-')) iconClass = 'fa-train';
                    
                    card.innerHTML = `
                        <div class="card-left"><i class="fas ${iconClass}" style="font-size:32px; color:#555;"></i></div>
                        <div class="card-divider"></div>
                        <div class="card-right">
                            <div class="card-header"><span class="card-title">${titleStr}</span></div>
                            <div class="card-buttons">
                                <button class="card-btn" onclick="event.stopPropagation(); jumpToTraffic('${favId}', this)"><i class="fas fa-arrow-circle-right"></i></button>
                                <button class="card-btn fav-active" onclick="event.stopPropagation(); toggleFavorite('${favId}')"><i class="fas fa-star"></i></button>
                            </div>
                        </div>
                    `;
                    card.querySelector('.card-left').onclick = () => { if(!isEditMode && !isSectionMode) jumpToTraffic(favId, el); };
                    contentDiv = card;
                }
            }
            if(contentDiv) slotDiv.appendChild(contentDiv);
        }

        // イベントハンドリング
        if (isEditMode) {
            slotDiv.onclick = (e) => { e.stopPropagation(); handleSwapSlotClick(index); };
            if (selectedSlotIndex === index) slotDiv.classList.add('selected-slot');
        } else if (isSectionMode) {
            slotDiv.onclick = (e) => { e.stopPropagation(); handleSectionSlotClick(index); };
            if (sectionStartSlot === index) slotDiv.classList.add('section-selected');
        }

        fyContentArea.appendChild(slotDiv);
    });

    updateEditButtonsUI();
}

function updateEditButtonsUI() {
    if (isEditMode) {
        fyContentArea.classList.add('edit-mode');
        fyEditBtn.textContent = '完了';
        fyEditBtn.style.background = '#667eea'; fyEditBtn.style.color = '#fff';
        fySectionBtn.disabled = true;
    } else {
        fyContentArea.classList.remove('edit-mode');
        fyEditBtn.textContent = '並び替え';
        fyEditBtn.style.background = ''; fyEditBtn.style.color = '';
        fySectionBtn.disabled = false;
    }

    if (isSectionMode) {
        fyContentArea.classList.add('section-mode');
        fySectionBtn.textContent = '設定終了';
        fySectionBtn.style.background = '#28a745'; fySectionBtn.style.color = '#fff';
        fyEditBtn.disabled = true;
    } else {
        fyContentArea.classList.remove('section-mode');
        fySectionBtn.textContent = '区間設定';
        fySectionBtn.style.background = ''; fySectionBtn.style.color = '';
        fyEditBtn.disabled = false;
    }
}

// --- Swap Logic ---
function toggleEditMode() {
    isEditMode = !isEditMode;
    selectedSlotIndex = null;
    renderFavoritesPage();
}

function handleSwapSlotClick(index) {
    if (selectedSlotIndex === null) {
        if (favorites[index] === null) return;
        selectedSlotIndex = index;
    } else if (selectedSlotIndex === index) {
        selectedSlotIndex = null;
    } else {
        // Swap
        const temp = favorites[selectedSlotIndex];
        favorites[selectedSlotIndex] = favorites[index];
        favorites[index] = temp;
        // Swap sections if affected? (Advanced: removing sections if broken)
        // 今回は区間設定が崩れるのを防ぐため、スワップ後に区間チェックを行うのが理想ですが、
        // 簡易的に区間データは「インデックス固定」として扱います。
        saveFavorites();
        selectedSlotIndex = null;
    }
    renderFavoritesPage();
}

// --- Section Logic ---
function toggleSectionMode() {
    isSectionMode = !isSectionMode;
    sectionStartSlot = null;
    renderFavoritesPage();
}

function handleSectionSlotClick(index) {
    if (sectionStartSlot === null) {
        sectionStartSlot = index;
        renderFavoritesPage(); // Highlight start
    } else {
        const start = Math.min(sectionStartSlot, index);
        const end = Math.max(sectionStartSlot, index);
        
        // 既存の区間と重複チェック
        const overlap = sections.some(s => (start <= s.end && end >= s.start));
        if (overlap) {
            alert("既存の区間と重なっています。");
            sectionStartSlot = null;
            renderFavoritesPage();
            return;
        }

        const name = prompt("区間の名前を入力してください");
        if (name) {
            sections.push({ start, end, label: name });
            saveSections();
        }
        sectionStartSlot = null;
        renderFavoritesPage();
    }
}

function removeSection(sectionToRemove) {
    if (confirm(`区間「${sectionToRemove.label}」を削除しますか？`)) {
        sections = sections.filter(s => s !== sectionToRemove);
        saveSections();
        renderFavoritesPage();
    }
}

function saveFavorites() {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    if (currentUser) saveToCloud();
}
function saveSections() {
    localStorage.setItem(SECTION_KEY, JSON.stringify(sections));
    if (currentUser) saveToCloud();
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

// --- Bustarain Logic ---
function initBustarain() {
    const items = document.querySelectorAll('#bustarain-container .accordion-item');
    items.forEach(item => {
        const id = item.dataset.id;
        const star = item.querySelector('.acc-fav-btn');
        if(!star) return;
        star.className = favorites.includes(id) ? 'fas fa-star acc-fav-btn active' : 'far fa-star acc-fav-btn';
        star.onclick = (e) => { e.stopPropagation(); toggleFavorite(id); };
    });
}

function switchSubTab(targetId) {
    document.querySelectorAll('.sub-tab-content').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(targetId);
    if(target) target.classList.remove('hidden');
    
    document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
    // ボタンのアクティブ化ロジック (親要素などから判定)
    if (targetId === 'train-content') document.querySelector("button[onclick*='train']").classList.add('active');
    else if (targetId === 'bus-content') document.querySelector("button[onclick*='bus']").classList.add('active');

    // バスの場合、フィルター表示切り替え
    const filterSelect = document.getElementById('bus-filter');
    if (targetId === 'bus-content') filterSelect.classList.remove('hidden');
    else filterSelect.classList.add('hidden');
}

function filterBusContent() {
    const filterVal = document.getElementById('bus-filter').value;
    const groupAll = document.querySelector('.bus-group-all');
    const groupNonSt = document.querySelector('.bus-group-nonst');
    
    if (filterVal === 'ALL') {
        groupAll.style.display = 'block';
        groupNonSt.style.display = 'none';
    } else {
        groupAll.style.display = 'none';
        groupNonSt.style.display = 'block';
    }
    localStorage.setItem(BUS_FILTER_KEY, filterVal);
    if (currentUser) saveToCloud();
}

function jumpToTraffic(favId, element) {
    // 交通情報の要素を見つけてジャンプする処理
    const realElement = document.querySelector(`.accordion-item[data-id="${favId}"]`);
    if(realElement) {
        activateTab('bustarain');
        const parentId = realElement.closest('.sub-tab-content').id;
        switchSubTab(parentId);
        
        // バスの場合、フィルタも合わせる
        if (parentId === 'bus-content') {
            const isAllGroup = realElement.closest('.bus-group-all');
            const select = document.getElementById('bus-filter');
            select.value = isAllGroup ? 'ALL' : 'NON-ST';
            filterBusContent();
        }

        if(!realElement.classList.contains('active')) toggleAccordion(realElement.querySelector('.accordion-header'));
        setTimeout(() => { realElement.scrollIntoView({behavior: 'smooth', block: 'center'}); }, 100);
    }
}

function toggleAccordion(header) {
    const item = header.parentElement;
    const iframe = item.querySelector('iframe');
    item.classList.toggle('active');
    if (item.classList.contains('active') && iframe && !iframe.src) iframe.src = iframe.dataset.src;
}

// --- Option (Background) Logic ---
window.handleBgUpload = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            saveBackground(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
};

function saveBackground(urlData, sync = true) {
    localStorage.setItem(BG_KEY, urlData);
    document.body.style.setProperty('--custom-bg-image', urlData === 'none' ? 'none' : `url('${urlData}')`);
    if (sync) alert('背景を設定しました');
    if (sync && currentUser) saveToCloud();
}
function loadBackground() {
    const savedBg = localStorage.getItem(BG_KEY);
    if (savedBg) saveBackground(savedBg, false);
}
window.resetBackground = function() {
    saveBackground('none');
};

// --- Tab Switching ---
function activateTab(tabName) {
    document.querySelectorAll('.main-grid, #bustarain-container, #option-container, #fy-container').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));

    // モードリセット
    isEditMode = false; isSectionMode = false;
    updateEditButtonsUI();

    localStorage.setItem(TAB_KEY, tabName);
    if (currentUser) saveToCloud();

    if (tabName === 'all-apps') {
        mainGrid.style.display = 'block';
        document.getElementById('tab-all-apps').classList.add('active');
    } else if (tabName === 'bustarain') {
        bustarainContainer.style.display = 'block';
        document.getElementById('tab-bustarain').classList.add('active');
    } else if (tabName === 'option') {
        optionContainer.style.display = 'block';
        document.getElementById('tab-option').classList.add('active');
    } else if (tabName === 'fy') {
        fyContainer.style.display = 'block';
        document.getElementById('tab-fy').classList.add('active');
        renderFavoritesPage();
    }
    adjustSpeedTestPosition();
}

// --- Global Exports ---
window.activateTab = activateTab;
window.setTheme = (theme) => {
    localStorage.setItem('theme', theme);
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
};
window.reloadSpeedTest = () => { const f = document.getElementById('speed-test-iframe'); if(f) f.src = f.src; };
window.toggleEditMode = toggleEditMode;
window.toggleSectionMode = toggleSectionMode;
window.switchSubTab = switchSubTab;
window.filterBusContent = filterBusContent;
window.toggleAccordion = toggleAccordion;
window.initialAppData = initialAppData;
window.getFaviconUrl = getFaviconUrl;
