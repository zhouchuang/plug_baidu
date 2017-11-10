var configpage = chrome.extension.getBackgroundPage();

window.onload=function(){ 
    configpage.initStoreConfig();
    for(var key in configpage.storeConfig){
        if(!configpage.storeConfig[key]){
            document.getElementById(key).className = "close2 inner";
            document.getElementById(key).parentNode.className= "close1 out";
        }
    }
    chrome.tabs.query(
        {active: true, currentWindow: true},
        function (tabs) {
            var port = chrome.tabs.connect(//建立通道
                tabs[0].id,
                {name: "ma"}//通道名称
            );
            var divs = document.getElementsByTagName('div');
            for (var i=0; i<divs.length; i++ ) {
            	var clickDiv = divs[i];
         		if(clickDiv.className=='close2 inner'||clickDiv.className=='open2 inner'){
         			clickDiv.onclick=function(event){
         				event.target.parentNode.className=(event.target.parentNode.className=="close1 out")?"open1 out":"close1 out";	
         				event.target.className=(event.target.className=="close2 inner")?"open2 inner":"close2 inner";	
                        var msg = {key:event.target.id,value:event.target.className=="open2 inner"};
                        // configpage.config[msg.key]=msg.value;
                        configpage.setStoreConfig(msg.key,msg.value);
                        port.postMessage(msg);//向通道中发送消息    
                    }
         		}
         	} 
        }
   );
};