/**
 * Application Main Entry & Initialization
 */

const App = {
  async init() {
    console.log('[App] Initializing Video Admin Application...');
    
    // Initialize data layer from CSV seed if not already present
    await Storage.initData();

    // Global keyboard listener (Escape key closes modals)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-backdrop.active');
        if (activeModal) {
          activeModal.classList.remove('active');
        }
      }
    });

    console.log('[App] Application ready.');
  }
};

window.App = App;

// Run initial data check on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
