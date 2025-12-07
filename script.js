// --- DOM要素の取得 ---
const mainGrid = document.getElementById('main-grid');
const bustarainContainer = document.getElementById('bustarain-container');
const optionContainer = document.getElementById('option-container');
const fyContainer = document.getElementById('fy-container');
const fyContentArea = document.getElementById('fy-content-area');

const gridContainer = document.getElementById('gridContainer');
const recentlyUsedGridContainer = document.getElementById('recentlyUsedGridContainer');
const recentlyUsedContainer = document.getElementById('recently-used-apps-container');
const searchInput = document.getElementById('appSearchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');

// 時計・日付要素
const dateElement = document.getElementById('date');
const clockElement = document.getElementById('clock');
const countdownElement = document.getElementById('countdown');

// --- データ定義 ---
const schedule = [
    {name:"1限",start:"08:50",end:"09:40"},{name:"休憩",start:"09:40",end:"09:50"},
    {name:"2限",start:"09:50",end:"10:40"},{name:"休憩",start:"10:40",end:"10:50"},
    {name:"3限",start:"10:50",end:"11:40"},{name:"休憩",start:"11:40",end:"11:50"},
    {name:"4限",start:"11:50",end:"12:40"},{name:"昼休み",start:"12:40",end:"13:20"},
    {name:"5限",start:"13:20",end:"14:10"},{name:"休憩",start:"14:10",end:"14:20"},
    {name:"6限",start:"14:20",end:"15:10"},{name:"休憩",start:"15:10",end:"15:20"},
    {name:"7限",start:"15:20",end:"16:10"},{name:"休憩",start:"16:10",end:"16:40"},
    {name:"8限",start:"16:40",end:"17:30"},{name:"休憩",start:"17:30",end:"17:40"},
    {name:"9限",start:"17:40",end:"18:30"}
];

// アプリデータ (提供されたもの + 補完)
const initialAppData = [
    {id:1,label:"Google",url:"https://www.google.com",icon:"https://www.google.com/favicon.ico",searchText:"Google グーグル"},
    {id:2,label:"Gmail",url:"https://mail.google.com",icon:"https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",searchText:"Gmail Google Mail メール"},
    {id:3,label:"Calendar",url:"https://calendar.google.com",icon:"https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_3_2x.png",searchText:"Google Calendar カレンダー"},
    {id:4,label:"Photos",url:"https://photos.google.com",icon:"https://ssl.gstatic.com/images/branding/product/1x/photos_48dp.png",searchText:"Google Photos フォト 写真"},
    {id:5,label:"Drive",url:"https://drive.google.com",icon:"https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png",searchText:"Google Drive ドライブ"},
    {id:9,label:"YouTube",url:"https://www.youtube.com",icon:"https://www.youtube.com/favicon.ico",searchText:"YouTube ユーチューブ"},
    {id:7,label:"X",url:"https://x.com",icon:"https://x.com/favicon.ico",searchText:"X Twitter ツイッター"},
    {id:8,label:"Instagram",url:"https://www.instagram.com",icon:"https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png",searchText:"Instagram インスタグラム"},
    {id:6,label:"Yahoo!",url:"https://www.yahoo.co.jp",icon:"https://www.yahoo.co.jp/favicon.ico",searchText:"Yahoo! ヤフー"},
    {id:22,label:"ChatGPT",url:"https://chatgpt.com",icon:"https://chat.openai.com/favicon.ico",searchText:"ChatGPT AI"},
    {id:49,label:"DeepL",url:"https://www.deepl.com/translator",icon:"https://www.deepl.com/img/favicon/deepl_favicon_32x32.png",searchText:"DeepL 翻訳 Translate"}
];

// お気に入り保存用キー
const FAV_KEY = 'myAppFavorites';
let favorites = JSON.parse(localStorage.getItem(FAV_KEY)) || [];

// --- 初期化 ---
window.onload = function() {
    updateClock();
    setInterval(updateClock, 1000);
    renderGrid(initialAppData); // 全アプリ表示
    
    // テーマの復元
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme) setTheme(savedTheme);

    // 検索イベントリスナー
    searchInput.addEventListener('input', handleSearch);
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        handleSearch();
    });
};

// --- 時計・カウントダウン機能 ---
function updateClock() {
    const now = new Date();
    
    // 日付
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const dateStr = `${now.getMonth()+1}/${now.getDate()} (${days[now.getDay()]})`;
    dateElement.textContent = dateStr;

    // 時間
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${h}:${m}:${s}`;

    // カウントダウン (スケジュールに基づく)
    let currentSchedule = null;
    let nextSchedule = null;
    const nowTime = h + ":" + m;

    // 単純な比較のため分換算
    const nowMin = now.getHours() * 60 + now.getMinutes();

    for (let i = 0; i < schedule.length; i++) {
        const item = schedule[i];
        const [sh, sm] = item.start.split(':').map(Number);
        const [eh, em] = item.end.split(':').map(Number);
        const startMin = sh * 60 + sm;
        const endMin = eh * 60 + em;

        if (nowMin >= startMin && nowMin < endMin) {
            currentSchedule = item;
            break;
        }
        if (nowMin < startMin) {
            nextSchedule = item;
            break;
        }
    }

    if (currentSchedule) {
        countdownElement.textContent = `${currentSchedule.name} 終了まで残り...`;
        // 残り時間計算ロジックは省略（必要なら追加）
    } else if (nextSchedule) {
         countdownElement.textContent = `次は ${nextSchedule.name} (${nextSchedule.start}~)`;
    } else {
        countdownElement.textContent = "本日の予定は終了";
    }
}

// --- グリッド描画 ---
function renderGrid(data) {
    gridContainer.innerHTML = '';
    
    data.forEach(app => {
        const item = createIconItem(app);
        gridContainer.appendChild(item);
    });

    // お気に入りタブの中身も更新（非表示でもDOMは作っておく、またはタブ切り替え時に再描画）
    renderFavorites();
}

// アイコン生成関数
function createIconItem(app) {
    const div = document.createElement('div');
    div.className = 'icon-item';

    // リンク
    const a = document.createElement('a');
    a.href = app.url;
    a.className = 'icon-link';
    a.target = '_blank'; // 別タブで開く

    // 画像
    const img = document.createElement('img');
    img.src = app.icon;
    img.className = 'icon-img';
    img.onerror = () => { img.src = 'https://via.placeholder.com/32?text=App'; }; // エラーハンドリング
    a.appendChild(img);

    // お気に入りボタン (☆) - CSSで右上配置
    const star = document.createElement('i');
    const isFav = favorites.includes(app.id);
    star.className = isFav ? 'fas fa-star' : 'far fa-star';
    star.title = isFav ? 'お気に入りから削除' : 'お気に入りに追加';
    
    // クリックイベント停止（リンク遷移を防ぐ）
    star.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(app.id);
    };

    // ラベル
    const label = document.createElement('div');
    label.className = 'label-text';
    label.textContent = app.label;

    div.appendChild(a);
    div.appendChild(star); // 星をdiv直下に追加
    div.appendChild(label);

    return div;
}

// --- お気に入り機能 ---
function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index === -1) {
        favorites.push(id);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    
    // 現在の表示を更新
    renderGrid(initialAppData);
    renderFavorites();
}

function renderFavorites() {
    fyContentArea.innerHTML = '';
    const favApps = initialAppData.filter(app => favorites.includes(app.id));
    
    if (favApps.length === 0) {
        fyContentArea.innerHTML = '<p style="width:100%; text-align:center; color:#888;">お気に入りはまだありません。星マークを押して追加してください。</p>';
        return;
    }

    favApps.forEach(app => {
        const item = createIconItem(app);
        fyContentArea.appendChild(item);
    });
}

// --- タブ切り替え ---
function activateTab(tabName) {
    // 全コンテナ非表示
    mainGrid.style.display = 'none';
    bustarainContainer.style.display = 'none';
    optionContainer.style.display = 'none';
    fyContainer.style.display = 'none';

    // 全タブ非アクティブ
    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));

    // 選択されたタブの処理
    if (tabName === 'all-apps') {
        mainGrid.style.display = 'block';
        document.getElementById('tab-all-apps').classList.add('active');
        // 検索窓を表示
        document.querySelector('.search-wrapper').classList.remove('hidden');
    } else if (tabName === 'bustarain') {
        bustarainContainer.style.display = 'block';
        document.getElementById('tab-bustarain').classList.add('active');
        document.querySelector('.search-wrapper').classList.add('hidden');
    } else if (tabName === 'option') {
        optionContainer.style.display = 'block';
        document.getElementById('tab-option').classList.add('active');
        document.querySelector('.search-wrapper').classList.add('hidden');
    } else if (tabName === 'fy') {
        fyContainer.style.display = 'block';
        document.getElementById('tab-fy').classList.add('active');
        renderFavorites(); // お気に入り最新化
        document.querySelector('.search-wrapper').classList.add('hidden');
    }
}

// --- Bustarain サブタブ ---
function switchSubTab(targetId) {
    // コンテンツ非表示
    document.querySelectorAll('.sub-tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(targetId).classList.remove('hidden');

    // ボタンアクティブ切り替え
    document.querySelectorAll('.sub-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        // シンプルな判定：onclick属性を見て判定（本来はdata属性推奨）
        if(btn.getAttribute('onclick').includes(targetId)) {
            btn.classList.add('active');
        }
    });
}

// --- アコーディオン ---
function toggleAccordion(header) {
    const item = header.parentElement;
    item.classList.toggle('active');
}

// --- 検索機能 ---
function handleSearch() {
    const query = searchInput.value.toLowerCase();
    
    if (query.length > 0) {
        clearSearchBtn.classList.remove('hidden');
    } else {
        clearSearchBtn.classList.add('hidden');
    }

    const filtered = initialAppData.filter(app => {
        return (app.label && app.label.toLowerCase().includes(query)) ||
               (app.searchText && app.searchText.toLowerCase().includes(query));
    });
    
    renderGrid(filtered);
}

// --- テーマ設定 ---
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
}

// --- スピードテストリロード ---
function reloadSpeedTest() {
    const iframe = document.querySelector('.header-speed-test iframe');
    iframe.src = iframe.src;
}
