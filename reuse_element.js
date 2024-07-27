function injectNavigationBar(targetId) {
    const navigationBarHtml = `
        <p style="text-align: center;">
            <a href="report.html">績效報表</a>
            <a href="strategy.html">策略報表</a>
            <a href="aboutMe.html">關於我</a>
            <a href="aboutThisPage.html">關於這個網頁</a>
        </p>
        
    `;
    document.getElementById(targetId).innerHTML = navigationBarHtml;
}
// 當文檔加載完成時調用injectNavigationBar函數
document.addEventListener('DOMContentLoaded', function () {
    injectNavigationBar('pageNavigator');
});