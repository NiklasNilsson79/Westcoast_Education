import {
  checkIfLoggedIn,
  fetchAndDisplayBookedCourses,
  cancelBooking,
} from './services/app.js';

// Kontrollera om användaren är inloggad
if (checkIfLoggedIn()) {
  // Hämta och visa bokade kurser när sidan laddas
  document.addEventListener('DOMContentLoaded', fetchAndDisplayBookedCourses);

  // Lägg till händelselyssnare för "Avboka"-knapparna
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('cancel-booking')) {
      const courseId = event.target.getAttribute('data-course-id');
      cancelBooking(courseId);
    }
  });
}
