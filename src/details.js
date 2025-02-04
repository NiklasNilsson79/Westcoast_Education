import {
  initializeCourseDetails,
  checkIfLoggedIn,
  startBookingProcess,
  getCourseIdFromUrl,
} from './services/app.js';

// Hämta och visa kursdetaljer när sidan laddas
document.addEventListener('DOMContentLoaded', initializeCourseDetails);

// Hämta knappen från DOM:en
const bookButton = document.getElementById('book-button');

// Lägg till en händelselyssnare på knappen
bookButton.addEventListener('click', () => {
  if (checkIfLoggedIn()) {
    const courseId = getCourseIdFromUrl();
    if (courseId) {
      const userId = localStorage.getItem('loggedInUserId');
      if (confirm('Är du säker på att du vill boka den här kursen?')) {
        startBookingProcess(userId, courseId);
      }
    }
  }
});
