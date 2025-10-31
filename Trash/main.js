// --- グローバル変数定義 ---
let appData = [], isEditMode = false, draggedItem = null, longPressTimer;
const schedule=[{name:"1限",start:"08:50",end:"09:40"},{name:"休憩",start:"09:40",end:"09:50"},{name:"2限",start:"09:50",end:"10:40"},{name:"休憩",start:"10:40",end:"10:50"},{name:"3限",start:"10:50",end:"11:40"},{name:"休憩",start:"11:40",end:"11:50"},{name:"4限",start:"11:50",end:"12:40"},{name:"昼休み",start:"12:40",end:"13:20"},{name:"5限",start:"13:20",end:"14:10"},{name:"休憩",start:"14:10",end:"14:20"},{name:"6限",start:"14:20",end:"15:10"},{name:"休憩",start:"15:10",end:"15:20"},{name:"7限",start:"15:20",end:"16:10"},{name:"休憩",start:"16:10",end:"16:40"},{name:"8限",start:"16:40",end:"17:30"},{name:"休憩",start:"17:30",end:"17:40"},{name:"9限",start:"17:40",end:"18:30"}];

// --- 関数定義 ---
// ここに元の<script>タグ内にあったJavaScript関数をすべてコピーしてください。
// (例: loadAppData, saveAppData, renderIcons, updateCountdown, etc...)
function loadAppData() { try { const d = localStorage.getItem('siteApps'); appData = d ? JSON.parse(d) : JSON.parse(JSON.stringify(initialAppData)); } catch(e) { appData = JSON.parse(JSON.stringify(initialAppData)); } }
function saveAppData() { localStorage.setItem('siteApps', JSON.stringify(appData)); }
function resetAppData() { if (confirm("アプリの配置や内容を初期状態に戻します。よろしいですか？")) { localStorage.removeItem('siteApps'); location.reload(); } }
// ...他のすべての関数もここにコピー...


// --- タブコンテンツの読み込みと初期化 ---
async function loadTabContent(tabId) {
    const contentArea = document.getElementById('main-content-area');
    try {
        const response = await fetch(`tabs/${tabId}.html`);
        if (!response.ok) throw new Error(`Failed to load tabs/${tabId}.html`);
        contentArea.innerHTML = await response.text();

        // 各タブに応じた初期化処理を実行
        switch (tabId) {
            case 'all-apps': initAppsTab(); break;
            case 'status': initStatusTab(); break;
            case 'bustarain': initBustarainTab(); break;
        }
    } catch (error) {
        console.error('Error loading tab content:', error);
        contentArea.innerHTML = `<p style="color:red; text-align:center; padding: 20px;">コンテンツの読み込みに失敗しました。</p>`;
    }
}

function activateTab(tabId) {
    if (isEditMode && (tabId === 'status' || tabId === 'bustarain')) {
        alert('アプリ編集中は他のタブに移動できません。');
        return;
    }
    document.querySelectorAll(".tab-item").forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tabId}`)?.classList.add('active');
    loadTabContent(tabId);
    localStorage.setItem('siteActiveTab', tabId);
}

// --- 各タブの初期化関数 ---
function initAppsTab() {
    renderIcons(); // アイコンを描画
    const gridContainer = document.getElementById('gridContainer');
    document.querySelectorAll('.sub-filter-btn').forEach(btn => btn.addEventListener('click', () => filterIconsByCategory(btn.dataset.category)));
    gridContainer.addEventListener('dragstart', e => { if (e.target.classList.contains('icon-item')) { draggedItem = e.target; setTimeout(() => e.target.classList.add('dragging'), 0); } });
    gridContainer.addEventListener('dragend', () => { if(draggedItem) { draggedItem.classList.remove('dragging'); draggedItem = null; const p = gridContainer.querySelector('.placeholder'); if (p) p.remove(); const newOrder = [...gridContainer.querySelectorAll('.icon-item')].map(i => appData.find(a => a.id === parseInt(i.dataset.id))).filter(Boolean); appData = newOrder; } });
    gridContainer.addEventListener('dragover', e => { e.preventDefault(); const afterElement = [...gridContainer.querySelectorAll('.icon-item:not(.dragging)')].reduce((c, child) => { const box = child.getBoundingClientRect(); const offset = e.clientX - box.left - box.width / 2; return (offset < 0 && offset > c.offset) ? { offset, element: child } : c; }, { offset: Number.NEGATIVE_INFINITY }).element; const placeholder = gridContainer.querySelector('.placeholder') || document.createElement('div'); if (!placeholder.classList.contains('placeholder')) placeholder.className = 'placeholder'; if (afterElement == null) { gridContainer.appendChild(draggedItem); } else { gridContainer.insertBefore(draggedItem, afterElement); } if (draggedItem.nextSibling) { gridContainer.insertBefore(placeholder, draggedItem.nextSibling); } else { gridContainer.appendChild(placeholder); } });
    gridContainer.addEventListener('click', e => { if (!isEditMode) return; const editBtn = e.target.closest('.edit'), delBtn = e.target.closest('.delete'); if (editBtn) { const item = appData.find(a => a.id === parseInt(editBtn.closest('.icon-item').dataset.id)); if (item) openModal(item); } if (delBtn) { const itemEl = delBtn.closest('.icon-item'); const item = appData.find(a => a.id === parseInt(itemEl.dataset.id)); if (item && confirm(`「${item.label}」を削除しますか？`)) { appData = appData.filter(a => a.id !== item.id); renderIcons(); } } });
}

function initStatusTab() {
    if (typeof window.initBusSchedule !== 'undefined') { window.initBusSchedule(); window.updateBusDisplay(); }
    document.querySelectorAll('.expand-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const iframeSrc = e.target.closest('.status-card').querySelector('iframe').src;
        const modal = document.getElementById('iframe-modal');
        document.getElementById('modal-iframe').src = iframeSrc;
        modal.classList.remove('hidden');
      });
    });
}

function initBustarainTab() {
    initAccordions();
    activateSubTab('train-content');
    document.querySelectorAll('#main-content-area .sub-tab-btn').forEach(btn => btn.addEventListener('click', () => activateSubTab(btn.dataset.target)));
}

// --- メイン初期化関数 ---
async function init() {
  try {
    const response = await fetch('main/header.html');
    document.getElementById('header-container').innerHTML = await response.text();
  } catch (error) {
    console.error('Error loading header.html:', error);
    document.getElementById('header-container').innerHTML = '<p style="color:red;">ヘッダーの読み込みに失敗しました。</p>';
  }

  setTheme(localStorage.getItem('siteTheme') || 'light');
  updateClockAndDate(); 
  resetCalc();
  loadAppData();

  const activeTabId = localStorage.getItem('siteActiveTab') || 'all-apps';
  activateTab(activeTabId);

  // グローバルなイベントリスナー
  document.querySelectorAll('.tab-item').forEach(tab => tab.addEventListener('click', () => activateTab(tab.dataset.tab)));
  document.getElementById('appSearchInput').addEventListener('input', () => { if(document.getElementById("appSearchInput").value && !document.getElementById('tab-all-apps').classList.contains('active')) { activateTab('all-apps'); setTimeout(filterContent, 100); } else { filterContent(); } });
  document.body.addEventListener('input', e => { if (['addHours', 'addMinutes', 'addSeconds'].includes(e.target.id)) { calcTime(); } });
  document.body.addEventListener('click', e => { if(e.target.closest('#resetCalcBtn')) resetCalc(); if(e.target.closest('#edit-apps-btn')) toggleEditMode(); if(e.target.closest('#reset-apps-btn')) resetAppData(); });
  document.getElementById('app-modal').querySelector('.cancel-btn').addEventListener('click', closeModal);
  document.getElementById('app-form').addEventListener('submit', handleFormSubmit);
  const iframeModal = document.getElementById('iframe-modal');
  iframeModal.addEventListener('click', (e) => { if (e.target === iframeModal || e.target.closest('.close-modal-btn')) { iframeModal.classList.add('hidden'); document.getElementById('modal-iframe').src = 'about:blank'; } });
}

// --- 定期実行処理 ---
setInterval(() => { updateClockAndDate(); calcTime(); if (window.updateBusCountdowns && document.getElementById('tab-status')?.classList.contains('active')) window.updateBusCountdowns(); }, 1000); 
setInterval(() => { if (window.updateBusDisplay && document.getElementById('tab-status')?.classList.contains('active')) window.updateBusDisplay(); }, 30000); 

// --- 実行開始 ---
document.addEventListener('DOMContentLoaded', init);
