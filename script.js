// --- DOM要素の取得 ---
const mainGrid = document.getElementById('main-grid');
const bustarainContainer = document.getElementById('bustarain-container');
const optionContainer = document.getElementById('option-container');
const fyContainer = document.getElementById('fy-container');
const fyContentArea = document.getElementById('fy-content-area');
const gridContainer = document.getElementById('gridContainer');
const searchInput = document.getElementById('appSearchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');

// 時計関連
const dateElement = document.getElementById('date');
const clockElement = document.getElementById('clock');
const countdownElement = document.getElementById('countdown');

// --- データ定義 ---
const schedule = [{name:"1限",start:"08:50",end:"09:40"},{name:"休憩",start:"09:40",end:"09:50"},{name:"2限",start:"09:50",end:"10:40"},{name:"休憩",start:"10:40",end:"10:50"},{name:"3限",start:"10:50",end:"11:40"},{name:"休憩",start:"11:40",end:"11:50"},{name:"4限",start:"11:50",end:"12:40"},{name:"昼休み",start:"12:40",end:"13:20"},{name:"5限",start:"13:20",end:"14:10"},{name:"休憩",start:"14:10",end:"14:20"},{name:"6限",start:"14:20",end:"15:10"},{name:"休憩",start:"15:10",end:"15:20"},{name:"7限",start:"15:20",end:"16:10"},{name:"休憩",start:"16:10",end:"16:40"},{name:"8限",start:"16:40",end:"17:30"},{name:"休憩",start:"17:30",end:"17:40"},{name:"9限",start:"17:40",end:"18:30"}];

// アプリリスト
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

// お気に入りデータ保存用
const FAV_KEY = 'myLinkAppFavorites';
let favorites = JSON.parse(localStorage.getItem(FAV_KEY)) || [];

// --- 初期化 ---
window.onload = function() {
    updateClock();
    setInterval(updateClock, 1000);
    
    // テーマ設定読み込み
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme) setTheme(savedTheme);

    // Appsグリッド描画
    renderGrid(initialAppData);

    // Bustarain初期化（お気に入りボタン同期）
    initBustarain();

    // 検索イベント
    searchInput.addEventListener('input', handleSearch);
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        handleSearch();
    });
};

// --- 時計機能 (年を追加) ---
function updateClock() {
    const now = new Date();
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    
    // YYYY/MM/DD 形式に変更
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = days[now.getDay()];
    
    dateElement.textContent = `${year}/${month}/${date} (${day})`;
    clockElement.textContent = now.toTimeString().split(' ')[0];

    // スケジュールカウントダウン
    const nowMin = now.getHours() * 60 + now.getMinutes();
    let msg = "本日の予定は終了";
    
    for (let item of schedule) {
        const [sh, sm] = item.start.split(':').map(Number);
        const [eh, em] = item.end.split(':').map(Number);
        const sMin = sh * 60 + sm;
        const eMin = eh * 60 + em;

        if (nowMin >= sMin && nowMin < eMin) {
            msg = `${item.name} 終了まで残り...`;
            break;
        } else if (nowMin < sMin) {
            msg = `次は ${item.name} (${item.start}~)`;
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

// --- アイコン要素生成（Apps用） ---
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

    // お気に入りボタン (☆)
    const star = document.createElement('i');
    const isFav = favorites.includes(app.id);
    star.className = isFav ? 'fas fa-star fav-btn active' : 'far fa-star fav-btn';
    star.title = isFav ? '削除' : '追加';
    
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

// --- Bustarain初期化 ---
function initBustarain() {
    // Bustarainのアコーディオンヘッダー内の☆ボタンの状態を更新
    const items = document.querySelectorAll('#bustarain-container .accordion-item');
    items.forEach(item => {
        const id = item.dataset.id;
        const star = item.querySelector('.acc-fav-btn');
        if(!star) return;

        // イベントリスナーの重複登録を防ぐため、一度cloneして置き換える手法も取れますが、
        // 今回は単純にクラス更新と、onclick設定（上書き）を行います
        if(favorites.includes(id)) {
            star.className = 'fas fa-star acc-fav-btn active';
        } else {
            star.className = 'far fa-star acc-fav-btn';
        }

        star.onclick = (e) => {
            e.stopPropagation(); // アコーディオン開閉を防ぐ
            toggleFavorite(id);
        };
    });
}

// --- お気に入り切り替え ---
function toggleFavorite(id) {
    const idx = favorites.indexOf(id);
    if (idx === -1) {
        favorites.push(id);
    } else {
        favorites.splice(idx, 1);
    }
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    
    // 再描画
    renderGrid(initialAppData); // Appsの星更新
    if (document.getElementById('tab-fy').classList.contains('active')) {
        renderFavoritesPage();
    }
    initBustarain(); // Bustarainの星更新
}

// --- FYタブ描画 ---
function renderFavoritesPage() {
    fyContentArea.innerHTML = '';
    
    if (favorites.length === 0) {
        fyContentArea.innerHTML = '<p style="width:100%; text-align:center; color:#888;">お気に入りはまだ登録されていません。</p>';
        return;
    }

    favorites.forEach(favId => {
        // IDが数値ならApp、文字列ならBustarainと判定
        if (typeof favId === 'number') {
            const app = initialAppData.find(a => a.id === favId);
            if(app) {
                fyContentArea.appendChild(createIconItem(app));
            }
        } else {
            // Bustarainアイテムの場合
            const el = document.querySelector(`.accordion-item[data-id="${favId}"]`);
            if(el) {
                const title = el.dataset.title;
                const iconDiv = document.createElement('div');
                iconDiv.className = 'icon-item';
                
                // リンク風ボタン
                const linkDiv = document.createElement('div');
                linkDiv.className = 'icon-link';
                linkDiv.style.cursor = 'pointer';
                linkDiv.innerHTML = '<i class="fas fa-bus" style="font-size:24px;"></i>';
                
                linkDiv.onclick = () => {
                    // Bustarainタブへ移動して該当を開く
                    activateTab('bustarain');
                    const parentTabId = el.parentElement.id;
                    switchSubTab(parentTabId);
                    
                    if(!el.classList.contains('active')) {
                        // toggleAccordionはヘッダー要素を引数にとる
                        toggleAccordion(el.querySelector('.accordion-header'));
                    }
                    setTimeout(() => {
                        el.scrollIntoView({behavior: 'smooth', block: 'center'});
                    }, 100);
                };

                // 削除ボタン
                const star = document.createElement('i');
                star.className = 'fas fa-star fav-btn active';
                star.onclick = (e) => {
                    e.stopPropagation();
                    toggleFavorite(favId);
                };

                const label = document.createElement('div');
                label.className = 'label-text';
                label.textContent = title;

                iconDiv.appendChild(star);
                iconDiv.appendChild(linkDiv);
                iconDiv.appendChild(label);
                fyContentArea.appendChild(iconDiv);
            }
        }
    });
}

// --- タブ切り替え ---
function activateTab(tabName) {
    mainGrid.style.display = 'none';
    bustarainContainer.style.display = 'none';
    optionContainer.style.display = 'none';
    fyContainer.style.display = 'none';
    
    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
    document.querySelector('.search-wrapper').classList.add('hidden'); 

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

// --- Bustarain サブタブ ---
function switchSubTab(targetId) {
    document.querySelectorAll('.sub-tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(targetId).classList.remove('hidden');

    document.querySelectorAll('.sub-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('onclick').includes(targetId)) {
            btn.classList.add('active');
        }
    });
}

// --- アコーディオン ---
function toggleAccordion(header) {
    const item = header.parentElement;
    const content = item.querySelector('.accordion-content');
    const iframe = content.querySelector('iframe');

    item.classList.toggle('active');

    if (item.classList.contains('active')) {
        if (iframe && !iframe.src && iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
        }
    }
}

// --- 検索 ---
function handleSearch() {
    const query = searchInput.value.toLowerCase();
    clearSearchBtn.classList.toggle('hidden', query.length === 0);

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

function reloadSpeedTest() {
    const iframe = document.querySelector('.header-speed-test iframe');
    iframe.src = iframe.src;
}
