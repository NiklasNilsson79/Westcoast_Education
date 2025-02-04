import { initializeCourses, setupEventListeners } from '/src/services/app.js';
console.log();

// Kör när sidan laddas
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initializeCourses(); // Ladda och visa kurser
    setupEventListeners(); // Konfigurera event listeners för formulär och knappar
  } catch (error) {
    console.error('Fel vid initiering av applikationen:', error);
    alert(
      'Ett fel inträffade vid initiering av applikationen. Ladda om sidan och försök igen.'
    );
  }
});
