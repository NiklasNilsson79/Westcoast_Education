import {
  BASE_URL,
  fetchUserData,
  fetchAllCourses,
  fetchUserByCredentials,
  addUser,
  fetchCourses,
  addCourse,
  deleteCourse,
  updateCourse,
  getNextId,
  fetchUser,
  fetchCourseDetails,
  updateUser,
} from './api.js';
import {
  createCourseDisplay,
  updateUI,
  displayCourseDetails,
  toggleForms,
  displayError,
  displayUserInfo,
  displayBookedCourses,
} from './dom.js';

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
      const teacher = event.target.teacher.value;
      const courseType = event.target.courseType.value;

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
          teacher,
          courseType,
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
      const teacher = prompt('Ange ny lärare:');
      const courseType = prompt('Ange ny studiestil');
      const duration = prompt('Ange ny varaktighet (veckor):');

      if (title && description && duration) {
        const updatedCourse = {
          title,
          description,
          teacher,
          courseType,
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

// log-in

// Funktion för att logga in en användare
export const loginUser = async (email, password) => {
  try {
    const user = await fetchUserByCredentials(email, password);
    if (user) {
      localStorage.setItem('loggedInUserId', user.id); // Spara användar-ID i localStorage
      window.location.href = 'index.html'; // Omdirigera till startsidan
    } else {
      displayError('Felaktig e-post eller lösenord.');
    }
  } catch (error) {
    console.error('Fel vid inloggning:', error);
    displayError('Ett fel inträffade vid inloggning.');
  }
};

// Funktion för att registrera en användare
export const registerUser = async (name, email, address, phone, password) => {
  if (password.length < 4) {
    displayError('Lösenordet måste vara minst 4 tecken långt.');
    return;
  }

  if (name && email && password) {
    const newUser = { name, email, address, phone, password };
    const addedUser = await addUser(newUser);
    if (addedUser) {
      displayError('Registrering lyckades! Logga in med ditt nya konto.');
      toggleForms(); // Byt till inloggningsformuläret
    }
  } else {
    displayError('Fyll i alla fält korrekt.');
  }
};

// Kontrollera URL-parametrar för att visa rätt formulär
export const checkUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const formType = urlParams.get('form');

  if (formType === 'register') {
    toggleForms(); // Visa registreringsformuläret
  }
};

// My-bookings

// Hämta den inloggade användarens ID från localStorage
export const getLoggedInUserId = () => localStorage.getItem('loggedInUserId');

// Hämta och visa bokade kurser
export const fetchAndDisplayBookedCourses = async () => {
  const loggedInUserId = getLoggedInUserId();
  if (!loggedInUserId) return;

  const user = await fetchUserData(loggedInUserId);
  if (!user || !user.bookings) {
    alert('Inga bokade kurser hittades.');
    return;
  }

  displayUserInfo(user);

  const allCourses = await fetchAllCourses();
  if (!allCourses) return;

  // Filtrera ut de bokade kurserna
  const bookedCourses = allCourses.filter((course) =>
    user.bookings.includes(course.id)
  );

  displayBookedCourses(bookedCourses);
};

// Avboka en kurs
export const cancelBooking = async (courseId) => {
  const loggedInUserId = getLoggedInUserId();
  if (!loggedInUserId) return;

  const user = await fetchUserData(loggedInUserId);
  if (!user || !user.bookings) {
    alert('Inga bokade kurser hittades.');
    return;
  }

  // Bekräftelse innan avbokning
  if (!confirm('Är du säker på att du vill avboka kursen?')) {
    return;
  }

  // Ta bort kursens ID från användarens bokningar
  user.bookings = user.bookings.filter((id) => id !== courseId);

  // Uppdatera användaren på JSON-servern
  const updatedUser = await updateUser(loggedInUserId, user);
  if (updatedUser) {
    alert('Kursen har avbokats.');
    window.location.reload(); // Uppdatera sidan
  } else {
    alert('Något gick fel vid avbokningen.');
  }
};

//Administrationspanelen

// Hämta administrationspanelen
const adminPanel = document.getElementById('admin-panel');

// Funktion för att kontrollera om en specifik användare är inloggad
const checkAdminUser = () => {
  const loggedInUserId = localStorage.getItem('loggedInUserId');

  // Kontrollera om användaren är inloggad och har ett specifikt ID (t.ex. admin)
  if (loggedInUserId === 'admin') {
    // Ersätt 'admin' med det faktiska ID:t för din admin-användare
    adminPanel.classList.add('visible'); // Visa administrationspanelen
  } else {
    adminPanel.classList.remove('visible'); // Dölj administrationspanelen
  }
};

// Kör funktionen när sidan laddas
document.addEventListener('DOMContentLoaded', checkAdminUser);
