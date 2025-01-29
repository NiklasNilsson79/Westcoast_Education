import { createCourseDisplay } from './dom.js';

// Funktion för att hämta kurser från JSON-servern
const fetchCourses = async () => {
  const coursesElement = document.getElementById('courses');
  coursesElement.innerHTML = '<li>Loading...</li>'; // Visa en "laddar" meddelande innan kurserna hämtas

  try {
    const response = await fetch('http://localhost:3001/courses');

    // Kontrollera om svaret är ok (status 200-299)
    if (!response.ok) {
      throw new Error(
        'Något gick fel vid hämtning av kurser: ' + response.statusText
      );
    }

    const data = await response.json();

    // Kontrollera om data är en array
    if (Array.isArray(data)) {
      createCourseDisplay(data);
    } else {
      throw new Error('Data är inte en array.');
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    coursesElement.innerHTML =
      '<li>Ett fel inträffade vid hämtning av kurser.</li>';
  }
};

// Funktion för att hämta nästa lediga ID som sträng
const getNextId = async () => {
  try {
    const response = await fetch('http://localhost:3001/courses');
    const courses = await response.json();

    if (!Array.isArray(courses)) {
      throw new Error('Fel vid hämtning av kurser.');
    }

    // Hitta högsta ID och returnera nästa som sträng
    const maxId = courses.reduce(
      (max, course) => Math.max(max, parseInt(course.id)),
      0
    );
    return String(maxId + 1);
  } catch (error) {
    console.error('Error fetching courses for ID generation:', error);
    return null;
  }
};

// Funktion för att lägga till en ny kurs
const addCourse = async (course) => {
  try {
    const nextId = await getNextId();
    if (!nextId) {
      alert('Kunde inte generera nästa ID.');
      return;
    }

    // Tilldela nästa lediga ID till kursen som en sträng
    const newCourse = {
      id: nextId,
      imageUrl: './images/no-img.jpg',
      ...course,
    };

    const response = await fetch('http://localhost:3001/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourse),
    });

    if (!response.ok) {
      throw new Error('Kunde inte lägga till kurs.');
    }

    const addedCourse = await response.json();
    console.log('Ny kurs tillagd:', addedCourse);
    fetchCourses(); // Uppdatera listan med kurser
  } catch (error) {
    console.error('Error adding course:', error);
    alert('Ett fel inträffade när kursen skulle läggas till.');
  }
};

// Lyssna på formuläret för att lägga till en kurs
document.getElementById('new-course').addEventListener('submit', (event) => {
  event.preventDefault();

  // Hämta värden från formuläret
  const title = event.target.title.value;
  const description = event.target.description.value;
  const duration = parseInt(event.target.duration.value);

  if (title && description && duration) {
    const newCourse = { title, description, duration };
    addCourse(newCourse); // Skicka kursen till servern
    event.target.reset(); // Töm formuläret
  } else {
    alert('Fyll i alla fält korrekt.');
  }
});

// Funktion för att ta bort en kurs
const deleteCourse = async (id) => {
  try {
    const response = await fetch(`http://localhost:3001/courses/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Kunde inte ta bort kurs.');
    }

    console.log(`Kurs med id ${id} har tagits bort.`);
    fetchCourses(); // Uppdatera listan efter borttagning
  } catch (error) {
    console.error('Error deleting course:', error);
    alert('Ett fel inträffade vid borttagning av kurs.');
  }
};

// Lägg till eventlistener på Delete-knappen
document.getElementById('delete').addEventListener('click', () => {
  const id = prompt('Ange ID för kursen du vill ta bort:');
  if (id) {
    deleteCourse(id);
  } else {
    alert('Inget ID angivet.');
  }
});

// Funktion för att uppdatera en kurs
const updateCourse = async (id, updatedCourse) => {
  try {
    // Kontrollera om updatedCourse inte har en bild, sätt den till standardbild
    if (!updatedCourse.imageUrl || updatedCourse.imageUrl.trim() === '') {
      updatedCourse.imageUrl = './images/no-img.jpg'; // Standardbild om ingen bild finns
    }

    const response = await fetch(`http://localhost:3001/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCourse),
    });

    if (!response.ok) {
      throw new Error('Kunde inte uppdatera kurs.');
    }

    const course = await response.json();
    console.log(`Kurs med id ${id} har uppdaterats:`, course);
    fetchCourses(); // Uppdatera listan efter uppdatering
  } catch (error) {
    console.error('Error updating course:', error);
    alert('Ett fel inträffade vid uppdatering av kurs.');
  }
};

// Lägg till eventlistener på Update-knappen
document.getElementById('update').addEventListener('click', () => {
  const id = prompt('Ange ID för kursen du vill uppdatera:');
  if (id) {
    const title = prompt('Ange nytt titelvärde:');
    const description = prompt('Ange ny beskrivning:');
    const duration = prompt('Ange ny varaktighet (timmar):');

    if (title && description && duration) {
      const updatedCourse = {
        title,
        description,
        duration: parseInt(duration),
      };
      updateCourse(id, updatedCourse);
    } else {
      alert('Alla fält måste fyllas i för att uppdatera kursen.');
    }
  } else {
    alert('Inget ID angivet.');
  }
});

// Ladda kurserna när sidan laddas
document.addEventListener('DOMContentLoaded', fetchCourses);
