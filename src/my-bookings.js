// Hämta den inloggade användarens ID från localStorage
const loggedInUserId = localStorage.getItem('loggedInUserId');

if (!loggedInUserId) {
  alert('Du är inte inloggad. Logga in för att se dina bokningar.');
  window.location.href = '/log-in.html'; // Omdirigera till inloggningssidan
}

// Funktion för att hämta och visa bokade kurser
const fetchAndDisplayBookedCourses = async () => {
  try {
    // Hämta användaren från JSON-servern
    const userResponse = await fetch(
      `http://localhost:3001/users/${loggedInUserId}`
    );
    const user = await userResponse.json();

    if (!user || !user.bookings) {
      alert('Inga bokade kurser hittades.');
      return;
    }

    // Hämta alla kurser från JSON-servern
    const coursesResponse = await fetch('http://localhost:3001/courses');
    const allCourses = await coursesResponse.json();

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
  } catch (error) {
    console.error('Ett fel inträffade:', error);
    alert('Ett fel inträffade vid hämtning av bokade kurser.');
  }
};

// Hämta och visa bokade kurser när sidan laddas
document.addEventListener('DOMContentLoaded', fetchAndDisplayBookedCourses);

// Funktion för att avboka en kurs
const cancelBooking = async (courseId) => {
  const loggedInUserId = localStorage.getItem('loggedInUserId');

  if (!loggedInUserId) {
    alert('Du är inte inloggad. Logga in för att avboka kurser.');
    return;
  }

  try {
    // Hämta användaren från JSON-servern
    const userResponse = await fetch(
      `http://localhost:3001/users/${loggedInUserId}`
    );
    const user = await userResponse.json();

    if (!user || !user.bookings) {
      alert('Inga bokade kurser hittades.');
      return;
    }

    // Ta bort kursens ID från användarens bokningar
    user.bookings = user.bookings.filter((id) => id !== courseId);

    // Uppdatera användaren på JSON-servern
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
      // Uppdatera sidan för att visa de uppdaterade bokningarna
      window.location.reload();
    } else {
      alert('Något gick fel vid avbokningen. Försök igen.');
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
