// dom.js

// Funktion för att skapa och visa kurser i DOM:en
export const createCourseDisplay = (courses) => {
  // Kontrollera att courses är en array
  if (!Array.isArray(courses)) {
    console.error('Expected an array but got:', courses);
    return;
  }

  // Hämta behållaren för kurslistan
  const courseList = document.getElementById('courses');
  if (!courseList) {
    console.error('Element with id "courses" not found.');
    return;
  }

  // Rensa befintligt innehåll
  courseList.innerHTML = '';

  // Skapa och lägg till varje kurs i DOM:en
  courses.forEach((course) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h3>${course.title}</h3>
      <p>${course.description}</p>
      <p>${course.duration} veckor</p>
      <img src="${course.imageUrl}" alt="${course.title}">
    `;

    // Lägg till klickhändelse för att navigera till detaljsidan
    li.addEventListener('click', () => {
      window.location.href = `details.html?id=${course.id}`;
    });

    // Lägg till kursen i listan
    courseList.appendChild(li);
  });
};

// Funktion för att rendera kurser i en annan behållare (om det behövs)
export const renderCourses = (courses) => {
  // Hämta behållaren för kurslistan
  const coursesContainer = document.getElementById('courses-list');
  if (!coursesContainer) {
    console.error('Element with id "courses-list" not found.');
    return;
  }

  // Rensa befintligt innehåll
  coursesContainer.innerHTML = '';

  // Skapa och lägg till varje kurs i DOM:en
  courses.forEach((course) => {
    const courseElement = document.createElement('div');
    courseElement.classList.add('course');
    courseElement.innerHTML = `
      <h3>${course.title}</h3>
      <p>${course.description}</p>
    `;

    // Lägg till kursen i behållaren
    coursesContainer.appendChild(courseElement);
  });
};

// index
export const updateUI = (user) => {
  const userInfoElement = document.getElementById('user-info');
  const loginLogoutButton = document.getElementById('login-btn');

  if (user) {
    // Visa användarens namn och ändra knapptext till "Logga ut"
    userInfoElement.textContent = `Inloggad som: ${user.name}`;
    loginLogoutButton.textContent = 'Logga ut';
    loginLogoutButton.onclick = () => {
      localStorage.removeItem('loggedInUserId'); // Ta bort sparade användaruppgifter
      window.location.href = 'log-in.html'; // Omdirigera till inloggningssidan
    };
  } else {
    // Visa "Inget konto inloggat" och ändra knapptext till "Logga in"
    userInfoElement.textContent = 'Inget konto inloggat';
    loginLogoutButton.textContent = 'Logga in';
    loginLogoutButton.onclick = () => {
      window.location.href = 'log-in.html'; // Omdirigera till inloggningssidan
    };
  }
};

// Details
export const displayCourseDetails = (course) => {
  document.getElementById('course-title').textContent = course.title;
  document.getElementById('course-description').textContent =
    course.description;
  document.getElementById(
    'course-duration'
  ).textContent = `Studieperiod ${course.duration} veckor`;

  const courseImage = document.createElement('img');
  courseImage.src = course.imageUrl;
  courseImage.alt = course.title;
  document.getElementById('course-image').appendChild(courseImage);
};

// dom.js
export const toggleForms = () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm.style.display === 'none') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  }
};

export const displayError = (message) => {
  alert(message); // Eller visa ett felmeddelande i DOM:en
};
