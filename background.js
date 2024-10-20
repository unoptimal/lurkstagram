chrome.runtime.onInstalled.addListener(async () => {
    await chrome.storage.local.set({isEnabled: false});
  });
  