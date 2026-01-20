// EcoFamily Calendar Module

const Calendar = {
  data: null,
  view: 'week',
  weekOffset: 0,

  /**
   * Initialize calendar with data
   * @param {Object} initialData
   */
  init(initialData) {
    this.data = initialData || CONFIG.defaultData;
  },

  /**
   * Load data from Firebase
   */
  async loadData() {
    try {
      const data = await FirebaseService.loadSharedData(Auth.familyCode);
      if (data) {
        this.data = {...CONFIG.defaultData, ...data};
      } else {
        this.data = CONFIG.defaultData;
      }
    } catch (error) {
      console.error('Error loading calendar data:', error);
      this.data = CONFIG.defaultData;
    }
  },

  /**
   * Save data to Firebase
   */
  async saveData() {
    try {
      await FirebaseService.saveSharedData(Auth.familyCode, this.data);
    } catch (error) {
      console.error('Error saving calendar data:', error);
      Utils.showError('Kunde inte spara data');
    }
  },

  /**
   * Setup Firebase listener
   */
  setupListener() {
    FirebaseService.setupListener(Auth.familyCode, (data) => {
      this.data = {...CONFIG.defaultData, ...data};
      this.render();
    });
  },

  /**
   * Add activity
   */
  async addActivity() {
    const title = prompt('Aktivitet:');
    if (!title) return;
    
    const person = parseInt(prompt('Vem? 1=Jon 2=Johanna 3=Linnéa 4=Rafael 5=Alicia'));
    const date = prompt('Datum (YYYY-MM-DD):');
    const time = prompt('Tid:', CONFIG.settings.defaultActivityTime);
    
    this.data.activities.push({
      id: Utils.generateId(),
      title: title,
      person: person,
      date: date,
      time: time,
      addedBy: Auth.currentUser.name,
      created: new Date().toISOString()
    });
    
    await this.saveData();
    this.render();
  },

  /**
   * Delete item
   * @param {string} type - Type of item (activities, meals, etc)
   * @param {string} id - Item ID
   */
  async deleteItem(type, id) {
    if (!Utils.confirm('Ta bort denna aktivitet?')) return;
    
    this.data[type] = this.data[type].filter(item => item.id !== id);
    await this.saveData();
    this.render();
  },

  /**
   * Switch view
   * @param {string} newView
   */
  switchView(newView) {
    this.view = newView;
    this.render();
  },

  /**
   * Change week
   * @param {number} offset
   */
  changeWeek(offset) {
    this.weekOffset = offset;
    this.render();
  },

  /**
   * Render calendar
   */
  render() {
    const week = Utils.getWeek(this.weekOffset);
    
    let html = `
      <div class="max-w-6xl mx-auto p-4">
        ${this.renderHeader(week)}
        ${this.renderWeekView(week)}
      </div>
    `;
    
    document.getElementById('app').innerHTML = html;
  },

  /**
   * Render header
   * @param {Array<Date>} week
   * @returns {string}
   */
  renderHeader(week) {
    return `
      <div class="bg-white rounded-xl shadow-lg p-4 mb-4 fade-in">
        <div class="flex justify-between items-center mb-3">
          <div>
            <h1 class="text-xl font-bold">EcoFamily</h1>
            <p class="text-sm text-gray-600">
              ${week[0].getDate()}/${week[0].getMonth()+1} - ${week[6].getDate()}/${week[6].getMonth()+1}
            </p>
          </div>
          <div class="flex gap-2">
            <button onclick="Calendar.changeWeek(Calendar.weekOffset - 1)" 
              class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">←</button>
            <button onclick="Calendar.changeWeek(0)" 
              class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">Idag</button>
            <button onclick="Calendar.changeWeek(Calendar.weekOffset + 1)" 
              class="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">→</button>
          </div>
        </div>
        
        <div class="flex items-center justify-between mb-3">
          <div class="flex gap-2">
            ${CONFIG.familyMembers.map(p => `
              <span class="px-2 py-1 bg-${p.color}-100 text-${p.color}-700 rounded-full text-xs">
                ${p.name}
              </span>
            `).join('')}
          </div>
          <button onclick="Auth.logout()" 
            class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs">
            Logga ut
          </button>
        </div>
        
        <div class="p-2 bg-${Auth.currentUser.color}-50 rounded mb-3">
          <div class="text-sm font-bold">${Auth.currentUser.name}</div>
          <div class="text-xs text-gray-600">Familj: ${Auth.familyCode}</div>
        </div>
      </div>
    `;
  },

  /**
   * Render week view
   * @param {Array<Date>} week
   * @returns {string}
   */
  renderWeekView(week) {
    let html = '<div class="space-y-3">';
    
    for (const day of week) {
      const dateStr = Utils.formatDate(day);
      const activities = this.data.activities.filter(a => a.date === dateStr);
      const meals = this.data.meals.filter(m => m.date === dateStr);
      
      html += `
        <div class="bg-white rounded-xl shadow-lg p-4 fade-in">
          <div class="flex justify-between mb-3">
            <h3 class="font-bold">
              ${Utils.dayName(day)} ${day.getDate()}/${day.getMonth()+1}
            </h3>
            <button onclick="Calendar.addActivity()" 
              class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
              +
            </button>
          </div>
      `;
      
      // Render meals
      for (const meal of meals) {
        html += `
          <div class="bg-orange-50 border border-orange-200 rounded p-2 mb-2 flex justify-between">
            <div>
              <div class="font-bold text-sm">${meal.dish}</div>
              <div class="text-xs text-gray-600">${meal.portions} portioner</div>
            </div>
            <button onclick="Calendar.deleteItem('meals', '${meal.id}')" 
              class="text-red-600 hover:text-red-800 text-sm">✕</button>
          </div>
        `;
      }
      
      // Render activities
      for (const activity of activities) {
        const person = Utils.getPersonById(activity.person);
        if (person) {
          html += `
            <div class="bg-${person.color}-50 border border-${person.color}-200 rounded p-2 mb-2 flex justify-between">
              <div>
                <div class="font-bold text-sm">${activity.title}</div>
                <div class="text-xs text-gray-600">${activity.time} • ${person.name}</div>
              </div>
              <button onclick="Calendar.deleteItem('activities', '${activity.id}')" 
                class="text-red-600 hover:text-red-800 text-sm">✕</button>
            </div>
          `;
        }
      }
      
      if (activities.length === 0 && meals.length === 0) {
        html += '<p class="text-gray-400 text-sm text-center py-4">Inget planerat</p>';
      }
      
      html += '</div>';
    }
    
    html += '</div>';
    return html;
  }
};

// Make Calendar globally available
window.Calendar = Calendar;
