// Check if email addresses are available for the current domain and update the
// color of the browser icon
//
function LaunchColorChange() {
  chrome.tabs.query(
    {currentWindow: true, active : true},
    function(tabArray){
      if (tabArray[0]["url"] != window.currentDomain) {
        window.currentDomain = url_domain(tabArray[0]["url"]).replace("www.", "");
        updateIconColor();
      }
    }
  );
}


// When an URL changes
//
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  LaunchColorChange();
});


// When active tab changes
//
chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
  LaunchColorChange();
});


// API call to check if there is at least one email address
// Documentation: https://hunter.io/api/v2/docs#email-count
//
function updateIconColor() {
  $.ajax({
    url : 'https://api.hunter.io/v2/email-count?domain=' + window.currentDomain,
    type : 'GET',
    success : function(json){
      if (json.data.total > 0) { setColoredIcon(); }
      else { setGreyIcon(); }
    },
    error : function() {
      setColoredIcon();
    }
  });
}

function setGreyIcon() {
  chrome.browserAction.setIcon({
    path : {
      "19": chrome.extension.getURL("shared/img/icon19_grey.png"),
      "38": chrome.extension.getURL("shared/img/icon38_grey.png")
    }
  });
}

function setColoredIcon() {
  chrome.browserAction.setIcon({
    path : {
      "19": chrome.extension.getURL("shared/img/icon19.png"),
      "38": chrome.extension.getURL("shared/img/icon38.png")
    }
  });
}

function url_domain(data) {
  var    a      = document.createElement('a');
         a.href = data;
  return a.hostname;
}
