// EcoFamily Firebase Service

const FirebaseService = {
  db: null,
  isInitialized: false,

  /**
   * Initialize Firebase
   */
  init() {
    try {
      firebase.initializeApp(CONFIG.firebase);
      this.db = firebase.database();
      this.isInitialized = true;
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Firebase initialization error:', error);
      this.isInitialized = false;
    }
  },

  /**
   * Check if family code exists
   * @param {string} familyCode
   * @returns {Promise<boolean>}
   */
  async familyExists(familyCode) {
    try {
      const snapshot = await this.db.ref(`families/${familyCode}`).once('value');
      return snapshot.exists();
    } catch (error) {
      console.error('Error checking family existence:', error);
      throw error;
    }
  },

  /**
   * Create new family
   * @param {string} familyCode
   * @param {Object} initialData
   * @returns {Promise<void>}
   */
  async createFamily(familyCode, initialData) {
    try {
      await this.db.ref(`families/${familyCode}`).set({
        created: new Date().toISOString(),
        sharedData: initialData
      });
      console.log('Family created:', familyCode);
    } catch (error) {
      console.error('Error creating family:', error);
      throw error;
    }
  },

  /**
   * Load shared data for a family
   * @param {string} familyCode
   * @returns {Promise<Object>}
   */
  async loadSharedData(familyCode) {
    try {
      const snapshot = await this.db.ref(`families/${familyCode}/sharedData`).once('value');
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return null;
    } catch (error) {
      console.error('Error loading shared data:', error);
      throw error;
    }
  },

  /**
   * Save shared data for a family
   * @param {string} familyCode
   * @param {Object} data
   * @returns {Promise<void>}
   */
  async saveSharedData(familyCode, data) {
    try {
      await this.db.ref(`families/${familyCode}/sharedData`).set(data);
      console.log('Shared data saved');
    } catch (error) {
      console.error('Error saving shared data:', error);
      throw error;
    }
  },

  /**
   * Setup real-time listener for shared data
   * @param {string} familyCode
   * @param {Function} callback
   */
  setupListener(familyCode, callback) {
    if (!this.isInitialized) {
      console.error('Firebase not initialized');
      return;
    }

    this.db.ref(`families/${familyCode}/sharedData`).on('value', (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      }
    });
  },

  /**
   * Remove listener
   * @param {string} familyCode
   */
  removeListener(familyCode) {
    if (this.isInitialized) {
      this.db.ref(`families/${familyCode}/sharedData`).off();
    }
  }
};

// Make FirebaseService globally available
window.FirebaseService = FirebaseService;
