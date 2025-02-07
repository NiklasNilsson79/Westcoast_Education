// Hjälpfunktioner
const getElement = (id) => {
  const element = document.getElementById(id);
  if (!element) console.error(`Element with id "${id}" not found.`);
  return element;
};

const showError = (message) => {
  console.error(message);
  alert(message);
};

const renderList = (containerId, items, createItem) => {
  const container = getElement(containerId);
  if (!container) return;

  container.innerHTML = '';
  items.forEach((item) => {
    const itemElement = createItem(item);
    container.appendChild(itemElement);
  });
};

// Kursrelaterade funktioner
export const createCourseDisplay = (courses) => {
  if (!Array.isArray(courses)) {
    showError('Expected an array but got:', courses);
    return;
  }

  renderList('courses', courses, (course) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h3>${course.title}</h3>
      <p>${course.teacher}</p>
      <p>${course.duration} veckor</p>
      <img src="${course.imageUrl}" alt="${course.title}">
    `;

    li.addEventListener('click', () => {
      window.location.href = `details.html?id=${course.id}`;
    });

    return li;
  });
};

// Användarrelaterade funktioner
export const updateUI = (user) => {
  const userInfoElement = getElement('user-info');
  const loginLogoutButton = getElement('login-btn');

  if (user) {
    userInfoElement.textContent = `Inloggad som: ${user.name}`;
    loginLogoutButton.textContent = 'Logga ut';
    loginLogoutButton.onclick = () => {
      localStorage.removeItem('loggedInUserId');
      window.location.href = 'log-in.html';
    };
  } else {
    userInfoElement.textContent = 'Inget konto inloggat';
    loginLogoutButton.textContent = 'Logga in';
    loginLogoutButton.onclick = () => {
      window.location.href = 'log-in.html';
    };
  }
};

export const displayUserInfo = (user) => {
  const userInfoElement = getElement('user-info-2');
  if (userInfoElement) {
    userInfoElement.innerHTML = `
      <div class="user-card">
        <h2><i class="fas fa-user"></i> Elevinformation</h2>
        <p><i class="fas fa-user-circle"></i> <strong>${user.name}</strong></p>
        <p><i class="fas fa-map-marker-alt"></i> ${user.address}</p>
        <p><i class="fas fa-phone"></i> ${user.phone}</p>
        <p><i class="fas fa-envelope"></i> ${user.email}</p>
      </div>
    `;
  }
};

// Kursdetaljer
export const displayCourseDetails = (course) => {
  const titleElement = getElement('course-title');
  const descriptionElement = getElement('course-description');
  const durationElement = getElement('course-duration');
  const imageContainer = getElement('course-image');
  const courseTypeElement = getElement('course-type');
  const courseStartElement = getElement('course-start');

  if (titleElement && descriptionElement && durationElement && imageContainer) {
    titleElement.textContent = course.title;
    descriptionElement.textContent = course.description;
    durationElement.textContent = `Studieperiod ${course.duration} veckor`;
    courseTypeElement.textContent = `${course.courseType}`;
    courseStartElement.textContent = `Start ${course.courseStart}`;

    const courseImage = document.createElement('img');
    courseImage.src = course.imageUrl;
    courseImage.alt = course.title;
    imageContainer.innerHTML = '';
    imageContainer.appendChild(courseImage);
  }
};

// Inloggning och registrering
export const toggleForms = () => {
  const loginForm = getElement('login-form');
  const registerForm = getElement('register-form');

  if (loginForm && registerForm) {
    loginForm.style.display =
      loginForm.style.display === 'none' ? 'block' : 'none';
    registerForm.style.display =
      registerForm.style.display === 'none' ? 'block' : 'none';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const toggleButtons = document.querySelectorAll('.toggle-button');

  toggleButtons.forEach((button) => {
    button.addEventListener('click', toggleForms);
  });
});

export const displayError = (message) => {
  showError(message);
};

// Mina bokningar
export const displayBookedCourses = (bookedCourses) => {
  renderList('booked-courses', bookedCourses, (course) => {
    const courseCard = document.createElement('div');
    courseCard.classList.add('course-card');
    courseCard.innerHTML = `
      <h2>${course.title}</h2>
      <p><strong>Lärare:</strong> ${course.teacher} </p>
      <p><strong>Startdatum:</strong> ${course.courseStart} </p>
      <button class="cancel-booking" data-course-id="${course.id}">Avboka</button>
    `;
    return courseCard;
  });
};

//Admin-sidan
export const displayCoursesWithBookings = (courses, users) => {
  const coursesList = document.getElementById('courses-list');
  coursesList.innerHTML = ''; // Rensa listan först

  courses.forEach((course) => {
    const courseElement = document.createElement('div');
    courseElement.classList.add('admin-course-card');

    // Hitta vilka elever som är bokade på denna kurs
    const enrolledUsers = users.filter(
      (user) => user.bookings && user.bookings.includes(course.id.toString())
    );

    // Skapa HTML för kursen
    courseElement.innerHTML = `
      <h3>${course.title}</h3>
      <p><strong>Bokade elever:</strong></p>
      <ul class="admin-student-list">
        ${
          enrolledUsers.length > 0
            ? enrolledUsers
                .map((user) => `<li>${user.name} (${user.email})</li>`)
                .join('')
            : '<li>Inga bokade elever</li>'
        }
      </ul>
    `;

    coursesList.appendChild(courseElement);
  });
};
