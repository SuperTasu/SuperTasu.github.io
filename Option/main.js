/**
 * Option/takatori.js
 * 鷹取団地前バス掲示板コンポーネント
 */

// ユニークなスタイルを注入（一度だけ）
(function injectTakatoriStyles() {
    if (document.getElementById('takatori-styles')) return;
    const style = document.createElement('style');
    style.id = 'takatori-styles';
    style.innerHTML = `
        .takatori-display-board {
            font-family: 'MS Gothic', monospace;
            background-color: var(--bus-board-bg);
            border: 3px solid #009900;
            border-radius: 10px;
            padding: 12px;
            color: #333;
            width: 100%;
            box-sizing: border-box;
            position: relative;
        }
        body.dark-theme .takatori-display-board {
            color: #ddd;
            border-color: #007700;
        }
        .takatori-header {
            display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;
        }
        .takatori-stop-name { font-size: 18px; font-weight: bold; color: #009900; }
        .takatori-controls { display: flex; gap: 8px; flex-wrap: wrap; }
        .takatori-schedule-type {
            font-size: 13px; color: #009900; font-weight: bold; background-color: #fff;
            padding: 3px 6px; border-radius: 5px; border: 2px solid #009900;
        }
        .takatori-departures-row { display: flex; gap: 10px; flex-direction: column; }
        @media (min-width: 600px) { .takatori-departures-row { flex-direction: row; } }
        
        .takatori-item { flex: 1; }
        .takatori-content {
            display: flex; justify-content: space-between; align-items: center;
            background-color: var(--bus-card-bg); border-radius: 8px;
            padding: 8px 10px; border: 2px solid #009900; min-height: 65px;
        }
        .takatori-left { display: flex; flex-direction: column; gap: 2px; }
        .takatori-label { font-size: 14px; font-weight: bold; color: var(--text-color-primary); }
        .takatori-route { font-size: 13px; color: var(--text-color-primary); }
        .takatori-time-col { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .takatori-clock { font-size: 22px; font-weight: bold; color: #cc0000; }
        .takatori-sub-row { display: flex; align-items: center; gap: 8px; }
        .takatori-remain { font-size: 16px; font-weight: bold; color: #009900; text-align: right; }
        .takatori-btn {
            display: inline-flex; justify-content: center; align-items: center;
            width: 24px; height: 24px; background-color: #0066cc; color: white;
            border: none; border-radius: 50%; font-size: 14px; font-weight: bold;
            text-decoration: none; cursor: pointer;
        }
        .takatori-route-num {
            display: inline-block; border: 2px solid #0066cc; padding: 1px 5px; margin-right: 6px;
            background-color: #fff; color: #0066cc; font-size: 13px; min-width: 22px; text-align: center;
        }
        .takatori-arrival { color: #cc6600; font-size: 11px; font-weight: bold; }
        .takatori-no-dep { color: #cc0000; font-size: 14px; text-align: center; padding: 10px; width:100%; }
        
        .takatori-dir-btn {
            background-color: #f0f0f0; border: 2px solid #333; padding: 6px 12px;
            font-size: 13px; font-weight: bold; cursor: pointer; border-radius: 5px; color:#333;
        }
        .takatori-dir-btn.active { background-color: #0066cc; color: white; border-color: #0066cc; }
        
        .takatori-fav-star {
            font-size: 20px; cursor: pointer; color: #ccc; margin-right: 5px;
        }
        .takatori-fav-star.active { color: #ffc107; }

        .blink { animation: blink 1s infinite; }
        @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0.3; } }
    `;
    document.head.appendChild(style);
})();

// データ定義
const takatoriTimetables = {
    shinkaichi: {
        route11: { name: "神戸駅前方面", number: "11", detailUrl: "https://location.its-mo.com/usersite/kobe/US0005/search/jp?busStopCode=0440&directionId=kobe0016", weekdays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [12, 27, 42] }, { hour: 7, minutes: [7, 24, 38, 52, 59] }, { hour: 8, minutes: [11, 21, 32, 44, 51] }, { hour: 9, minutes: [5, 13, 37, 49] }, { hour: 10, minutes: [25, 50] }, { hour: 11, minutes: [1, 25] }, { hour: 12, minutes: [2, 25] }, { hour: 13, minutes: [2, 25] }, { hour: 14, minutes: [2, 25] }, { hour: 15, minutes: [2, 25] }, { hour: 16, minutes: [2, 25] }, { hour: 17, minutes: [2, 25] }, { hour: 18, minutes: [2, 25, 49] }, { hour: 19, minutes: [1, 25, 50] }, { hour: 20, minutes: [19, 49] }, { hour: 21, minutes: [29, 49] }, { hour: 22, minutes: [7, 25, 39, 53] }, { hour: 23, minutes: [] }], holidays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [12, 27, 42, 55] }, { hour: 7, minutes: [17, 37, 57] }, { hour: 8, minutes: [17, 37, 57] }, { hour: 9, minutes: [19, 55] }, { hour: 10, minutes: [19, 31, 55] }, { hour: 11, minutes: [19, 31, 55] }, { hour: 12, minutes: [19, 31, 55] }, { hour: 13, minutes: [19, 31, 55] }, { hour: 14, minutes: [19, 31, 55] }, { hour: 15, minutes: [19, 31, 55] }, { hour: 16, minutes: [19, 31, 55] }, { hour: 17, minutes: [19, 31, 55] }, { hour: 18, minutes: [19, 31, 55] }, { hour: 19, minutes: [31, 55] }, { hour: 20, minutes: [37] }, { hour: 21, minutes: [12, 52] }, { hour: 22, minutes: [12, 32, 53] }, { hour: 23, minutes: [] }] },
        route13: { name: "地下鉄長田駅 経由 兵庫駅方面", number: "13", detailUrl: "https://location.its-mo.com/usersite/kobe/US0005/search/jp?busStopCode=0440&directionId=kobe0017", weekdays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [] }, { hour: 7, minutes: [] }, { hour: 8, minutes: [54] }, { hour: 9, minutes: [] }, { hour: 10, minutes: [7, 56] }, { hour: 11, minutes: [47] }, { hour: 12, minutes: [37] }, { hour: 13, minutes: [27] }, { hour: 14, minutes: [15] }, { hour: 15, minutes: [7, 57] }, { hour: 16, minutes: [42] }, { hour: 17, minutes: [22] }, { hour: 18, minutes: [2, 42] }, { hour: 19, minutes: [] }, { hour: 20, minutes: [] }, { hour: 21, minutes: [] }, { hour: 22, minutes: [] }, { hour: 23, minutes: [] }], holidays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [] }, { hour: 7, minutes: [7, 27, 47] }, { hour: 8, minutes: [7, 27, 47] }, { hour: 9, minutes: [7, 31, 43] }, { hour: 10, minutes: [7, 43] }, { hour: 11, minutes: [7, 43] }, { hour: 12, minutes: [7, 43] }, { hour: 13, minutes: [7, 43] }, { hour: 14, minutes: [7, 43] }, { hour: 15, minutes: [7, 43] }, { hour: 16, minutes: [7, 43] }, { hour: 17, minutes: [7, 43] }, { hour: 18, minutes: [7, 43] }, { hour: 19, minutes: [7, 19, 43] }, { hour: 20, minutes: [7, 52] }, { hour: 21, minutes: [32] }, { hour: 22, minutes: [] }, { hour: 23, minutes: [] }] },
        route110: { name: "大学病院 経由 神戸駅方面", number: "110・112", detailUrl: "https://location.its-mo.com/usersite/kobe/US0005/search/jp?busStopCode=0440&directionId=kobe0122", weekdays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [55] }, { hour: 7, minutes: [17, 31, 45] }, { hour: 8, minutes: [5, 16, 26, 38, 57] }, { hour: 9, minutes: [1, 13, 37] }, { hour: 10, minutes: [13, 37, 49] }, { hour: 11, minutes: [13, 37, 49] }, { hour: 12, minutes: [13, 37, 49] }, { hour: 13, minutes: [13, 37, 49] }, { hour: 14, minutes: [13, 37, 49] }, { hour: 15, minutes: [13, 37, 49] }, { hour: 16, minutes: [13, 37, 49] }, { hour: 17, minutes: [13, 37, 49] }, { hour: 18, minutes: [13, 38] }, { hour: 19, minutes: [13, 37] }, { hour: 20, minutes: [5, 34] }, { hour: 21, minutes: [9] }, { hour: 22, minutes: [] }, { hour: 23, minutes: [] }], holidays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [] }, { hour: 7, minutes: [7, 27, 47] }, { hour: 8, minutes: [7, 27, 47] }, { hour: 9, minutes: [7, 31, 43] }, { hour: 10, minutes: [7, 43] }, { hour: 11, minutes: [7, 43] }, { hour: 12, minutes: [7, 43] }, { hour: 13, minutes: [7, 43] }, { hour: 14, minutes: [7, 43] }, { hour: 15, minutes: [7, 43] }, { hour: 16, minutes: [7, 43] }, { hour: 17, minutes: [7, 43] }, { hour: 18, minutes: [7, 43] }, { hour: 19, minutes: [7, 19, 43] }, { hour: 20, minutes: [7, 52] }, { hour: 21, minutes: [32] }, { hour: 22, minutes: [] }, { hour: 23, minutes: [] }] }
    },
    yoshidacho: {
        route11A: { name: "板宿止まり", number: "11A", detailUrl: "https://location.its-mo.com/usersite/kobe/US0005/search/jp?busStopCode=0440&directionId=kobe0015", weekdays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [21, 31, 53] }, { hour: 7, minutes: [14, 35, 53] }, { hour: 8, minutes: [12, 29, 48] }, { hour: 9, minutes: [13] }, { hour: 10, minutes: [9, 33] }, { hour: 11, minutes: [21] }, { hour: 12, minutes: [22] }, { hour: 13, minutes: [25] }, { hour: 14, minutes: [25] }, { hour: 15, minutes: [25] }, { hour: 16, minutes: [25] }, { hour: 17, minutes: [26, 58] }, { hour: 18, minutes: [38] }, { hour: 19, minutes: [8, 41] }, { hour: 20, minutes: [5, 39] }, { hour: 21, minutes: [15, 45] }, { hour: 22, minutes: [0, 30, 45] }, { hour: 23, minutes: [5] }], holidays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [21] }, { hour: 7, minutes: [9, 21, 46] }, { hour: 8, minutes: [11, 35] }, { hour: 9, minutes: [12] }, { hour: 10, minutes: [0, 24] }, { hour: 11, minutes: [0, 24] }, { hour: 12, minutes: [1, 25] }, { hour: 13, minutes: [1, 25] }, { hour: 14, minutes: [1, 25] }, { hour: 15, minutes: [1, 25] }, { hour: 16, minutes: [1, 25, 47] }, { hour: 17, minutes: [8, 28, 48] }, { hour: 18, minutes: [8] }, { hour: 19, minutes: [7, 41, 53] }, { hour: 20, minutes: [15, 51] }, { hour: 21, minutes: [15, 39, 54] }, { hour: 22, minutes: [24, 44] }, { hour: 23, minutes: [] }] },
        route11B: { name: "板宿 経由 松原町５丁目方面", number: "11B", detailUrl: "https://location.its-mo.com/usersite/kobe/US0005/search/jp?busStopCode=0440&directionId=kobe0015", weekdays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [] }, { hour: 7, minutes: [] }, { hour: 8, minutes: [] }, { hour: 9, minutes: [45] }, { hour: 10, minutes: [57] }, { hour: 11, minutes: [58] }, { hour: 12, minutes: [] }, { hour: 13, minutes: [1] }, { hour: 14, minutes: [1] }, { hour: 15, minutes: [1] }, { hour: 16, minutes: [1] }, { hour: 17, minutes: [1] }, { hour: 18, minutes: [8] }, { hour: 19, minutes: [] }, { hour: 20, minutes: [] }, { hour: 21, minutes: [] }, { hour: 22, minutes: [] }, { hour: 23, minutes: [] }], holidays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [] }, { hour: 7, minutes: [] }, { hour: 8, minutes: [] }, { hour: 9, minutes: [36] }, { hour: 10, minutes: [36] }, { hour: 11, minutes: [37] }, { hour: 12, minutes: [37] }, { hour: 13, minutes: [37] }, { hour: 14, minutes: [37] }, { hour: 15, minutes: [37] }, { hour: 16, minutes: [37] }, { hour: 17, minutes: [38] }, { hour: 18, minutes: [42] }, { hour: 19, minutes: [] }, { hour: 20, minutes: [] }, { hour: 21, minutes: [] }, { hour: 22, minutes: [] }, { hour: 23, minutes: [] }] },
        route13: { name: "板宿 経由 新長田駅前方面", number: "13", detailUrl: "https://location.its-mo.com/usersite/kobe/US0005/search/jp?busStopCode=0440&directionId=kobe0017", weekdays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [] }, { hour: 7, minutes: [] }, { hour: 8, minutes: [13] }, { hour: 9, minutes: [26] }, { hour: 10, minutes: [15] }, { hour: 11, minutes: [7, 57] }, { hour: 12, minutes: [47] }, { hour: 13, minutes: [35] }, { hour: 14, minutes: [27] }, { hour: 15, minutes: [17] }, { hour: 16, minutes: [2, 41] }, { hour: 17, minutes: [21] }, { hour: 18, minutes: [1] }, { hour: 19, minutes: [] }, { hour: 20, minutes: [] }, { hour: 21, minutes: [] }, { hour: 22, minutes: [] }, { hour: 23, minutes: [] }], holidays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [] }, { hour: 7, minutes: [] }, { hour: 8, minutes: [13] }, { hour: 9, minutes: [26] }, { hour: 10, minutes: [15] }, { hour: 11, minutes: [7, 57] }, { hour: 12, minutes: [47] }, { hour: 13, minutes: [35] }, { hour: 14, minutes: [27] }, { hour: 15, minutes: [17] }, { hour: 16, minutes: [2, 41] }, { hour: 17, minutes: [21] }, { hour: 18, minutes: [1] }, { hour: 19, minutes: [] }, { hour: 20, minutes: [] }, { hour: 21, minutes: [] }, { hour: 22, minutes: [] }, { hour: 23, minutes: [] }] },
        route110A: { name: "板宿止まり", number: "110A", detailUrl: "https://location.its-mo.com/usersite/kobe/US0005/search/jp?busStopCode=0440&directionId=kobe0122", weekdays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [41] }, { hour: 7, minutes: [3, 26, 46] }, { hour: 8, minutes: [7, 25, 43] }, { hour: 9, minutes: [8, 36] }, { hour: 10, minutes: [24] }, { hour: 11, minutes: [12, 36] }, { hour: 12, minutes: [12, 39] }, { hour: 13, minutes: [15, 39] }, { hour: 14, minutes: [16, 39] }, { hour: 15, minutes: [15, 39] }, { hour: 16, minutes: [15, 39] }, { hour: 17, minutes: [15, 40] }, { hour: 18, minutes: [20, 50] }, { hour: 19, minutes: [20] }, { hour: 20, minutes: [16, 52] }, { hour: 21, minutes: [31] }, { hour: 22, minutes: [16] }, { hour: 23, minutes: [26] }], holidays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [] }, { hour: 7, minutes: [36] }, { hour: 8, minutes: [0] }, { hour: 9, minutes: [3] }, { hour: 10, minutes: [15] }, { hour: 11, minutes: [15] }, { hour: 12, minutes: [15] }, { hour: 13, minutes: [15] }, { hour: 14, minutes: [15] }, { hour: 15, minutes: [15] }, { hour: 16, minutes: [15] }, { hour: 17, minutes: [19] }, { hour: 18, minutes: [20] }, { hour: 19, minutes: [20] }, { hour: 20, minutes: [40] }, { hour: 21, minutes: [28] }, { hour: 22, minutes: [11] }, { hour: 23, minutes: [6] }] },
        route110B: { name: "板宿 経由 鷹取駅方面", number: "110B", detailUrl: "https://location.its-mo.com/usersite/kobe/US0005/search/jp?busStopCode=0440&directionId=kobe0122", weekdays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [] }, { hour: 7, minutes: [] }, { hour: 8, minutes: [1, 19, 37] }, { hour: 9, minutes: [24] }, { hour: 10, minutes: [] }, { hour: 11, minutes: [] }, { hour: 12, minutes: [] }, { hour: 13, minutes: [] }, { hour: 14, minutes: [] }, { hour: 15, minutes: [] }, { hour: 16, minutes: [] }, { hour: 17, minutes: [] }, { hour: 18, minutes: [30] }, { hour: 19, minutes: [0, 32, 56] }, { hour: 20, minutes: [28] }, { hour: 21, minutes: [4] }, { hour: 22, minutes: [] }, { hour: 23, minutes: [] }], holidays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [] }, { hour: 7, minutes: [] }, { hour: 8, minutes: [24] }, { hour: 9, minutes: [27] }, { hour: 10, minutes: [] }, { hour: 11, minutes: [] }, { hour: 12, minutes: [] }, { hour: 13, minutes: [] }, { hour: 14, minutes: [] }, { hour: 15, minutes: [] }, { hour: 16, minutes: [] }, { hour: 17, minutes: [32, 56] }, { hour: 18, minutes: [32] }, { hour: 19, minutes: [4] }, { hour: 20, minutes: [4] }, { hour: 21, minutes: [] }, { hour: 22, minutes: [] }, { hour: 23, minutes: [] }] },
        route112: { name: "五位ノ池 経由 鷹取駅方面", number: "112", detailUrl: "https://location.its-mo.com/usersite/kobe/US0005/search/jp?busStopCode=0440&directionId=kobe0126", weekdays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [] }, { hour: 7, minutes: [] }, { hour: 8, minutes: [] }, { hour: 9, minutes: [] }, { hour: 10, minutes: [47] }, { hour: 11, minutes: [48] }, { hour: 12, minutes: [51] }, { hour: 13, minutes: [51] }, { hour: 14, minutes: [51] }, { hour: 15, minutes: [51] }, { hour: 16, minutes: [51] }, { hour: 17, minutes: [50] }, { hour: 18, minutes: [] }, { hour: 19, minutes: [] }, { hour: 20, minutes: [] }, { hour: 21, minutes: [] }, { hour: 22, minutes: [] }, { hour: 23, minutes: [] }], holidays: [{ hour: 5, minutes: [] }, { hour: 6, minutes: [] }, { hour: 7, minutes: [] }, { hour: 8, minutes: [48] }, { hour: 9, minutes: [51] }, { hour: 10, minutes: [51] }, { hour: 11, minutes: [51] }, { hour: 12, minutes: [51] }, { hour: 13, minutes: [51] }, { hour: 14, minutes: [51] }, { hour: 15, minutes: [51] }, { hour: 16, minutes: [59] }, { hour: 17, minutes: [] }, { hour: 18, minutes: [40] }, { hour: 19, minutes: [28] }, { hour: 20, minutes: [28] }, { hour: 21, minutes: [11] }, { hour: 22, minutes: [6] }, { hour: 23, minutes: [] }] }
    }
};

const TAKATORI_ID = 'opt-takatori';

// 指定されたコンテナにバス掲示板を描画する関数
function renderTakatoriBoard(container) {
    if(!container) return;

    // 現在の設定
    let currentDirection = 'yoshidacho';
    let updateTimer = null;
    let countdownTimer = null;

    // HTML構造
    container.innerHTML = `
        <div class="takatori-display-board">
            <div class="takatori-header">
                <div class="takatori-stop-name">
                    <i id="takatori-fav-btn" class="far fa-star takatori-fav-star"></i>
                    鷹取団地前→
                </div>
                <div class="takatori-controls">
                    <button class="takatori-dir-btn" data-dir="shinkaichi">神戸駅前・兵庫駅方面</button>
                    <button class="takatori-dir-btn active" data-dir="yoshidacho">板宿・新長田駅前方面</button>
                </div>
                <div class="takatori-schedule-type" id="takatori-schedule-type"></div>
            </div>
            <div id="takatori-departures" class="takatori-departures-row"></div>
        </div>
    `;

    // 要素取得
    const scheduleTypeEl = container.querySelector('#takatori-schedule-type');
    const departuresEl = container.querySelector('#takatori-departures');
    const btns = container.querySelectorAll('.takatori-dir-btn');
    const favBtn = container.querySelector('#takatori-fav-btn');

    // お気に入りボタンの状態反映
    if(typeof favorites !== 'undefined' && favorites.includes(TAKATORI_ID)) {
        favBtn.classList.remove('far');
        favBtn.classList.add('fas', 'active');
    }
    
    // お気に入りクリックイベント
    favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if(typeof toggleFavorite === 'function') {
            toggleFavorite(TAKATORI_ID);
            // 状態再反映
            if(favorites.includes(TAKATORI_ID)) {
                favBtn.classList.remove('far');
                favBtn.classList.add('fas', 'active');
            } else {
                favBtn.classList.remove('fas', 'active');
                favBtn.classList.add('far');
            }
        }
    });

    // 方向ボタンイベント
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentDirection = e.target.dataset.dir;
            btns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updateDisplay();
        });
    });

    // --- ロジック関数群 ---
    function getCurrentDateTime() { return new Date(); }

    function isHoliday(date) {
        const day = date.getDay();
        const month = date.getMonth() + 1;
        const dateNum = date.getDate();
        const year = date.getFullYear();
        if (year === 2025 && month === 8 && dateNum === 15) return true;
        return day === 0 || day === 6;
    }

    function updateScheduleType() {
        const now = getCurrentDateTime();
        if (isHoliday(now)) {
            scheduleTypeEl.textContent = '休日ダイヤ';
            scheduleTypeEl.style.color = '#cc0000';
            scheduleTypeEl.style.borderColor = '#cc0000';
        } else {
            scheduleTypeEl.textContent = '平日ダイヤ';
            scheduleTypeEl.style.color = '#009900';
            scheduleTypeEl.style.borderColor = '#009900';
        }
    }

    function getAllDepartures() {
        const now = getCurrentDateTime();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        
        const allDepartures = [];
        const currentTimetable = takatoriTimetables[currentDirection];
        const routesToShow = Object.keys(currentTimetable);

        const collectDepartures = (date) => {
            const scheduleType = isHoliday(date) ? 'holidays' : 'weekdays';
            routesToShow.forEach(routeKey => {
                const routeInfo = currentTimetable[routeKey];
                if (!routeInfo) return;
                const schedule = routeInfo[scheduleType];
                schedule.forEach(hourData => {
                    hourData.minutes.forEach(minute => {
                        const departureDate = new Date(date);
                        departureDate.setHours(hourData.hour, minute, 0, 0);
                        allDepartures.push({
                            routeName: routeInfo.name,
                            routeNumber: routeInfo.number,
                            date: departureDate,
                            detailUrl: routeInfo.detailUrl
                        });
                    });
                });
            });
        };
        
        const today = new Date(now);
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        
        collectDepartures(yesterday);
        collectDepartures(today);

        return allDepartures
            .filter(dep => dep.date >= fiveMinutesAgo)
            .sort((a, b) => a.date - b.date);
    }

    function createDepartureHTML(departure, type) {
        const depTime = departure.date;
        const timeStr = `${String(depTime.getHours()).padStart(2, '0')}:${String(depTime.getMinutes()).padStart(2, '0')}`;
        
        let arrivalTimeInfo = '';
        if (currentDirection === 'yoshidacho') {
            const arrivalTime = new Date(depTime.getTime() + 7 * 60000);
            const arrivalTimeStr = `${String(arrivalTime.getHours()).padStart(2, '0')}:${String(arrivalTime.getMinutes()).padStart(2, '0')}`;
            arrivalTimeInfo = `<div class="takatori-arrival">板宿 ${arrivalTimeStr} 着</div>`;
        }

        let detailButtonHTML = '';
        if (departure.detailUrl) {
            detailButtonHTML = `<a href="${departure.detailUrl}" class="takatori-btn" target="_blank" rel="noopener noreferrer">※</a>`;
        }

        return `
            <div class="takatori-item">
                <div class="takatori-content">
                    <div class="takatori-left">
                        <div class="takatori-label">【${type}】</div>
                        <div class="takatori-route">
                            <span class="takatori-route-num">${departure.routeNumber}</span>${departure.routeName}
                        </div>
                        ${arrivalTimeInfo}
                    </div>
                    <div class="takatori-time-col">
                        <div class="takatori-clock">${timeStr}</div>
                        <div class="takatori-sub-row">
                            <div class="takatori-remain">
                                <span class="takatori-countdown" data-deptime="${depTime.getTime()}"></span>
                            </div>
                            ${detailButtonHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function updateUpcomingDepartures(allDepartures) {
        const upcomingDepartures = allDepartures.filter(dep => dep.date >= getCurrentDateTime());
        const nextDeparture = upcomingDepartures[0];
        const secondDeparture = upcomingDepartures[1];
        
        if (!nextDeparture) {
            departuresEl.innerHTML = `<div class="takatori-no-dep">本日の運行は終了しました</div>`;
            return;
        }
        
        let html = createDepartureHTML(nextDeparture, '先発');
        if (secondDeparture) {
            html += createDepartureHTML(secondDeparture, '次発');
        } else {
            html += `
                <div class="takatori-item">
                    <div class="takatori-content">
                        <div class="takatori-left"><div class="takatori-label">【次発】</div></div>
                        <div class="takatori-no-dep" style="padding:0;">ありません</div>
                    </div>
                </div>
            `;
        }
        departuresEl.innerHTML = html;
    }

    function updateCountdowns() {
        const countdownElements = container.querySelectorAll('.takatori-countdown');
        const now = new Date().getTime();

        countdownElements.forEach(el => {
            const depTime = parseInt(el.dataset.deptime, 10);
            if (isNaN(depTime)) return;

            const diff = depTime - now;
            const remainingDiv = el.closest('.takatori-remain');

            if (diff < 0) {
                el.textContent = "出発";
                if(remainingDiv) remainingDiv.classList.remove('blink');
                return;
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            el.textContent = `あと ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            if(remainingDiv) {
                if (diff < 60000) remainingDiv.classList.add('blink');
                else remainingDiv.classList.remove('blink');
            }
        });
    }

    function updateDisplay() {
        if(!document.body.contains(container)) {
            // コンテナが消えていたらタイマー停止
            clearInterval(updateTimer);
            clearInterval(countdownTimer);
            return;
        }
        const allDepartures = getAllDepartures();
        updateScheduleType();
        updateUpcomingDepartures(allDepartures);
        updateCountdowns();
    }

    // 初回実行
    updateDisplay();
    // タイマー設定
    updateTimer = setInterval(updateDisplay, 30000);
    countdownTimer = setInterval(updateCountdowns, 1000);
}
