var storeConfig = {transfAI:true,adAI:true,jumpAI:true,codeAI:true};
function setStoreConfig(key,value){
    localStorage.setItem(key,value); 
}
function initStoreConfig(){
    storeConfig.transfAI = localStorage.getItem("transfAI")=="true"; 
    storeConfig.adAI = localStorage.getItem("adAI")=="true"; 
    storeConfig.jumpAI = localStorage.getItem("jumpAI")=="true"; 
    storeConfig.codeAI = localStorage.getItem("codeAI")=="true"; 
    complete = true;
}

function getStoreConfig(){
    initStoreConfig();
    return storeConfig;
}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if(message=="storeConfig"){
        sendResponse(getStoreConfig());
    }
});
