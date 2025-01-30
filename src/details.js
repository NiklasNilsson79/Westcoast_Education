// Importera mapData från services.js om du vill använda den
// import { mapData } from './services.js';

// Funktion för att hämta kursens ID från URL-parameter
const getCourseIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
};

// Funktion för att hämta kursdetaljer från servern
const fetchCourseDetails = async () => {
  const courseId = getCourseIdFromUrl(); // Hämta ID från URL
  if (!courseId) {
    alert('Ingen kurs ID angiven.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3001/courses/${courseId}`);
    const data = await response.json();

    if (!data) {
      alert('Kursen hittades inte.');
      return;
    }

    // Nu använder vi direkt displayCourseDetails för att visa kursen
    displayCourseDetails(data);
  } catch (error) {
    console.error('Error fetching course details:', error);
    alert('Ett fel inträffade vid hämtning av kursen.');
  }
};

// Funktion för att visa kursens detaljer på sidan
const displayCourseDetails = (course) => {
  document.getElementById('course-title').textContent = course.title;
  document.getElementById('course-description').textContent =
    course.description;
  document.getElementById(
    'course-duration'
  ).textContent = `Studieperiod ${course.duration} veckor`;

  // Visa kursens bild
  const courseImage = document.createElement('img');
  courseImage.src = course.imageUrl;
  courseImage.alt = course.title;
  document.getElementById('course-image').appendChild(courseImage);
};

// Hämta kursdetaljer när sidan laddas
document.addEventListener('DOMContentLoaded', fetchCourseDetails);
