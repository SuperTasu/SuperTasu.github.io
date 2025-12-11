// --- DOM要素 ---
const mainGrid = document.getElementById('main-grid');
const bustarainContainer = document.getElementById('bustarain-container');
const optionContainer = document.getElementById('option-container');
const fyContainer = document.getElementById('fy-container');
const fyContentArea = document.getElementById('fy-content-area');
const gridContainer = document.getElementById('gridContainer');
const searchInput = document.getElementById('appSearchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const fyEditBtn = document.getElementById('fy-edit-btn'); 

const dateElement = document.getElementById('date');
const clockElement = document.getElementById('clock');
const countdownElement = document.getElementById('countdown');

// --- データ ---
const schedule = [{name:"1限",start:"08:50",end:"09:40"},{name:"休憩",start:"09:40",end:"09:50"},{name:"2限",start:"09:50",end:"10:40"},{name:"休憩",start:"10:40",end:"10:50"},{name:"3限",start:"10:50",end:"11:40"},{name:"休憩",start:"11:40",end:"11:50"},{name:"4限",start:"11:50",end:"12:40"},{name:"昼休み",start:"12:40",end:"13:20"},{name:"5限",start:"13:20",end:"14:10"},{name:"休憩",start:"14:10",end:"14:20"},{name:"6限",start:"14:20",end:"15:10"},{name:"休憩",start:"15:10",end:"15:20"},{name:"7,8限",start:"15:20",end:"17:00"}];

const initialAppData = [
    {id:1,label:"Google",url:"https://www.google.com",searchText:"Google グーグル"},
    {id:2,label:"Gmail",url:"https://mail.google.com",searchText:"Gmail Google Mail メール"},
    {id:3,label:"Calendar",url:"https://calendar.google.com",searchText:"Google Calendar カレンダー"},
    {id:4,label:"Photos",url:"https://photos.google.com",searchText:"Google Photos フォト 写真"},
    {id:5,label:"Drive",url:"https://drive.google.com",searchText:"Google Drive ドライブ"},
    {id:7,label:"X",url:"https://x.com/i/timeline",searchText:"X Twitter ツイッター"},
    {id:8,label:"Instagram",url:"https://www.instagram.com",searchText:"Instagram インスタグラム"},
    {id:9,label:"YouTube",url:"https://www.youtube.com/feed/subscriptions",searchText:"YouTube ユーチューブ"},
    {id:10,label:"YT Shorts",url:"https://www.youtube.com/feed/subscriptions/shorts",searchText:"YT Shorts YouTube ショート"},
    {id:6,label:"Yahoo!",url:"https://www.yahoo.co.jp",searchText:"Yahoo! ヤフー"},
    {id:37,label:"Amazon",url:"https://www.amazon.co.jp/",searchText:"Amazon アマゾン"},
    {id:34,label:"GitHub",url:"https://github.com",searchText:"GitHub ギットハブ"},
    {id:22,label:"ChatGPT",url:"https://chatgpt.com",searchText:"ChatGPT AI"},
    {id:24,label:"Claude AI",url:"https://claude.ai",searchText:"Claude AI クロード"},
    {id:75,label:"Perplexity",url:"https://www.perplexity.ai",searchText:"Perplexity AI パープレキシティ"},
    {id:76,label:"Gemini",url:"https://gemini.google.com/app",searchText:"Google Gemini ジェミニ"},
    {id:50,label:"画像圧縮",url:"https://www.iloveimg.com/ja/compress-image",searchText:"iloveimg compress"},
    {id:51,label:"PDF圧縮",url:"https://www.ilovepdf.com/ja/compress_pdf",searchText:"ilovepdf compress"},
    {id:54,label:"背景透過",url:"https://www.iloveimg.com/ja/remove-background",searchText:"iloveimg remove background"},
    {id:79,label:"MS Forms",url:"https://forms.office.com/",searchText:"Microsoft Forms フォーム"},
    // 必要に応じてリストを追加してください
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

// --- 初期化 ---
window.onload = function() {
    updateClock();
    setInterval(updateClock, 1000);
    
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme || 'light');

    loadBackground();
    loadTextColor(); 

    renderGrid(initialAppData);
    initBustarain();

    const lastTab = localStorage.getItem(TAB_KEY) || 'all-apps';
    activateTab(lastTab);

    searchInput.addEventListener('input', handleSearch);
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        handleSearch();
    });
};

// --- タブ切り替え ---
function activateTab(tabName) {
    // 状態保存
    localStorage.setItem(TAB_KEY, tabName);

    // すべて非表示
    mainGrid.style.display = 'none';
    fyContainer.style.display = 'none';
    bustarainContainer.style.display = 'none';
    optionContainer.style.display = 'none';

    // タブのクラスリセット
    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));

    // 対象を表示
    if (tabName === 'fy') {
        fyContainer.style.display = 'block';
        document.getElementById('tab-fy').classList.add('active');
        renderFavoritesPage();
    } else if (tabName === 'bustarain') {
        bustarainContainer.style.display = 'block';
        document.getElementById('tab-bustarain').classList.add('active');
    } else if (tabName === 'option') {
        optionContainer.style.display = 'block';
        document.getElementById('tab-option').classList.add('active');
    } else {
        // default: all-apps
        mainGrid.style.display = 'block';
        document.getElementById('tab-all-apps').classList.add('active');
    }
}

// --- 背景画像管理 ---
function saveBackground(urlData) {
    localStorage.setItem(BG_KEY, urlData);
    applyBackground(urlData);
    alert('背景を設定しました。');
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
    document.getElementById('bgUrlInput').value = '';
    alert('背景をリセットしました。');
}

// --- テキスト色管理 ---
function saveTextColor(color) {
    localStorage.setItem(TEXT_COLOR_KEY, color);
    applyTextColor(color);
}
function loadTextColor() {
    const color = localStorage.getItem(TEXT_COLOR_KEY);
    if(color) applyTextColor(color);
}
function applyTextColor(color) {
    document.documentElement.style.setProperty('--text-color-primary', color);
}
function resetTextColor() {
    localStorage.removeItem(TEXT_COLOR_KEY);
    setTheme(localStorage.getItem('theme') || 'light');
    alert('文字色をリセットしました');
}

// --- テーマ管理 ---
function setTheme(mode) {
    if (mode === 'dark') {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
}

// --- 時計 ---
function updateClock() {
    const now = new Date();
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = days[now.getDay()];
    
    dateElement.textContent = `${year}/${month}/${date} (${day})`;
    clockElement.textContent = now.toTimeString().split(' ')[0];

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
    countdownElement.textContent = msg;
}

// --- 検索機能 ---
function handleSearch() {
    const val = searchInput.value.toLowerCase().trim();
    const items = gridContainer.querySelectorAll('.icon-item');
    
    if (val.length > 0) {
        clearSearchBtn.classList.remove('hidden');
    } else {
        clearSearchBtn.classList.add('hidden');
    }

    items.forEach(item => {
        const text = item.dataset.search || "";
        if (text.includes(val)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// --- Apps グリッド描画 ---
function renderGrid(data) {
    gridContainer.innerHTML = '';
    data.forEach(app => {
        const item = createIconItem(app);
        item.dataset.search = (app.searchText || app.label).toLowerCase();
        gridContainer.appendChild(item);
    });
}

function createIconItem(app) {
    const div = document.createElement('div');
    div.className = 'icon-item';

    const a = document.createElement('a');
    a.href = app.url;
    a.className = 'icon-link';
    a.target = '_blank';

    const img = document.createElement('img');
    let domain = '';
    try {
        const urlObj = new URL(app.url);
        domain = urlObj.hostname;
    } catch(e) { domain = 'google.com'; }
    img.src = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
    img.className = 'icon-img';
    img.onerror = () => { img.src = 'https://via.placeholder.com/32?text=?'; };
    a.appendChild(img);

    const star = document.createElement('i');
    const isFav = favorites.includes(app.id);
    star.className = isFav ? 'fas fa-star fav-btn active' : 'far fa-star fav-btn';
    
    star.onclick = (e) => {
        e.preventDefault(); 
        toggleFavorite(app.id);
    };

    const label = document.createElement('div');
    label.className = 'label-text';
    label.textContent = app.label;

    div.appendChild(star);
    div.appendChild(a);
    div.appendChild(label);

    return div;
}

function initBustarain() {
    const items = document.querySelectorAll('#bustarain-container .accordion-item');
    items.forEach(item => {
        const id = item.dataset.id;
        const star = item.querySelector('.acc-fav-btn');
        if(!star) return;

        if(favorites.includes(id)) {
            star.className = 'fas fa-star acc-fav-btn active';
        } else {
            star.className = 'far fa-star acc-fav-btn';
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
    renderGrid(initialAppData); // スター状態更新のため再描画
    if (document.getElementById('tab-fy').classList.contains('active')) {
        renderFavoritesPage();
    }
    initBustarain();
}

function saveFavorites() {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
}

// --- FY (Favorites) 表示 ---
function renderFavoritesPage() {
    fyContentArea.innerHTML = '';
    
    favorites.forEach((favId, index) => {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'grid-slot';

        // 編集モード時のスロットクリック処理（並び替え用）
        slotDiv.onclick = () => {
            if (isEditMode) {
                if (selectedSlotIndex === null) {
                    selectedSlotIndex = index;
                } else {
                    // 入替実行
                    const temp = favorites[selectedSlotIndex];
                    favorites[selectedSlotIndex] = favorites[index];
                    favorites[index] = temp;
                    selectedSlotIndex = null; 
                    saveFavorites();
                }
                renderFavoritesPage();
            }
        };

        // 選択強調
        if (isEditMode && selectedSlotIndex === index) {
            slotDiv.classList.add('selected-slot');
        }

        if (favId !== null) {
            // アプリデータを検索
            const app = initialAppData.find(a => a.id === favId);
            if (app) {
                const item = createIconItem(app);
                slotDiv.appendChild(item);
            } 
            // Bustarain等のIDの場合はここで処理可能
            else if (typeof favId === 'string' && (favId.startsWith('tr-') || favId.startsWith('bs-'))) {
                // 必要ならここにウィジェット用ロジックを追加
            }
        }
        fyContentArea.appendChild(slotDiv);
    });
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    selectedSlotIndex = null; 
    
    if (isEditMode) {
        fyEditBtn.textContent = '完了';
        fyEditBtn.classList.add('editing');
        document.body.classList.add('edit-mode');
    } else {
        fyEditBtn.textContent = '並び替え';
        fyEditBtn.classList.remove('editing');
        document.body.classList.remove('edit-mode');
    }
    renderFavoritesPage();
}

// --- Bustarain アコーディオン & サブタブ ---
function toggleAccordion(header) {
    const item = header.parentElement;
    item.classList.toggle('active');
    // iframeのロード遅延対策（data-src属性がある場合）
    const iframe = item.querySelector('iframe');
    if (item.classList.contains('active') && iframe && iframe.dataset.src) {
        if (!iframe.src) iframe.src = iframe.dataset.src;
    }
}

function switchSubTab(targetId) {
    document.querySelectorAll('.sub-tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(targetId).classList.remove('hidden');

    document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
    if (targetId === 'train-content') {
        document.getElementById('sub-btn-train').classList.add('active');
    } else {
        document.getElementById('sub-btn-bus').classList.add('active');
    }
}

function reloadSpeedTest() {
    const frame = document.querySelector('.header-speed-test iframe');
    frame.src = frame.src;
}
