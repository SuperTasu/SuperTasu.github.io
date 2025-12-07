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

// 時計関連
const dateElement = document.getElementById('date');
const clockElement = document.getElementById('clock');
const countdownElement = document.getElementById('countdown');

// --- データ ---
const schedule = [{name:"1限",start:"08:50",end:"09:40"},{name:"休憩",start:"09:40",end:"09:50"},{name:"2限",start:"09:50",end:"10:40"},{name:"休憩",start:"10:40",end:"10:50"},{name:"3限",start:"10:50",end:"11:40"},{name:"休憩",start:"11:40",end:"11:50"},{name:"4限",start:"11:50",end:"12:40"},{name:"昼休み",start:"12:40",end:"13:20"},{name:"5限",start:"13:20",end:"14:10"},{name:"休憩",start:"14:10",end:"14:20"},{name:"6限",start:"14:20",end:"15:10"},{name:"休憩",start:"15:10",end:"15:20"},{name:"7限",start:"15:20",end:"16:10"},{name:"休憩",start:"16:10",end:"16:40"},{name:"8限",start:"16:40",end:"17:30"},{name:"休憩",start:"17:30",end:"17:40"},{name:"9限",start:"17:40",end:"18:30"}];

const initialAppData = [
    {id:1,label:"Google",url:"https://www.google.com",icon:"https://www.google.com/favicon.ico",searchText:"Google グーグル"},
    {id:2,label:"Gmail",url:"https://mail.google.com",icon:"https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",searchText:"Gmail Google Mail メール"},
    {id:35,label:"Chat",url:"https://chat.google.com",icon:"https://ssl.gstatic.com/dynamite/images/favicon/chat_2020q4_192.png",searchText:"Google Chat チャット"},
    {id:3,label:"Calendar",url:"https://calendar.google.com",icon:"https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_3_2x.png",searchText:"Google Calendar カレンダー"},
    {id:4,label:"Photos",url:"https://photos.google.com",icon:"https://ssl.gstatic.com/images/branding/product/1x/photos_48dp.png",searchText:"Google Photos フォト 写真"},
    {id:5,label:"Drive",url:"https://drive.google.com",icon:"https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png",searchText:"Google Drive ドライブ"},
    {id:9,label:"YouTube",url:"https://www.youtube.com/feed/subscriptions",icon:"https://www.youtube.com/favicon.ico",searchText:"YouTube ユーチューブ"},
    {id:7,label:"X",url:"https://x.com/i/timeline",icon:"https://x.com/favicon.ico",searchText:"X Twitter ツイッター"},
    {id:8,label:"Instagram",url:"https://www.instagram.com",icon:"https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png",searchText:"Instagram インスタグラム"},
    {id:6,label:"Yahoo!",url:"https://www.yahoo.co.jp",icon:"https://www.yahoo.co.jp/favicon.ico",searchText:"Yahoo! ヤフー"},
    {id:22,label:"ChatGPT",url:"https://chatgpt.com",icon:"https://chat.openai.com/favicon.ico",searchText:"ChatGPT AI"},
    {id:20,label:"神戸市交通局",url:"https://kotsu.city.kobe.lg.jp/",icon:"https://kotsu.city.kobe.lg.jp/common/img/favicon.ico",searchText:"神戸市交通局 地下鉄 バス"},
    {id:21,label:"GigaFile",url:"https://gigafile.nu/",icon:"https://gigafile.nu/favicon.ico",searchText:"GigaFile ギガファイル便"}
];

const FAV_KEY = 'myLinkAppFavorites';
const BG_KEY = 'myLinkAppBg'; 

// favorites は [id, null, id, id, null...] のように空き情報を含む配列になる
// 初期サイズは最低24マス確保
let favorites = JSON.parse(localStorage.getItem(FAV_KEY)) || [];
if (favorites.length < 24) {
    // 既存データ（IDのみの配列）から移行する場合や新規の場合
    // 空きスロットで埋める
    const padding = new Array(24 - favorites.length).fill(null);
    favorites = favorites.concat(padding);
}

let isEditMode = false; 
let selectedSlotIndex = null; // タップで移動用：選択されたスロットのインデックス

// --- 初期化 ---
window.onload = function() {
    updateClock();
    setInterval(updateClock, 1000);
    
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme) setTheme(savedTheme);

    loadBackground();

    if (typeof initOptionTabContent === 'function') {
        initOptionTabContent();
    }

    renderGrid(initialAppData);
    initBustarain();

    searchInput.addEventListener('input', handleSearch);
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        handleSearch();
    });
};

// --- 背景画像管理 ---
function saveBackground(urlData) {
    try {
        localStorage.setItem(BG_KEY, urlData);
        applyBackground(urlData);
        alert('背景を設定しました。');
    } catch (e) {
        console.error(e);
        alert('保存に失敗しました（データ量が大きすぎる可能性があります）。');
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
    alert('背景をリセットしました。');
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

// --- Apps グリッド描画 ---
function renderGrid(data) {
    gridContainer.innerHTML = '';
    data.forEach(app => {
        const item = createIconItem(app);
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
    img.src = app.icon;
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
    // favorites配列内に存在するか確認
    const existingIndex = favorites.indexOf(id);

    if (existingIndex !== -1) {
        // 既に存在する場合は削除（その位置をnullにする）
        favorites[existingIndex] = null;
    } else {
        // 新規追加：最初の空きスロット(null)を探して入れる
        const emptyIndex = favorites.indexOf(null);
        if (emptyIndex !== -1) {
            favorites[emptyIndex] = id;
        } else {
            // 空きがない場合は末尾に追加
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
    // 末尾の連続するnullを削除してから保存すると容量節約になるが、
    // マス目位置を固定したい場合はそのまま保存するほうが良い
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
}

// --- FY (Favorites) 表示 & タップ移動ロジック ---
function renderFavoritesPage() {
    fyContentArea.innerHTML = '';
    
    // favorites配列（null含む）をループしてスロットを描画
    // 最低でも24個などの固定枠を表示したい場合はループ回数を固定する手もあるが
    // ここではfavorites配列長に依存させる（toggleFavoriteで自動拡張される）
    
    favorites.forEach((favId, index) => {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'grid-slot';
        if (favId === null) slotDiv.classList.add('empty');
        
        // アイコン要素の生成（中身がある場合）
        let contentDiv = null;
        if (favId !== null) {
            if (typeof favId === 'number') {
                const app = initialAppData.find(a => a.id === favId);
                if(app) contentDiv = createIconItem(app);
            } else {
                // Bustarainアイテム
                const el = document.querySelector(`.accordion-item[data-id="${favId}"]`);
                if(el) {
                    const title = el.dataset.title;
                    contentDiv = document.createElement('div');
                    contentDiv.className = 'icon-item';
                    
                    const linkDiv = document.createElement('div');
                    linkDiv.className = 'icon-link';
                    linkDiv.style.cursor = 'pointer';
                    linkDiv.innerHTML = '<i class="fas fa-bus" style="font-size:24px;"></i>';
                    
                    linkDiv.onclick = () => {
                        if(isEditMode) return;
                        activateTab('bustarain');
                        const parentTabId = el.parentElement.id;
                        switchSubTab(parentTabId);
                        if(!el.classList.contains('active')) toggleAccordion(el.querySelector('.accordion-header'));
                        setTimeout(() => { el.scrollIntoView({behavior: 'smooth', block: 'center'}); }, 100);
                    };

                    const star = document.createElement('i');
                    star.className = 'fas fa-star fav-btn active';
                    star.onclick = (e) => { e.stopPropagation(); toggleFavorite(favId); };

                    const label = document.createElement('div');
                    label.className = 'label-text';
                    label.textContent = title;

                    contentDiv.appendChild(star);
                    contentDiv.appendChild(linkDiv);
                    contentDiv.appendChild(label);
                }
            }
        }

        if (contentDiv) {
            slotDiv.appendChild(contentDiv);
        }

        // 編集モード時のイベント
        if (isEditMode) {
            slotDiv.onclick = () => {
                handleSlotClick(index);
            };
            
            // 選択中ハイライト
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
    } else {
        fyContentArea.classList.remove('edit-mode');
        fyEditBtn.textContent = '並び替え';
        fyEditBtn.classList.remove('editing');
        selectedSlotIndex = null;
    }
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    selectedSlotIndex = null;
    renderFavoritesPage();
}

function handleSlotClick(clickedIndex) {
    // まだ何も選択されていない場合
    if (selectedSlotIndex === null) {
        // 空のスロットを選んでも何も起きない（移動するものがない）
        if (favorites[clickedIndex] === null) return;
        
        selectedSlotIndex = clickedIndex;
        renderFavoritesPage(); // 再描画して選択スタイル適用
        return;
    }

    // 同じ場所をタップ -> 選択解除
    if (selectedSlotIndex === clickedIndex) {
        selectedSlotIndex = null;
        renderFavoritesPage();
        return;
    }

    // 違う場所をタップ -> 移動 or 入れ替え
    // 空きスロットなら移動、埋まっていれば交換
    const temp = favorites[selectedSlotIndex];
    favorites[selectedSlotIndex] = favorites[clickedIndex];
    favorites[clickedIndex] = temp;
    
    saveFavorites();
    selectedSlotIndex = null; // 移動完了で選択解除
    renderFavoritesPage();
}


// --- 共通 ---
function activateTab(tabName) {
    mainGrid.style.display = 'none';
    bustarainContainer.style.display = 'none';
    optionContainer.style.display = 'none';
    fyContainer.style.display = 'none';
    
    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
    document.querySelector('.search-wrapper').classList.add('hidden'); 

    if(isEditMode) {
        isEditMode = false;
        renderFavoritesPage();
    }

    if (tabName === 'all-apps') {
        mainGrid.style.display = 'block';
        document.getElementById('tab-all-apps').classList.add('active');
        document.querySelector('.search-wrapper').classList.remove('hidden');
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

function handleSearch() {
    const query = searchInput.value.toLowerCase();
    clearSearchBtn.classList.toggle('hidden', query.length === 0);
    const filtered = initialAppData.filter(app => {
        return (app.label && app.label.toLowerCase().includes(query)) ||
               (app.searchText && app.searchText.toLowerCase().includes(query));
    });
    renderGrid(filtered);
}

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
}

function reloadSpeedTest() {
    const iframe = document.querySelector('.header-speed-test iframe');
    iframe.src = iframe.src;
}
