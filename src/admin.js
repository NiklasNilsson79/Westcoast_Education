const coursesUrl = 'http://localhost:3001/courses';
const usersUrl = 'http://localhost:3001/users';

const fetchCoursesAndBookings = async () => {
  try {
    const [coursesResponse, usersResponse] = await Promise.all([
      fetch(coursesUrl),
      fetch(usersUrl),
    ]);

    if (!coursesResponse.ok || !usersResponse.ok) {
      throw new Error('Fel vid hämtning av data.');
    }

    const courses = await coursesResponse.json();
    const users = await usersResponse.json();

    displayCoursesWithBookings(courses, users);
  } catch (error) {
    console.error('Fel vid hämtning av kurser och bokningar:', error);
  }
};

const displayCoursesWithBookings = (courses, users) => {
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

// Kör funktionen när sidan laddas
document.addEventListener('DOMContentLoaded', fetchCoursesAndBookings);
