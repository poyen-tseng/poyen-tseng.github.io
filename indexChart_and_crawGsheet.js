var myChart,
    visibleDatasets,
    rangeValue,
    maxPercentage,
    minPercentage,
    flattenedDataArray_max,
    flattenedDataArray_min
    ; //全域變數

fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vS0IEfyMkgl-wrTDQqZM2IrbS57nR0j81zYC9qQGEk-HS9Hn6Uz_ir-xAmK-_xVOkG__a16P72WupFV/pubhtml?gid=1483629649&single=true')
    .then(response => response.text())
    .then(html => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var table = doc.querySelector('.waffle');
        table.querySelectorAll(".row-header-wrapper").forEach(table => table.remove());
        var targetElement = document.getElementById('balanceTable');
        targetElement.innerHTML = table.outerHTML;

        // 解析表格數據，提取時間、總資產、證券現金餘額、證券市值、期權現金餘額、期權市值
        var timeLabels = [];
        var totalAssetsData = [];

        var totalStockAssetData = [];
        var stockCashBalanceData = [];
        var stockValueData = [];

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
                        hidden: false

                    },
                    {
                        label: '證券總資產',
                        data: totalStockAssetData,
                        borderColor: '#fcd0a1', //FF6699
                        borderWidth: 1,
                        fill: false,
                        hidden: true
                    },
                    {
                        label: '證券現金餘額',
                        data: stockCashBalanceData,
                        borderColor: 'rgba(255, 99, 132, 1)', //FF6699
                        borderWidth: 1,
                        fill: false,
                        hidden: true
                    },
                    {
                        label: '證券市值',
                        data: stockValueData,
                        borderColor: 'rgba(54, 162, 235, 1)', //3399CC
                        borderWidth: 1,
                        fill: false,
                        hidden: true
                    },
                    {
                        label: '期權總資產',
                        data: totalFutureAssetData,
                        borderColor: '#b1b695', //FF6699
                        borderWidth: 1,
                        fill: false,
                        hidden: true
                    },
                    {
                        label: '期權現金餘額',
                        data: futureOptionBalanceData,
                        borderColor: 'rgba(1,22,39, 1)', //011627
                        borderWidth: 1,
                        fill: false,
                        hidden: true
                    },
                    {
                        label: '期權市值',
                        data: futureOptionValueData,
                        borderColor: 'rgba(255, 159, 28, 1)', //FF9F1C
                        borderWidth: 1,
                        fill: false,
                        hidden: true
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        type: 'category',
                        labels: timeLabels,
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

        // 過濾出 hidden=false 的項目
        // visibleDatasets = myChart.data.datasets.filter(dataset => !dataset.hidden);
        // console.log(visibleDatasets);
        // 提取只有 hidden=false 的數字資料
        // var visibleDataArray = visibleDatasets.map(dataset => dataset.data);
        // console.log(visibleDataArray);

        // 將嵌套的數字陣列扁平化
        // var flattenedDataArray = visibleDataArray.flat();
        // flattenedDataArray_max = Math.max(...flattenedDataArray.filter(num => !isNaN(num)))
        // flattenedDataArray_min = Math.min(...flattenedDataArray.filter(num => !isNaN(num)))

        // console.log(flattenedDataArray);

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


//從gsheet爬取目前持倉
fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vS0IEfyMkgl-wrTDQqZM2IrbS57nR0j81zYC9qQGEk-HS9Hn6Uz_ir-xAmK-_xVOkG__a16P72WupFV/pubhtml?gid=515260145&single=true')
    .then(response => response.text())
    .then(html => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var table = doc.querySelector('.waffle');
        table.querySelectorAll(".row-header-wrapper").forEach(table => table.remove());
        var targetElement = document.getElementById('positionTable');
        targetElement.innerHTML = table.outerHTML;

        // // 解析表格數據，提取時間、總資產、證券現金餘額、證券市值、期權現金餘額、期權市值
        // var stockNum = [];
        // var direction = [];

        // var quantity = [];
        // var averagePrice = [];
        // var latestPrice = [];

        // var yesterdayQuantity = [];
        // var tradeType = [];
        // var loan = [];
        // var collateral = [];
        // var margin = [];
        // var interest = [];

        // // 遍歷表格行
        // table.querySelectorAll('tr').forEach((row, index) => {
        //     if (index > 0) { // 略過表頭
        //         var columns = row.querySelectorAll('td');
        //         // var timeLabel = columns[0].textContent.trim();

        //         // 排除 "test_page" 與 "時間" 元素
        //         // if (timeLabel !== "時間") {
        //         // timeLabel.push(parseFloat(columns[0].textContent.trim()));
        //         stockNum.push(parseFloat(columns[1].textContent.trim()));

        //         direction.push(parseFloat(columns[2].textContent.trim()));
        //         quantity.push(parseFloat(columns[3].textContent.trim()));
        //         averagePrice.push(parseFloat(columns[4].textContent.trim()));

        //         latestPrice.push(parseFloat(columns[5].textContent.trim()));
        //         yesterdayQuantity.push(parseFloat(columns[6].textContent.trim()));
        //         tradeType.push(parseFloat(columns[7].textContent.trim()));
        //         loan.push(parseFloat(columns[8].textContent.trim()));
        //         collateral.push(parseFloat(columns[8].textContent.trim()));
        //         margin.push(parseFloat(columns[9].textContent.trim()));
        //         interest.push(parseFloat(columns[10].textContent.trim()));
        //         // }
        //     }

    });
// })
