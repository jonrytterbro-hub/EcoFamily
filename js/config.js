// EcoFamily Configuration

const CONFIG = {
  // Firebase Configuration
  firebase: {
    apiKey: "AIzaSyA8xpPsK_E2hXgU5D5qw612SFA5vIVOTGU",
    authDomain: "ecofamily-ffa0a.firebaseapp.com",
    databaseURL: "https://ecofamily-ffa0a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ecofamily-ffa0a",
    storageBucket: "ecofamily-ffa0a.firebasestorage.app",
    messagingSenderId: "325072897213",
    appId: "1:325072897213:web:b2c6fa856b129e267963d4"
  },

  // Family Members
  familyMembers: [
    { id: 1, name: 'Jon', color: 'blue' },
    { id: 2, name: 'Johanna', color: 'purple' },
    { id: 3, name: 'Linnéa', color: 'pink' },
    { id: 4, name: 'Rafael', color: 'green' },
    { id: 5, name: 'Alicia', color: 'orange' }
  ],

  // Default Data Structure
  defaultData: {
    meals: [],
    activities: [],
    future: [],
    wishes: [],
    shopping: {
      food: [],
      basics: [],
      big: []
    },
    learning: []
  },

  // App Settings
  settings: {
    defaultMealTime: '19:00',
    defaultActivityTime: '17:00',
    minFamilyCodeLength: 6
  }
};

// Make CONFIG globally available
window.CONFIG = CONFIG;
