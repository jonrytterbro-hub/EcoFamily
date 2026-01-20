// EcoFamily Utility Functions

const Utils = {
  /**
   * Get week dates starting from Monday
   * @param {number} offset - Week offset (0 = current week, 1 = next week, -1 = previous week)
   * @returns {Array<Date>} Array of 7 dates (Monday to Sunday)
   */
  getWeek(offset = 0) {
    const dates = [];
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff + offset * 7));
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  },

  /**
   * Format date as YYYY-MM-DD
   * @param {Date} date
   * @returns {string}
   */
  formatDate(date) {
    return date.toISOString().split('T')[0];
  },

  /**
   * Get short day name (Mån, Tis, etc)
   * @param {Date} date
   * @returns {string}
   */
  dayName(date) {
    const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
    return days[date.getDay()];
  },

  /**
   * Get long day name (Måndag, Tisdag, etc)
   * @param {Date} date
   * @returns {string}
   */
  dayNameLong(date) {
    const days = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
    return days[date.getDay()];
  },

  /**
   * Get person object by ID
   * @param {number} id
   * @returns {Object|null}
   */
  getPersonById(id) {
    return CONFIG.familyMembers.find(p => p.id === id) || null;
  },

  /**
   * Generate unique ID
   * @returns {string}
   */
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  },

  /**
   * Calculate days until a date
   * @param {string} dateString - Date in YYYY-MM-DD format
   * @returns {number}
   */
  daysUntil(dateString) {
    const targetDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = targetDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  },

  /**
   * Show loading spinner
   */
  showLoading() {
    document.getElementById('app').innerHTML = `
      <div class="flex items-center justify-center min-h-screen">
        <div class="spinner"></div>
      </div>
    `;
  },

  /**
   * Show error message
   * @param {string} message
   */
  showError(message) {
    alert(message);
  },

  /**
   * Confirm action
   * @param {string} message
   * @returns {boolean}
   */
  confirm(message) {
    return confirm(message);
  }
};

// Make Utils globally available
window.Utils = Utils;
