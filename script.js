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
let favorites = JSON.parse(localStorage.getItem(FAV_KEY)) || [];
let isEditMode = false; // 編集モードフラグ
let selectedFavId = null; // 入れ替え用の一時選択ID

// --- 初期化 ---
window.onload = function() {
    updateClock();
    setInterval(updateClock, 1000);
    
    // テーマ設定
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme) setTheme(savedTheme);

    // 背景設定
    loadBackground();

    // Option初期化
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

// --- 時計 (新フォーマット) ---
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
    const idx = favorites.indexOf(id);
    if (idx === -1) {
        favorites.push(id);
    } else {
        favorites.splice(idx, 1);
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
}

// --- FY (Favorites) 表示 & タップ交換 ---
function renderFavoritesPage() {
    fyContentArea.innerHTML = '';
    
    if (favorites.length === 0) {
        fyContentArea.innerHTML = '<p style="width:100%; text-align:center; color:#888;">お気に入りはまだ登録されていません。</p>';
        return;
    }

    favorites.forEach((favId) => {
        let itemDiv = null;
        
        if (typeof favId === 'number') {
            const app = initialAppData.find(a => a.id === favId);
            if(app) itemDiv = createIconItem(app);
        } else {
            const el = document.querySelector(`.accordion-item[data-id="${favId}"]`);
            if(el) {
                const title = el.dataset.title;
                itemDiv = document.createElement('div');
                itemDiv.className = 'icon-item';
                
                const linkDiv = document.createElement('div');
                linkDiv.className = 'icon-link';
                linkDiv.style.cursor = 'pointer';
                linkDiv.innerHTML = '<i class="fas fa-bus" style="font-size:24px;"></i>';
                
                // 通常モード時のクリックイベント
                linkDiv.onclick = () => {
                    if(isEditMode) return; // 編集モード中は親のクリックが優先
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

                itemDiv.appendChild(star);
                itemDiv.appendChild(linkDiv);
                itemDiv.appendChild(label);
            }
        }

        if(itemDiv) {
            // 編集モード時: 全体をクリック可能にして交換処理を呼ぶ
            if(isEditMode) {
                // CSSで .edit-mode .icon-link { pointer-events: none; } となっているため
                // itemDiv (親) の onclick が発火する
                itemDiv.onclick = () => {
                    handleSwapClick(favId);
                };
                
                // 選択中のスタイル適用
                if (selectedFavId === favId) {
                    itemDiv.classList.add('selected-swap');
                }
            }
            fyContentArea.appendChild(itemDiv);
        }
    });

    if(isEditMode) {
        fyContentArea.classList.add('edit-mode');
        fyEditBtn.textContent = '完了';
        fyEditBtn.classList.add('editing');
    } else {
        fyContentArea.classList.remove('edit-mode');
        fyEditBtn.textContent = '並び替え';
        fyEditBtn.classList.remove('editing');
        selectedFavId = null; // リセット
    }
}

// 編集モード切替
function toggleEditMode() {
    isEditMode = !isEditMode;
    selectedFavId = null; // モード切替時に選択解除
    renderFavoritesPage();
}

// タップ交換ロジック
function handleSwapClick(clickedFavId) {
    // まだ何も選択されていない場合
    if (selectedFavId === null) {
        selectedFavId = clickedFavId;
        renderFavoritesPage(); // 再描画して選択スタイル適用
        return;
    }

    // 同じものをタップした場合 -> 選択解除
    if (selectedFavId === clickedFavId) {
        selectedFavId = null;
        renderFavoritesPage();
        return;
    }

    // 違うものをタップした場合 -> 入れ替え実行
    const index1 = favorites.indexOf(selectedFavId);
    const index2 = favorites.indexOf(clickedFavId);

    if (index1 !== -1 && index2 !== -1) {
        // 配列要素の交換
        const temp = favorites[index1];
        favorites[index1] = favorites[index2];
        favorites[index2] = temp;
        
        saveFavorites();
        selectedFavId = null; // 選択解除
        renderFavoritesPage(); // 再描画
    }
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
        renderFavoritesPage(); // 編集モード終了して再描画
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
