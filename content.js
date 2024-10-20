// content.js
let isEnabled = false;

chrome.storage.local.get('isEnabled', function(data) {
  isEnabled = data.isEnabled;
  if (isEnabled) {
    initializeExtension();
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "toggleExtension") {
    isEnabled = request.isEnabled;
    if (isEnabled) {
      initializeExtension();
    } else {
      disableExtension();
    }
  }
});

function initializeExtension() {
  removeLikeButtons();
  observeChanges();
  document.addEventListener('dblclick', preventDoubleClick, true);
}

function disableExtension() {
  if (window.observer) {
    window.observer.disconnect();
  }
  document.removeEventListener('dblclick', preventDoubleClick, true);
}

function removeLikeButtons() {
  const likeButtons = document.querySelectorAll('div[role="button"] svg[aria-label="Like"]');
  likeButtons.forEach(button => {
    const parentButton = button.closest('div[role="button"]');
    if (parentButton) {
      parentButton.remove();
    }
  });
}

function preventDoubleClick(e) {
  e.stopPropagation();
  e.preventDefault();
}

function observeChanges() {
  const targetNode = document.body;
  const config = { childList: true, subtree: true };
  
  const callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        removeLikeButtons();
      }
    }
  };
  
  window.observer = new MutationObserver(callback);
  window.observer.observe(targetNode, config);
}