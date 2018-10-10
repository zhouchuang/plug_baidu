var globalChekcNum = 0;
var globalFoldNum  = 0;
var globalDivs = [];
var globalCount = 0;
var globalWeb =null;
var globalMsgNum = 0;
var config = {transfAI:true,adAI:true,jumpAI:true,codeAI:false};
var baiduTURL = "http://fanyi.baidu.com/v2transapi?from=zh&to=en&transtype=translang&simple_means_flag=3&query=";
// var hujiangTURL = "https://dict.hjenglish.com/services/Translate.ashx?from=zh-CN&to=en&text=";
var hujiangTURL = "https://dict.hjenglish.com/v10/dict/translation/cn/en";

var adCount = 0;
function removeAd(){
	/*var divs = document.getElementById("content_left").childNodes;
	if(divs.length>0){
		for(var i=0;i<divs.length;i++){
			var div  =  divs[i];
			checkAdBlock(div);
		}
		replaceAd();
	}
	globalCount ++;
	if(globalCount>=150){
		realRemove();
	}*/


	if(document.getElementById("content_left")){
        var first = document.getElementById("content_left").children[0];
        if(first.className.indexOf("c-container")==-1 ){
           /* console.log( "屏蔽了"+first.children.length+"条广告");
            clearInterval(globalChekcNum);
            document.getElementById("content_left").appendChild(first);
            var node  = document.createElement('p');
            node.innerText = "屏蔽了"+first.children.length+"条广告";
            node.style  = "padding:5px 0px;color:#4cae4c;";
            document.getElementById("content_left").insertBefore(node,document.getElementById("content_left").children[0]);*/
           console.log(first.className);
            if(first.className.length==7){
                adCount += first.children.length;
		    }else{
                adCount++;
		    }
		    document.getElementById("content_left").appendChild(first);
        }
	}

    globalCount ++;
    if(globalCount>=200){
    	if(adCount>0){
            var node  = document.createElement('p');
            node.innerText = "屏蔽了"+adCount+"条广告";
            node.style  = "padding:5px 0px;color:#4cae4c;";
            document.getElementById("content_left").insertBefore(node,document.getElementById("content_left").children[0]);
		}
        clearInterval(globalChekcNum);
    }

}
function realRemove(){
	clearInterval(globalChekcNum);
	var divs = document.getElementById("content_left").childNodes;
	if(divs.length>0){
		for(var i=0;i<divs.length;i++){
			var div  =  divs[i];
			checkAdBlock(div);
		}
		moveAd();
	}
}
function showAlert(msgstr,time){
	//<div class="alert alert-info">信息！请注意这个信息。</div>
	time = time||3000;
	var span = document.createElement("div");
	span.className = "msgspan";
	span.innerText=msgstr;
	var alert =
	{
	    color: '#ffffff',
	    'background-color': '#3385ff',
	    'border-color': '#bce8f1',
	    padding: '7px',
	    'margin-bottom': '2px',
	    border: '1px solid transparent',
	    'border-radius': '4px',
	    'box-sizing': 'border-box',
	    'font-size': '14px',
    	'line-height': '1.42857143',
    	'cursor':'pointer'
	}
	for( var i in alert)
	{
	   span.style[i]=alert[i] 
	}
	document.getElementById("form").insertBefore(span,document.getElementById("mHolder").parentNode);
	globalMsgNum = setTimeout(function(){
		document.getElementById("form").removeChild(span);	
		clearTimeout(globalMsgNum);
	},time);
}
function showMsg(msgstrs,time,type){
	time = time||3000;
	type = type||"button";
	var spans = [];
	for(msgindex in msgstrs){
		var msgstr = msgstrs[msgindex];
		var span = document.createElement("span");
		span.className = "msgspan bg s_btn_wr";
		var input = document.createElement("input");
		input.className = "bg s_btn";
		input.type = type;
		// if(type=="text")input.style['cursor'] = 'none';
		input.value = msgstr;  //"成功拦截"+globalDivs.length+"条广告";
		span.appendChild(input);
		var alert =
		{
		    width : "auto",
			background :"#4cae4c",
			padding:"2px 15px",
			color:"#aa1111",
			border:'1px solid transparent'
		}
		for( var i in alert)
		{
		   input.style[i]=alert[i] 
		}
		span.style['padding-left']="2px";
		document.getElementById("form").insertBefore(span,document.getElementById("mHolder").parentNode);
		if(type=="text"){
			input.focus();
			input.select();
		}
		spans.push(span);
		//setTimeout(function(){document.getElementById("form").removeChild(span)},time);
	}
	globalMsgNum = setTimeout(function(){
		for(spanindex in spans){
			var respan = spans[spanindex];
			try{
				document.getElementById("form").removeChild(respan);	
			}catch(err ){
				console.log(err);
			}
			
		}
		clearTimeout(globalMsgNum);
	},time);
}
function moveAd(){
	if(globalDivs.length>0){
		for (var i=0;i<globalDivs.length;i++){
			var div  = globalDivs[i];
			document.getElementById("content_left").removeChild(div);
		}
		globalDivs = [];
	}
}
function replaceAd(){
	if(globalDivs.length>0){
		for (var i=0;i<globalDivs.length;i++){
			var div  = globalDivs[i];
			document.getElementById("content_left").removeChild(div);
			document.getElementById("content_left").appendChild(div);
		}
		var msgs = "成功拦截"+globalDivs.length+"条广告";
		// showMsg([msgs]);
		clearInterval(globalChekcNum);
		setTimeout(realRemove,3000);
		globalDivs = [];
		showChromeMsg("搜索信息",msgs);
	}
	if(globalWeb!=null){
		
		clearInterval(globalChekcNum);
		if(config.jumpAI){
			// showMsg(["跳转至官网"]);
			setTimeout(function(){globalWeb.click();},1000);
			showChromeMsg("搜索信息","搜索到一条官网，并跳转至官网");
		}
		globalDivs = [];
	}
}

function httpRequest(url,callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
        	callback(xhr.responseText);
        }
    }
    xhr.send();
}

function translation(url,data,callback){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
        	callback(xhr.responseText);
        }
    }
    xhr.send(data);
}


function isChn(str){
	var reg = /^[\u4e00-\u9fa5]+$/;
	return reg.test(str);
}
function transformationCode(str){
	var strs = str.split(" ");
	var functionName = "";
	var className = "";
	var urlName = "";
	for(var i=0;i<strs.length;i++){
		var wold = strs[i];
		if(i==0){
			functionName += wold.toLowerCase();
			className += getFirstLetUp(wold);
			urlName += wold.toLowerCase();
		}else{
			functionName += getFirstLetUp(wold);
			className += getFirstLetUp(wold);
			urlName += "_"+wold.toLowerCase();
		}	
	}
	showMsg([functionName,className,urlName],10000,"text");
}
function getFirstLetUp(wold){
	return wold.substring(0,1).toUpperCase()+wold.substring(1,wold.length).toLowerCase();
}
function initProcess(){
	if(document.getElementById("form")){
		var msgs = document.getElementsByClassName("msgspan");
		for(var i=0;i<msgs.length;i++ ){
			document.getElementById("form").removeChild(msgs[i]);
		}
	}
	if(config.transfAI){
		//var html = httpRequest(hujiangTURL+document.getElementById("kw").value, function(result){
		var formdata = "content=";
        formdata += document.getElementById("kw").value;
		var html = translation(hujiangTURL,formdata, function(result){	
			//transstr = JSON.parse(result).trans_result.data[0].dst;  百度的
			transstr =  JSON.parse(result).data.content;  //沪江的
			if(config.codeAI){
				transformationCode(transstr);
			}else{
				if(transstr.length>30){
					showAlert(transstr,10000);
				}else{
					//showMsg([transstr],10000,"text");
					$.prompt({text:transstr});
				}
		    
			}
			
		});
	}
	
	globalWeb  = null;
	globalCount = 0;
	adCount = 0;
	clearTimeout(globalMsgNum);
	clearInterval(globalChekcNum);
	if(config.adAI){
		globalChekcNum = setInterval(removeAd,10);
	}
	
}
function removeAdHander(event){
	if(event.code==undefined||event.code=="Enter"){
		initProcess();
	}
}
function checkAdBlock(div){
	if(div&&div.innerText){
		var str = div.innerText;
		if(str.indexOf("广告")==0||str.indexOf("广告")==(str.length-3)){
			globalDivs.push(div);
		}else if(globalWeb==null&&div.getElementsByTagName("h3")&&div.getElementsByTagName("h3")[0]&&div.getElementsByTagName("h3")[0].getElementsByTagName("a")&&div.getElementsByTagName("h3")[0].getElementsByTagName("a")[1]&&div.getElementsByTagName("h3")[0].getElementsByTagName("a")[1].text=="官网"){  //   str.indexOf("官网")>0
			globalWeb = div.getElementsByTagName("h3")[0].getElementsByTagName("a")[0];	
		}
	}
}

function loadCss(file){
    var nod = document.createElement("style");
    var str = ".jq-toast-wrap{display:block;position:fixed;width:250px;pointer-events:none!important;margin:0;padding:0;letter-spacing:normal;z-index:9000!important}.jq-toast-wrap *{margin:0;padding:0}.jq-toast-wrap.bottom-left{bottom:20px;left:20px}.jq-toast-wrap.bottom-right{bottom:20px;right:40px}.jq-toast-wrap.top-left{top:20px;left:20px}.jq-toast-wrap.top-right{top:20px;right:40px}.jq-toast-single{display:block;width:100%;padding:10px;margin:0 0 5px;border-radius:4px;font-size:12px;font-family:arial,sans-serif;line-height:17px;position:relative;pointer-events:all!important;background-color:#444;color:#fff}.jq-toast-single h2{font-family:arial,sans-serif;font-size:14px;margin:0 0 7px;background:0 0;color:inherit;line-height:inherit;letter-spacing:normal}.jq-toast-single a{color:#eee;text-decoration:none;font-weight:700;border-bottom:1px solid #fff;padding-bottom:3px;font-size:12px}.jq-toast-single ul{margin:0 0 0 15px;background:0 0;padding:0}.jq-toast-single ul li{list-style-type:disc!important;line-height:17px;background:0 0;margin:0;padding:0;letter-spacing:normal}.close-jq-toast-single{position:absolute;top:3px;right:7px;font-size:14px;cursor:pointer}.jq-toast-loader{display:block;position:absolute;top:-2px;height:5px;width:0;left:0;border-radius:5px;background:red}.jq-toast-loaded{width:100%}.jq-has-icon{padding:10px 10px 10px 50px;background-repeat:no-repeat;background-position:10px}.jq-icon-info{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=);background-color:#31708f;color:#d9edf7;border-color:#bce8f1}.jq-icon-warning{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=);background-color:#8a6d3b;color:#fcf8e3;border-color:#faebcc}.jq-icon-error{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII=);background-color:#a94442;color:#f2dede;border-color:#ebccd1}.jq-icon-success{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==);color:#dff0d8;background-color:#3c763d;border-color:#d6e9c6}";
    nod.type="text/css";  
    nod.innerHTML = str;    
    document.getElementsByTagName("html")[0].appendChild(nod);  
}

function showChromeMsg(title,text){
    if(text==null){
        text = title;
        title  = null;
    }
    $.toast({
        heading: title||'系统提示',
        text: text,
        icon: 'info',
        loader: true,        // Change it to false to disable loader
        loaderBg: '#9EC600'  // To change the background
    })
}


//<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">  解决https访问http的问题
var oMeta = document.createElement('meta');
oMeta['content']='upgrade-insecure-requests';
oMeta['httpEquiv'] = 'Content-Security-Policy';
document.getElementsByTagName('head')[0].appendChild(oMeta);
// document.getElementById("su").style['background']="#4cae4c";
// document.getElementById("su").style['border-bottom'] = '0px';
// document.getElementById("su").value="无广告搜索";

var noadspan = document.createElement("span");
noadspan.className = "bg s_btn_wr";
var noadinput = document.createElement("input");
noadinput.className = "bg s_btn";
noadinput.type = "submit";
noadinput.id = "noad";
noadinput.value = "智能搜索";
noadinput.style['border-bottom'] = "0px";
noadinput.style['background']  = "#4cae4c";
noadspan.appendChild(noadinput);
noadspan.style['padding-left']="2px";
document.getElementById("form").insertBefore(noadspan,document.getElementById("mHolder").parentNode);
document.getElementById("noad").onclick=removeAdHander;
// document.getElementById("kw").onchange = removeAdHander;
document.getElementById("kw").onkeydown = removeAdHander;
// document.getElementById("kw").onclick = removeAdHander;
// var clip = new ZeroClipboard.Client();
// clip.setHandCursor(true);  	



//初始化检测测试
loadCss("jquery.toast");
chrome.runtime.onConnect.addListener(function (port) {//建立监听
    if(port.name == "ma"){//判断通道名称
        port.onMessage.addListener(function (msg) {//监听消息
			config[msg.key]=msg.value;
			console.log(config);
        });
    }
});

//拿到初始化数据后才做操作
chrome.runtime.sendMessage("storeConfig", function(response){
	config = response;
	initProcess();
});