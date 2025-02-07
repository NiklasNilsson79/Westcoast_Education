import { BASE_URL } from './services/api.js';
import { displayCoursesWithBookings } from './services/dom.js';

const fetchCoursesAndBookings = async () => {
  try {
    const [coursesResponse, usersResponse] = await Promise.all([
      fetch(`${BASE_URL}/courses`),
      fetch(`${BASE_URL}/users`),
    ]);

    if (!coursesResponse.ok || !usersResponse.ok) {
      throw new Error('Fel vid hämtning av data.');
    }

    const courses = await coursesResponse.json();
    const users = await usersResponse.json();

    // Skickar datan till dom.js
    displayCoursesWithBookings(courses, users);
  } catch (error) {
    console.error('Fel vid hämtning av kurser och bokningar:', error);
  }
};

// Kör funktionen när sidan laddas
document.addEventListener('DOMContentLoaded', fetchCoursesAndBookings);
