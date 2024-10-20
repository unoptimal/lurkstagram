// popup.js
document.addEventListener('DOMContentLoaded', function() {
    var toggleSwitch = document.getElementById('toggleSwitch');
    var statusElement = document.getElementById('status');
    var slider = document.querySelector('.slider');
    var body = document.body;
    
    function updateStatus(isEnabled) {
      statusElement.textContent = isEnabled ? 'ENABLED' : 'DISABLED';
      statusElement.className = 'status ' + (isEnabled ? 'enabled' : 'disabled');
      
      if (isEnabled) {
        body.classList.add('dark-mode');
      } else {
        body.classList.remove('dark-mode');
      }
    }
  
    function setSwitchState(isEnabled, animate = false) {
      toggleSwitch.checked = isEnabled;
      updateStatus(isEnabled);
      
      if (animate) {
        slider.classList.add('animate');
      } else {
        slider.classList.remove('animate');
      }
    }
  
    chrome.storage.local.get('isEnabled', function(data) {
      setSwitchState(data.isEnabled || false, false);
    });
    
    toggleSwitch.addEventListener('change', function() {
      const isEnabled = this.checked;
      setSwitchState(isEnabled, true);
      
      chrome.storage.local.set({isEnabled: isEnabled}, function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs[0] && tabs[0].url.includes("instagram.com")) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "toggleExtension", isEnabled: isEnabled})
              .catch(error => console.log("Error sending message:", error));
          }
        });
      });
    });
  });