// background.js - Service Worker for RK-18
const SCRIPT_ID = 'rk18-core';
const CSS_ID = 'rk18-css';

let queue = Promise.resolve();

function updateState(enabled) {
  // Ensure calls execute sequentially to prevent race conditions
  queue = queue.then(async () => {
    // 1. Update toolbar badge
    try {
      if (enabled) {
        await chrome.action.setBadgeText({ text: 'ON' });
        await chrome.action.setBadgeBackgroundColor({ color: '#16a34a' });
      } else {
        await chrome.action.setBadgeText({ text: 'OFF' });
        await chrome.action.setBadgeBackgroundColor({ color: '#dc2626' });
      }
    } catch (_) {}

    // 2. Check current registration status
    let existingIds = [];
    try {
      const existing = await chrome.scripting.getRegisteredContentScripts();
      existingIds = existing.map(s => s.id);
    } catch (err) {
      console.warn('Could not query registered scripts:', err);
    }

    if (enabled) {
      // If already registered, do nothing
      if (existingIds.includes(SCRIPT_ID)) {
        return;
      }

      try {
        await chrome.scripting.registerContentScripts([
          {
            id: SCRIPT_ID,
            matches: ['<all_urls>'],
            js: ['unlock.js'],
            runAt: 'document_start',
            allFrames: true,
            matchOriginAsFallback: true,
            world: 'MAIN'
          },
          {
            id: CSS_ID,
            matches: ['<all_urls>'],
            css: ['selection.css'],
            runAt: 'document_start',
            allFrames: true,
            matchOriginAsFallback: true
          }
        ]);
      } catch (err) {
        // If duplicate script ID was somehow reported, ignore gracefully
        if (!err.message?.includes('Duplicate script ID')) {
          console.error('Script registration error:', err);
        }
      }
    } else {
      // If disabled, remove scripts if they exist
      const toUnregister = [SCRIPT_ID, CSS_ID].filter(id => existingIds.includes(id));
      if (toUnregister.length > 0) {
        try {
          await chrome.scripting.unregisterContentScripts({ ids: toUnregister });
        } catch (err) {
          console.warn('Script unregister error:', err);
        }
      }
    }
  }).catch(err => {
    console.error('State update queue error:', err);
  });

  return queue;
}

// Initialize on install or extension reload
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get({ rk18_enabled: true });
  await updateState(data.rk18_enabled);
});

// Initialize on browser startup
chrome.runtime.onStartup.addListener(async () => {
  const data = await chrome.storage.local.get({ rk18_enabled: true });
  await updateState(data.rk18_enabled);
});

// Listen for toggle requests from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'SET_ENABLED') {
    chrome.storage.local.set({ rk18_enabled: message.enabled }).then(() => {
      updateState(message.enabled).then(() => {
        sendResponse({ success: true, enabled: message.enabled });
      });
    });
    return true; // Keep channel open for async response
  }
});
