// EcoFamily Authentication Module

const Auth = {
  currentUser: null,
  familyCode: null,

  /**
   * Load session from localStorage
   * @returns {Object|null}
   */
  loadSession() {
    const familyCode = localStorage.getItem('familyCode');
    const userJson = localStorage.getItem('currentUser');
    
    if (familyCode && userJson) {
      try {
        return {
          code: familyCode,
          user: JSON.parse(userJson)
        };
      } catch (error) {
        console.error('Error parsing session:', error);
        return null;
      }
    }
    return null;
  },

  /**
   * Save session to localStorage
   */
  saveSession() {
    localStorage.setItem('familyCode', this.familyCode);
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  },

  /**
   * Clear session
   */
  clearSession() {
    localStorage.removeItem('familyCode');
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.familyCode = null;
  },

  /**
   * Show login screen
   */
  showLogin() {
    document.getElementById('app').innerHTML = `
      <div class="max-w-md mx-auto mt-20 p-4">
        <div class="bg-white rounded-2xl shadow-2xl p-8 fade-in">
          <h1 class="text-3xl font-bold text-center mb-2">🏡 EcoFamily</h1>
          <p class="text-center text-gray-600 mb-8">Familjeplaneraren med AI</p>
          
          <div id="loginContent">
            <div class="space-y-4">
              <button onclick="Auth.showSetup()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl">
                🆕 Skapa ny familj
              </button>
              <button onclick="Auth.showJoin()" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl">
                👨‍👩‍👧‍👦 Gå med i familj
              </button>
            </div>
          </div>
          
          <div class="text-center mt-6 text-sm text-gray-500">
            <p>Med AI Smart Paste och realtidssynkning</p>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Show setup new family screen
   */
  showSetup() {
    const familyOptions = CONFIG.familyMembers.map(m => 
      `<option value="${m.id}">${m.name}</option>`
    ).join('');

    document.getElementById('loginContent').innerHTML = `
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-bold mb-2">Skapa familje-kod:</label>
          <input type="text" id="familyCodeInput" placeholder="t.ex. ANDERSSON2026" 
            class="w-full p-3 border-2 rounded-xl uppercase" value="ANDERSSON2026">
          <p class="text-xs text-gray-600 mt-1">Dela denna kod med familjemedlemmar</p>
        </div>
        
        <div>
          <label class="block text-sm font-bold mb-2">Ditt namn:</label>
          <select id="memberSelect" class="w-full p-3 border-2 rounded-xl">
            ${familyOptions}
          </select>
        </div>
        
        <button onclick="Auth.createFamily()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl">
          Skapa familj →
        </button>
        
        <button onclick="Auth.showLogin()" class="w-full bg-gray-200 hover:bg-gray-300 font-bold py-3 rounded-xl">
          ← Tillbaka
        </button>
      </div>
    `;
  },

  /**
   * Show join family screen
   */
  showJoin() {
    const familyOptions = CONFIG.familyMembers.map(m => 
      `<option value="${m.id}">${m.name}</option>`
    ).join('');

    document.getElementById('loginContent').innerHTML = `
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-bold mb-2">Familje-kod:</label>
          <input type="text" id="joinFamilyCode" placeholder="ANDERSSON2026" 
            class="w-full p-3 border-2 rounded-xl uppercase">
        </div>
        
        <div>
          <label class="block text-sm font-bold mb-2">Ditt namn:</label>
          <select id="joinMemberSelect" class="w-full p-3 border-2 rounded-xl">
            ${familyOptions}
          </select>
        </div>
        
        <button onclick="Auth.joinFamily()" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl">
          Gå med →
        </button>
        
        <button onclick="Auth.showLogin()" class="w-full bg-gray-200 hover:bg-gray-300 font-bold py-3 rounded-xl">
          ← Tillbaka
        </button>
      </div>
    `;
  },

  /**
   * Create new family
   */
  async createFamily() {
    const familyCode = document.getElementById('familyCodeInput').value.trim().toUpperCase();
    const memberId = parseInt(document.getElementById('memberSelect').value);
    
    if (!familyCode || familyCode.length < CONFIG.settings.minFamilyCodeLength) {
      Utils.showError(`Familje-koden måste vara minst ${CONFIG.settings.minFamilyCodeLength} tecken`);
      return;
    }
    
    try {
      Utils.showLoading();
      
      // Check if family already exists
      const exists = await FirebaseService.familyExists(familyCode);
      if (exists) {
        Utils.showError('Denna familje-kod används redan. Välj en annan kod.');
        this.showSetup();
        return;
      }
      
      // Set current user and family code
      this.familyCode = familyCode;
      this.currentUser = Utils.getPersonById(memberId);
      this.saveSession();
      
      // Create family in Firebase
      await FirebaseService.createFamily(familyCode, CONFIG.defaultData);
      
      // Initialize app
      await App.initAfterLogin();
      
    } catch (error) {
      console.error('Error creating family:', error);
      Utils.showError('Kunde inte skapa familj. Kontrollera internetanslutning.');
      this.showLogin();
    }
  },

  /**
   * Join existing family
   */
  async joinFamily() {
    const familyCode = document.getElementById('joinFamilyCode').value.trim().toUpperCase();
    const memberId = parseInt(document.getElementById('joinMemberSelect').value);
    
    if (!familyCode) {
      Utils.showError('Ange familje-kod');
      return;
    }
    
    try {
      Utils.showLoading();
      
      // Check if family exists
      const exists = await FirebaseService.familyExists(familyCode);
      if (!exists) {
        Utils.showError('Kunde inte hitta familj med denna kod. Kontrollera att koden är rätt.');
        this.showJoin();
        return;
      }
      
      // Set current user and family code
      this.familyCode = familyCode;
      this.currentUser = Utils.getPersonById(memberId);
      this.saveSession();
      
      // Initialize app
      await App.initAfterLogin();
      
    } catch (error) {
      console.error('Error joining family:', error);
      Utils.showError('Kunde inte gå med i familj. Kontrollera internetanslutning.');
      this.showLogin();
    }
  },

  /**
   * Logout
   */
  logout() {
    if (Utils.confirm('Vill du logga ut?')) {
      FirebaseService.removeListener(this.familyCode);
      this.clearSession();
      location.reload();
    }
  }
};

// Make Auth globally available
window.Auth = Auth;
