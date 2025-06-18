// Popup script for Instagram Reels Auto Scroller

let settings = {
    enabled: true,
    delayAfterFinish: 2,
    maxWaitTime: 40
  };
  
  // DOM elements
  const toggleSwitch = document.getElementById('toggleSwitch');
  const delaySlider = document.getElementById('delaySlider');
  const delayValue = document.getElementById('delayValue');
  const maxWaitSlider = document.getElementById('maxWaitSlider');
  const maxWaitValue = document.getElementById('maxWaitValue');
  const warning = document.getElementById('warning');
  
  // Initialize popup
  async function init() {
    // Load settings
    try {
      const result = await chrome.storage.sync.get(['autoScrollSettings']);
      if (result.autoScrollSettings) {
        settings = { ...settings, ...result.autoScrollSettings };
      }
    } catch (error) {
      console.log('Using default settings');
    }
  
    // Update UI with loaded settings
    updateUI();
  
    // Check if current tab is Instagram
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentTab = tabs[0];
      const isInstagramTab = currentTab?.url?.includes('instagram.com') || false;
      
      if (!isInstagramTab) {
        warning.style.display = 'block';
      }
    } catch (error) {
      console.log('Could not check current tab');
    }
  
    // Add event listeners
    setupEventListeners();
  }
  
  function updateUI() {
    // Update toggle switch
    toggleSwitch.classList.toggle('enabled', settings.enabled);
    
    // Update sliders
    delaySlider.value = settings.delayAfterFinish;
    delayValue.textContent = settings.delayAfterFinish;
    
    maxWaitSlider.value = settings.maxWaitTime;
    maxWaitValue.textContent = settings.maxWaitTime;
  }
  
  async function updateSettings(newSettings) {
    settings = { ...settings, ...newSettings };
    try {
      await chrome.storage.sync.set({ autoScrollSettings: settings });
    } catch (error) {
      console.log('Could not save settings');
    }
    updateUI();
  }
  
  function setupEventListeners() {
    // Toggle switch
    toggleSwitch.addEventListener('click', () => {
      updateSettings({ enabled: !settings.enabled });
    });
  
    // Delay slider
    delaySlider.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      updateSettings({ delayAfterFinish: value });
    });
  
    // Max wait slider
    maxWaitSlider.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      updateSettings({ maxWaitTime: value });
    });
  }
  
  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }