// EcoFamily AI Module
// Smart Paste, Voice Planning, Gmail Scanning

const AI = {
  /**
   * Parse text and extract activity information
   * @param {string} text
   * @returns {Object}
   */
  parseText(text) {
    // TODO: Implement advanced text parsing
    // This will be built in Phase 2
    
    const result = {
      personId: null,
      personName: '',
      date: null,
      dayName: '',
      time: null,
      title: '',
      activityType: null,
      confidence: 0
    };
    
    // Placeholder for now
    console.log('AI.parseText called with:', text);
    
    return result;
  },

  /**
   * Show Smart Paste modal
   */
  showSmartPaste() {
    // TODO: Implement Smart Paste UI
    // This will be built in Phase 2
    
    alert('Smart Paste kommer snart! Detta bygger vi i nästa fas.');
  },

  /**
   * Start voice planning session
   */
  startVoicePlanning() {
    // TODO: Implement voice recording and transcription
    // This will be built in Phase 4
    
    alert('Voice Planning kommer snart! Detta bygger vi i Fas 4.');
  },

  /**
   * Scan Gmail for activities
   */
  async scanGmail() {
    // TODO: Implement Gmail API integration
    // This will be built in Phase 3
    
    alert('Gmail scanning kommer snart! Detta bygger vi i Fas 3.');
  }
};

// Make AI globally available
window.AI = AI;
