// 封装ajax
function ajax(options){
	options = options || {};
	options.type = (options.type || "GET").toUpperCase(); //未声明则默认为GET
	var params = formatParams(options.data);
	// 创建XMLHttpRequest对象
	var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.fail && options.fail(status);
                }
            }
        }
        if ("GET" === options.type) {
            xhr.open("GET", options.url + "?" + params, true);
            xhr.send(null);
        } else if ("POST" === options.type) {
            xhr.open("POST", options.url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(params);
        }
}
// 数据编码格式化
function formatParams(data) {
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        arr.push(("v=" + Math.random()).replace(".", ''));
        return arr.join("&");
}

//弹窗
function openPop(popText){
    var popWin =  document.getElementById('popup-win'),
        popTextContainer = document.getElementById('pop-text'),
        popClose = document.getElementById('pop-close'),
        spinnerWin = document.getElementById('spinner-win');

    /*spinnerWin.style.display = "none";
*/
    popTextContainer.innerText = popText;
    popWin.style.display = "block";
    
    popClose.addEventListener("click",closeWin);
}

function closeWin(){
    var popWin =  document.getElementById('popup-win');
    popWin.style.display = "none";
    document.removeEventListener("click",closeWin);  

}

function openSpinner(){
    var spinnerWin = document.getElementById('spinner-win');
    spinnerWin.style.display = "block";
}

function closeSpinner(){
    var spinnerWin = document.getElementById('spinner-win');
    spinnerWin.style.display = "none";
}

function parseUrlQuery(){
    var kv = new Map();
    
    location.search.substring(1).split('&').map(function(_){
        kv.set(_.split('=')[0], _.split('=')[1]);
    });

    return kv;
}