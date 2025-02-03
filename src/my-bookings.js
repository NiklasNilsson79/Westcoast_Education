// Hämta den inloggade användarens ID från localStorage
const loggedInUserId = localStorage.getItem('loggedInUserId');

if (!loggedInUserId) {
  alert('Du är inte inloggad. Logga in för att se dina bokningar.');
  window.location.href = '/log-in.html'; // Omdirigera till inloggningssidan
}

// Gemensam funktion för att hämta användardata från JSON-servern
const fetchUserData = async () => {
  try {
    const response = await fetch(
      `http://localhost:3001/users/${loggedInUserId}`
    );
    const user = await response.json();

    if (!user) {
      throw new Error('Användaren hittades inte.');
    }

    return user;
  } catch (error) {
    console.error('Ett fel inträffade vid hämtning av användardata:', error);
    alert('Ett fel inträffade vid hämtning av användardata.');
    return null;
  }
};

// Gemensam funktion för att hämta alla kurser från JSON-servern
const fetchAllCourses = async () => {
  try {
    const response = await fetch('http://localhost:3001/courses');
    const courses = await response.json();

    if (!courses) {
      throw new Error('Inga kurser hittades.');
    }

    return courses;
  } catch (error) {
    console.error('Ett fel inträffade vid hämtning av kurser:', error);
    alert('Ett fel inträffade vid hämtning av kurser.');
    return null;
  }
};

// Funktion för att hämta och visa bokade kurser
const fetchAndDisplayBookedCourses = async () => {
  const user = await fetchUserData();
  if (!user || !user.bookings) {
    alert('Inga bokade kurser hittades.');
    return;
  }

  // Visa användarens namn och e-postadress
  const userInfoElement = document.getElementById('user-info-2');
  userInfoElement.innerHTML = `
    <p>Elev: <strong>${user.name}</strong></p>
    <p>E-post: <strong>${user.email}</strong></p>
  `;

  const allCourses = await fetchAllCourses();
  if (!allCourses) {
    return;
  }

  // Filtrera ut de bokade kurserna
  const bookedCourses = allCourses.filter((course) =>
    user.bookings.includes(course.id)
  );

  // Visa de bokade kurserna på sidan
  const bookedCoursesContainer = document.getElementById('booked-courses');
  bookedCoursesContainer.innerHTML = bookedCourses
    .map(
      (course) => `
        <div class="course-card">
            <h2>${course.title}</h2>
            <p><strong>Studieperiod:</strong> ${course.duration} veckor</p>
            <button class="cancel-booking" data-course-id="${course.id}">Avboka</button>
        </div>
    `
    )
    .join('');
};

// Funktion för att avboka en kurs
const cancelBooking = async (courseId) => {
  const user = await fetchUserData();
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
  try {
    const updateResponse = await fetch(
      `http://localhost:3001/users/${loggedInUserId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }
    );

    if (updateResponse.ok) {
      alert('Kursen har avbokats.');
      window.location.reload(); // Uppdatera sidan
    } else {
      throw new Error('Något gick fel vid uppdatering av användaren.');
    }
  } catch (error) {
    console.error('Ett fel inträffade:', error);
    alert('Ett fel inträffade vid avbokningen.');
  }
};

// Lägg till händelselyssnare för "Avboka"-knapparna
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('cancel-booking')) {
    const courseId = event.target.getAttribute('data-course-id');
    cancelBooking(courseId);
  }
});

// Hämta och visa bokade kurser när sidan laddas
document.addEventListener('DOMContentLoaded', fetchAndDisplayBookedCourses);
