import { createCourseDisplay } from './dom.js';

const coursesList = document.getElementById('courses');

// Funktion för att hämta kurser från JSON-servern
const fetchCourses = async () => {
  try {
    const response = await fetch('http://localhost:3001/courses');
    const data = await response.json();
    console.log('Fetched data:', data); // Logga data för att se dess struktur

    // Kontrollera om data är en array
    if (Array.isArray(data)) {
      renderCourses(data); // Om det är en array, skicka den direkt till renderCourses
    } else {
      console.error('Data är inte en array:', data);
      document.getElementById('courses').innerHTML =
        '<li>Ett fel inträffade vid hämtning av kurser.</li>';
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    document.getElementById('courses').innerHTML =
      '<li>Ett fel inträffade vid hämtning av kurser.</li>';
  }
};

// Funktion för att rendera kurserna
const renderCourses = (courses) => {
  const coursesList = document.getElementById('courses');
  // Rensa listan innan vi lägger till nya kurser
  coursesList.innerHTML = '';

  // Om courses är en array, kör förEach på den
  if (Array.isArray(courses)) {
    courses.forEach((course) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <h2>${course.title}</h2>
        <p>${course.description}</p>
        <p>Duration: ${course.duration} timmar</p>
        <img src="${course.imageUrl}" alt="${course.title}" width="150">
        <a href="details.html?id=${course.id}">View Details</a>
      `;
      coursesList.appendChild(li);
    });
  } else {
    console.error('Förväntade oss en array av kurser, men fick något annat.');
  }
};

// Ladda kurserna när sidan laddas
document.addEventListener('DOMContentLoaded', fetchCourses);
