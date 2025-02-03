// Funktion för att hämta kursens ID från URL-parameter
const getCourseIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id'); // Använd 'id' som parameter
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

    // Visa kursdetaljer
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

// Hämta knappen från DOM:en
const bookButton = document.getElementById('book-button');

// Lägg till en händelselyssnare på knappen
bookButton.addEventListener('click', () => {
  checkIfLoggedIn();
});

const checkIfLoggedIn = () => {
  // Hämta det inloggade användar-ID:t från localStorage
  const loggedInUserId = localStorage.getItem('loggedInUserId');

  if (!loggedInUserId) {
    // Om användaren inte är inloggad
    alert('Du måste logga in för att boka den här kursen.');
    // Omdirigera till inloggningssidan
    window.location.href = '/log-in.html'; // Uppdatera sökvägen om den är annorlunda
  } else {
    // Om användaren är inloggad, bekräfta innan bokning
    if (confirm('Är du säker på att du vill boka den här kursen?')) {
      // Om användaren bekräftar, starta bokningsprocessen
      startBookingProcess(loggedInUserId);
    }
  }
};

const startBookingProcess = async (userId) => {
  // Hämta kursens ID från URL:en
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('id'); // Använd 'id' som parameter
  console.log('Kursens ID från URL:', courseId);

  // Kontrollera att kursens ID finns
  if (!courseId) {
    alert('Kursen kunde inte hittas. Försök igen.');
    return;
  }

  // Hämta användaren från JSON-servern
  const userResponse = await fetch(`http://localhost:3001/users/${userId}`);
  const user = await userResponse.json();

  // Kontrollera att användaren finns
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
  const updateResponse = await fetch(`http://localhost:3001/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (updateResponse.ok) {
    alert('Du har nu bokat kursen!');
    window.location.href = '/my-bookings.html';
  } else {
    alert('Något gick fel vid bokningen. Försök igen.');
  }
};
