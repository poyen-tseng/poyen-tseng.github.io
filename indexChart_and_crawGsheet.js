var myChart,
    visibleDatasets,
    rangeValue,
    maxPercentage,
    minPercentage,
    flattenedDataArray_max,
    flattenedDataArray_min

    ; //全域變數

let pswd = "";
let is_login = 0;

let balance_str1 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS0IEfyMkgl-';
let balance_str2 = 'rTDQqZM2IrbS57nR0j81zYC9qQGEk-HS9Hn6Uz_ir-xAmK-_xVOkG__a16P72WupFV/pubhtml?gid=1483629649&single=true';
// let balance_url = "";
let stock_position_str1 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS0IEfyMkgl-';
let stock_position_str2 = 'rTDQqZM2IrbS57nR0j81zYC9qQGEk-HS9Hn6Uz_ir-xAmK-_xVOkG__a16P72WupFV/pubhtml?gid=515260145&single=true';
// let position_url = "";
let future_position_str1 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS0IEfyMkgl-';
let future_position_str2 = 'rTDQqZM2IrbS57nR0j81zYC9qQGEk-HS9Hn6Uz_ir-xAmK-_xVOkG__a16P72WupFV/pubhtml?gid=1019911153&single=true';


let tradeHistory_str1 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS0IEfyMkgl-';
let tradeHistory_str2 = 'rTDQqZM2IrbS57nR0j81zYC9qQGEk-HS9Hn6Uz_ir-xAmK-_xVOkG__a16P72WupFV/pubhtml?gid=124928573&single=true';


let tradeHistory_week_str1 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS0IEfyMkgl-';
let tradeHistory_week_str2 = 'rTDQqZM2IrbS57nR0j81zYC9qQGEk-HS9Hn6Uz_ir-xAmK-_xVOkG__a16P72WupFV/pubhtml?gid=2076171331&single=true';

if (is_login == 0) {
    pswd = getCookie('slothCookie'); //prompt("輸入密碼獲取數據:");
    is_login = 1;
}
const balance_url = balance_str1 + pswd + balance_str2;
const stock_position_url = stock_position_str1 + pswd + stock_position_str2;
const future_position_url = future_position_str1 + pswd + future_position_str2;
const tradeHistory_url = tradeHistory_str1 + pswd + tradeHistory_str2;
const tradeHistory_week_url = tradeHistory_week_str1 + pswd + tradeHistory_week_str2;

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// document.getElementById("output").innerText = "Your password is: " + getQueryParam("password");

// if (pswd != "") {
fetch(balance_url)
    .then(response => response.text())
    .then(html => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var table = doc.querySelector('.waffle');

        table.querySelectorAll(".row-header-wrapper").forEach(table => table.remove());
        var targetElement = document.getElementById('balanceTable');
        targetElement.innerHTML = table.outerHTML;

        // Add class to the first row 因為要凍結第一列
        var rows = targetElement.querySelectorAll('table tr');
        if (rows.length > 0) {
            // rows[0].classList.add('sticky-header');
            rows[0].classList.add('hidden-row');
        }
        if (rows.length > 1) {
            rows[1].classList.add('sticky-header');
        }

        // 解析表格數據，提取時間、總資產、證券現金餘額、證券市值、期權現金餘額、期權市值
        var totalAssetsData = [];

        var totalStockAssetData = [];
        var stockCashBalanceData = [];
        var stockValueData = [];
        var timeLabels = [];

        var totalFutureAssetData = [];
        var futureOptionBalanceData = [];
        var futureOptionValueData = [];
        // 遍歷表格行
        table.querySelectorAll('tr').forEach((row, index) => {
            if (index > 0) { // 略過表頭
                var columns = row.querySelectorAll('td');
                var timeLabel = columns[0].textContent.trim();

                // 排除 "test_page" 與 "時間" 元素
                if (timeLabel !== "時間") {
                    timeLabels.push(timeLabel);
                    totalAssetsData.push(parseFloat(columns[1].textContent.trim()));

                    totalStockAssetData.push(parseFloat(columns[2].textContent.trim()));
                    stockCashBalanceData.push(parseFloat(columns[3].textContent.trim()));
                    stockValueData.push(parseFloat(columns[4].textContent.trim()));

                    totalFutureAssetData.push(parseFloat(columns[5].textContent.trim()));
                    futureOptionBalanceData.push(parseFloat(columns[6].textContent.trim()));
                    futureOptionValueData.push(parseFloat(columns[7].textContent.trim()));
                }
            }

        });
        document.getElementById("myUpdateTime").textContent = timeLabels[0]; //更新時間為<span>的那個......

        // 將陣列順序顛倒
        timeLabels.reverse();
        totalAssetsData.reverse();
        totalStockAssetData.reverse();
        stockCashBalanceData.reverse();
        stockValueData.reverse();

        totalFutureAssetData.reverse();
        futureOptionBalanceData.reverse();
        futureOptionValueData.reverse();

        // 繪製疊圖
        var ctx = document.getElementById('myChart').getContext('2d');


        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabels,
                datasets: [
                    {
                        label: '總資產',
                        // yAxisID: 'percentage',
                        data: totalAssetsData,
                        borderColor: 'rgba(75, 192, 192, 1)', //66CCCC
                        borderWidth: 1,
                        fill: false,
                        hidden: false,
                        pointRadius: 1 // Remove points
                    },
                    {
                        label: '證券總資產',
                        data: totalStockAssetData,
                        borderColor: '# a55afa', //FF6699
                        borderWidth: 1,
                        fill: false,
                        hidden: true,
                        pointRadius: 1 // Remove points
                    },
                    {
                        label: '證券現金餘額',
                        data: stockCashBalanceData,
                        borderColor: 'rgba(255, 99, 132, 1)', //FF6699
                        borderWidth: 1,
                        fill: false,
                        hidden: true,
                        pointRadius: 1 // Remove points
                    },
                    {
                        label: '證券市值',
                        data: stockValueData,
                        borderColor: 'rgba(54, 162, 235, 1)', //3399CC
                        borderWidth: 1,
                        fill: false,
                        hidden: true,
                        pointRadius: 1 // Remove points
                    },
                    {
                        label: '期權總資產',
                        data: totalFutureAssetData,
                        borderColor: '#b1b695', //FF6699
                        borderWidth: 1,
                        fill: false,
                        hidden: true,
                        pointRadius: 1 // Remove points
                    },
                    {
                        label: '期權現金餘額',
                        data: futureOptionBalanceData,
                        borderColor: 'rgba(1,22,39, 1)', //011627
                        borderWidth: 1,
                        fill: false,
                        hidden: true,
                        pointRadius: 1 // Remove points
                    },
                    {
                        label: '期權市值',
                        data: futureOptionValueData,
                        borderColor: 'rgba(255, 159, 28, 1)', //FF9F1C
                        borderWidth: 1,
                        fill: false,
                        hidden: true,
                        pointRadius: 1 // Remove points
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        type: 'category',
                        labels: timeLabels,
                        min: 10, // Start index of the data to display
                        // max: 150 // End index of the data to display
                    },
                    y: {
                        type: 'linear',
                        position: 'left'
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        min: minPercentage,
                        max: maxPercentage,
                        ticks: {
                            callback: function (value) {
                                return (Math.round(value * 100) / 100) + '%';
                            },
                            maxTicksLimit: 100
                        },
                        // 調整 ticks 的數量，根據需要增加或減少
                        grid: {
                            // count: 10, // 调整 tick 的数量，根据需要增加或减少
                            color: function (context) {
                                return Math.abs(context.tick.value - 100) < 0.01 ? 'rgba(255,0, 0, 0.5)' : 'rgba(255, 0, 0, 0.2)';
                            },
                            lineWidth: function (context) {
                                return Math.abs(context.tick.value - 100) < 0.01 ? 2 : 1;  // 只有 y1 = 100 的格線加粗
                            }
                        },
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: '資產變化圖',
                        font: {
                            size: 20,
                        }
                    }
                },
                maintainAspectRatio: false, // 設定為 false，允許手動設定寬高
            }
        });
        maxLabel.textContent = myChart.scales.y.max;
        minLabel.textContent = myChart.scales.y.min;

        // rangeInput.value = flattenedDataArray[0];
        rangeInput.max = myChart.scales.y.max;
        rangeInput.min = myChart.scales.y.min;

        rangeValue = document.getElementById('rangeInput').value;
        maxPercentage = Math.round((myChart.scales.y.max / rangeValue) * 100 * 1000) / 1000;
        minPercentage = Math.round((myChart.scales.y.min / rangeValue) * 100 * 1000) / 1000;

    })
    .catch(error => console.error('獲取數據錯誤:', error));

//從gsheet爬取目前持倉
fetch(stock_position_url)
    .then(response => response.text())
    .then(html => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var table = doc.querySelector('.waffle');
        table.querySelectorAll(".row-header-wrapper").forEach(table => table.remove());
        var targetElement = document.getElementById('positionTable_stock');
        targetElement.innerHTML = table.outerHTML;
        // Add class to the first row 因為要凍結第一列
        var rows = targetElement.querySelectorAll('table tr');
        if (rows.length > 0) {
            // rows[0].classList.add('sticky-header');
            rows[0].classList.add('hidden-row');
        }
        if (rows.length > 1) {
            rows[1].classList.add('sticky-header');
        }
    });

fetch(future_position_url)
    .then(response => response.text())
    .then(html => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var table = doc.querySelector('.waffle');
        table.querySelectorAll(".row-header-wrapper").forEach(table => table.remove());
        var targetElement = document.getElementById('positionTable_future');
        targetElement.innerHTML = table.outerHTML;
        // Add class to the first row 因為要凍結第一列
        var rows = targetElement.querySelectorAll('table tr');
        if (rows.length > 0) {
            // rows[0].classList.add('sticky-header');
            rows[0].classList.add('hidden-row');
        }
        if (rows.length > 1) {
            rows[1].classList.add('sticky-header');
        }
    });


fetch(tradeHistory_week_url)
    .then(response => response.text())
    .then(html => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var table = doc.querySelector('.waffle');
        table.querySelectorAll(".row-header-wrapper").forEach(table => table.remove());
        var targetElement = document.getElementById('tradeHistory_week');
        targetElement.innerHTML = table.outerHTML;
        // Add class to the first row 因為要凍結第一列
        var rows = targetElement.querySelectorAll('table tr');
        if (rows.length > 0) {
            // rows[0].classList.add('sticky-header');
            rows[0].classList.add('hidden-row');
        }
        if (rows.length > 1) {
            rows[1].classList.add('sticky-header');
        }
    });

fetch(tradeHistory_url)
    .then(response => response.text())
    .then(html => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var table = doc.querySelector('.waffle');
        table.querySelectorAll(".row-header-wrapper").forEach(table => table.remove());
        var targetElement = document.getElementById('tradeHistory_old');
        targetElement.innerHTML = table.outerHTML;
        // Add class to the first row 因為要凍結第一列
        var rows = targetElement.querySelectorAll('table tr');
        if (rows.length > 0) {
            // rows[0].classList.add('sticky-header');
            rows[0].classList.add('hidden-row');
        }
        if (rows.length > 1) {
            rows[1].classList.add('sticky-header');
        }
    });

function updateChart() {
    // flattenedDataArray = myChart.data.datasets.filter(dataset => !dataset.hidden).map(dataset => dataset.data).flat();

    document.getElementById('maxLabel').textContent = myChart.scales.y.max;
    document.getElementById('minLabel').textContent = myChart.scales.y.min;
    document.getElementById('currentLabel').textContent = rangeValue;

    document.getElementById('rangeInput').max = myChart.scales.y.max;
    document.getElementById('rangeInput').min = myChart.scales.y.min;
    // document.getElementById('currentLabel').min = flattenedDataArray_min;
    rangeValue = document.getElementById('rangeInput').value;
    maxPercentage = Math.round((myChart.scales.y.max / rangeValue) * 100 * 1000) / 1000;
    minPercentage = Math.round((myChart.scales.y.min / rangeValue) * 100 * 1000) / 1000;

    myChart.options.scales.y1.max = maxPercentage;
    myChart.options.scales.y1.min = minPercentage;
    myChart.update();
}
function updateTimeScale() {
    document.getElementById('timeScaleSlider').max = myChart.options.scales.x.labels.length - 10;
    document.getElementById('timeScaleSlider').min = 0;
    const timeRangeValue = document.getElementById('timeScaleSlider').value;
    myChart.options.scales.x.min = parseInt(timeRangeValue);
    console.log(timeRangeValue)
    // myChart.options.scales.x.max = 150;
    myChart.update();
}

