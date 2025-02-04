import {
  BASE_URL,
  fetchCourses,
  addCourse,
  deleteCourse,
  updateCourse,
  getNextId,
  fetchUser,
  fetchCourseDetails,
  updateUser,
} from './api.js';
import { createCourseDisplay, updateUI, displayCourseDetails } from './dom.js';

export const initializeCourses = async () => {
  const coursesElement = document.getElementById('courses');
  coursesElement.innerHTML = '<li>Loading...</li>';

  const courses = await fetchCourses();
  if (Array.isArray(courses)) {
    createCourseDisplay(courses);
    addHoverEffectToImages();
  } else {
    coursesElement.innerHTML = '<li>Det gick inte att hämta kurserna.</li>';
  }
};

const addHoverEffectToImages = () => {
  const courses = document.querySelectorAll('#courses li');
  courses.forEach((course) => {
    const image = course.querySelector('img');
    if (image) {
      course.addEventListener('mouseenter', () => {
        image.style.visibility = 'visible';
        image.style.opacity = '1';
      });
      course.addEventListener('mouseleave', () => {
        image.style.visibility = 'hidden';
        image.style.opacity = '0';
      });
    }
  });
};

export const setupEventListeners = () => {
  document
    .getElementById('new-course')
    .addEventListener('submit', async (event) => {
      event.preventDefault();
      const title = event.target.title.value;
      const description = event.target.description.value;
      const duration = parseInt(event.target.duration.value);

      if (title && description && duration) {
        const nextId = await getNextId();
        if (!nextId) {
          alert('Kunde inte generera nästa ID.');
          return;
        }

        const newCourse = {
          id: nextId,
          imageUrl: './images/no-img.jpg',
          title,
          description,
          duration,
        };

        const addedCourse = await addCourse(newCourse);
        if (addedCourse) {
          event.target.reset();
          initializeCourses();
        }
      } else {
        alert('Fyll i alla fält korrekt.');
      }
    });

  document.getElementById('delete').addEventListener('click', async () => {
    const id = prompt('Ange ID för kursen du vill ta bort:');
    if (id) {
      const success = await deleteCourse(id);
      if (success) initializeCourses();
    } else {
      alert('Inget ID angivet.');
    }
  });

  document.getElementById('update').addEventListener('click', async () => {
    const id = prompt('Ange ID för kursen du vill uppdatera:');
    if (id) {
      const title = prompt('Ange nytt titelvärde:');
      const description = prompt('Ange ny beskrivning:');
      const duration = prompt('Ange ny varaktighet (veckor):');

      if (title && description && duration) {
        const updatedCourse = {
          title,
          description,
          duration: parseInt(duration),
          imageUrl: './images/no-img.jpg',
        };
        const success = await updateCourse(id, updatedCourse);
        if (success) initializeCourses();
      } else {
        alert('Alla fält måste fyllas i för att uppdatera kursen.');
      }
    } else {
      alert('Inget ID angivet.');
    }
  });
};

// index

export const initializeUser = async () => {
  const userId = localStorage.getItem('loggedInUserId');

  if (!userId) {
    // Ingen användare är inloggad
    updateUI(null);
  } else {
    // Hämta användarinformation från servern
    const user = await fetchUser(userId);
    updateUI(user); // Uppdatera gränssnittet med användardata
  }
};

// Details

// Hämta kursens ID från URL-parameter
export const getCourseIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id'); // Använd 'id' som parameter
};

// Hämta och visa kursdetaljer
export const initializeCourseDetails = async () => {
  const courseId = getCourseIdFromUrl(); // Hämta ID från URL
  if (!courseId) {
    alert('Ingen kurs ID angiven.');
    return;
  }

  const course = await fetchCourseDetails(courseId);
  if (course) {
    displayCourseDetails(course);
  } else {
    alert('Kursen hittades inte.');
  }
};

// Kontrollera om användaren är inloggad
export const checkIfLoggedIn = () => {
  const loggedInUserId = localStorage.getItem('loggedInUserId');

  if (!loggedInUserId) {
    alert('Du måste logga in för att boka den här kursen.');
    window.location.href = '/log-in.html'; // Omdirigera till inloggningssidan
    return false;
  }
  return true;
};

// Starta bokningsprocessen
export const startBookingProcess = async (userId, courseId) => {
  // Hämta användaren från JSON-servern
  const userResponse = await fetch(`${BASE_URL}/users/${userId}`);
  const user = await userResponse.json();

  if (!user) {
    alert('Användaren kunde inte hittas.');
    return;
  }

  // Lägg till kursen i användarens bokningar
  if (!user.bookings) {
    user.bookings = []; // Skapa en tom array om den inte finns
  }
  user.bookings.push(courseId); // Lägg till kursens ID i arrayen

  // Uppdatera användaren på JSON-servern
  const updatedUser = await updateUser(userId, user);
  if (updatedUser) {
    alert('Du har nu bokat kursen!');
    window.location.href = '/my-bookings.html';
  } else {
    alert('Något gick fel vid bokningen. Försök igen.');
  }
};
