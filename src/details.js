// Hämta kurs-ID från URL:en
const params = new URLSearchParams(window.location.search);
const courseId = params.get('id');

// Element på sidan
const courseTitle = document.getElementById('course-title');
const courseDescription = document.getElementById('course-description');
const courseDuration = document.getElementById('course-duration');

// Funktion för att hämta kursdetaljer från JSON-servern
const fetchCourseDetails = async (id) => {
  try {
    const response = await fetch(`http://localhost:3001/courses/${id}`);
    if (!response.ok) throw new Error('Kursen kunde inte laddas.');
    const course = await response.json();
    renderCourseDetails(course);
  } catch (error) {
    courseTitle.textContent = 'Ett fel inträffade.';
    console.error('Error fetching course details:', error);
  }
};

// Funktion för att rendera kursdetaljer
const renderCourseDetails = (course) => {
  courseTitle.textContent = course.title;
  courseDescription.textContent = `Beskrivning: ${course.description}`;
  courseDuration.textContent = `Varaktighet: ${course.duration} timmar`;
};

// Hämta och visa kursdetaljer vid sidladdning
document.addEventListener('DOMContentLoaded', () => {
  if (courseId) {
    fetchCourseDetails(courseId);
  } else {
    courseTitle.textContent = 'Ingen kurs hittades.';
  }
});
