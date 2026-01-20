// EcoFamily Main Application

const App = {
  /**
   * Initialize application
   */
  async init() {
    console.log('EcoFamily initializing...');
    
    // Initialize Firebase
    FirebaseService.init();
    
    // Check for existing session
    const session = Auth.loadSession();
    
    if (session) {
      // User is logged in
      Auth.currentUser = session.user;
      Auth.familyCode = session.code;
      
      console.log('Session found:', Auth.currentUser.name, Auth.familyCode);
      
      await this.initAfterLogin();
    } else {
      // No session - show login
      Auth.showLogin();
    }
  },

  /**
   * Initialize app after successful login
   */
  async initAfterLogin() {
    try {
      Utils.showLoading();
      
      // Load calendar data
      await Calendar.loadData();
      
      // Setup real-time listeners
      Calendar.setupListener();
      
      // Render calendar
      Calendar.render();
      
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Error initializing app:', error);
      Utils.showError('Kunde inte ladda data. Försök igen.');
      Auth.logout();
    }
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}

// Make App globally available
window.App = App;
