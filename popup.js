const powerToggle = document.getElementById('powerToggle');
const statusPill = document.getElementById('statusPill');
const toggleSub = document.getElementById('toggleSub');
const featureList = document.querySelector('.feature-list');
const reloadBtn = document.getElementById('reloadBtn');

function updateUI(enabled) {
  powerToggle.checked = enabled;
  if (enabled) {
    statusPill.textContent = 'ACTIVE';
    statusPill.className = 'status-pill active';
    toggleSub.textContent = 'All features running';
    featureList.classList.remove('disabled');
  } else {
    statusPill.textContent = 'DISABLED';
    statusPill.className = 'status-pill disabled';
    toggleSub.textContent = 'Protection paused';
    featureList.classList.add('disabled');
  }
}

// Load current setting from storage
chrome.storage.local.get({ rk18_enabled: true }, (res) => {
  updateUI(res.rk18_enabled);
});

// Send change to background worker when toggled
powerToggle.addEventListener('change', () => {
  const enabled = powerToggle.checked;
  updateUI(enabled);
  chrome.runtime.sendMessage({ action: 'SET_ENABLED', enabled: enabled });
});

// Reload active tab button
reloadBtn.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id) {
      chrome.tabs.reload(tab.id);
    }
  } catch (err) {
    console.error('Error reloading tab:', err);
  }
});
