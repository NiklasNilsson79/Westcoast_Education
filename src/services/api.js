export const BASE_URL = 'http://localhost:3001';

export const fetchCourses = async () => {
  try {
    const response = await fetch(`${BASE_URL}/courses`);
    if (!response.ok) throw new Error('Kunde inte hämta kurser.');
    return await response.json();
  } catch (error) {
    console.error('Fel vid hämtning av kurser:', error);
    return null;
  }
};

export const addCourse = async (course) => {
  try {
    const response = await fetch(`${BASE_URL}/courses`, {
      // Lägg till /courses här
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });
    if (!response.ok) throw new Error('Kunde inte lägga till kurs.');
    return await response.json();
  } catch (error) {
    console.error('Fel vid tillägg av kurs:', error);
    return null;
  }
};

export const deleteCourse = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/courses/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Kunde inte ta bort kurs.');
    return true;
  } catch (error) {
    console.error('Fel vid borttagning av kurs:', error);
    return false;
  }
};

export const updateCourse = async (id, updatedCourse) => {
  try {
    const response = await fetch(`${BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCourse),
    });
    if (!response.ok) throw new Error('Kunde inte uppdatera kurs.');
    return await response.json();
  } catch (error) {
    console.error('Fel vid uppdatering av kurs:', error);
    return null;
  }
};

export const getNextId = async () => {
  try {
    const courses = await fetchCourses();
    if (!Array.isArray(courses)) throw new Error('Fel vid hämtning av kurser.');
    const maxId = courses.reduce(
      (max, course) => Math.max(max, parseInt(course.id)),
      0
    );
    return String(maxId + 1);
  } catch (error) {
    console.error('Fel vid generering av nästa ID:', error);
    return null;
  }
};

// index

export const fetchUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    if (!response.ok) throw new Error('Kunde inte hämta användare.');
    return await response.json();
  } catch (error) {
    console.error('Fel vid hämtning av användare:', error);
    return null;
  }
};

//Details

export const fetchCourseDetails = async (courseId) => {
  try {
    const response = await fetch(`${BASE_URL}/courses/${courseId}`);
    if (!response.ok) throw new Error('Kunde inte hämta kursdetaljer.');
    return await response.json();
  } catch (error) {
    console.error('Fel vid hämtning av kursdetaljer:', error);
    return null;
  }
};

// Uppdatera en användare (t.ex. för att lägga till en bokning)
export const updateUser = async (userId, updatedUser) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    });
    if (!response.ok) throw new Error('Kunde inte uppdatera användare.');
    return await response.json();
  } catch (error) {
    console.error('Fel vid uppdatering av användare:', error);
    return null;
  }
};

// log-in

// Hämta användare baserat på e-post och lösenord
export const fetchUserByCredentials = async (email, password) => {
  try {
    const response = await fetch(
      `${BASE_URL}/users?email=${email}&password=${password}`
    );
    if (!response.ok) throw new Error('Felaktig e-post eller lösenord.');
    const users = await response.json();
    return users[0]; // Returnera den första matchande användaren
  } catch (error) {
    console.error('Fel vid inloggning:', error);
    return null;
  }
};

// Lägg till en ny användare
export const addUser = async (user) => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Kunde inte lägga till användare.');
    return await response.json();
  } catch (error) {
    console.error('Fel vid tillägg av användare:', error);
    return null;
  }
};

// my bookings

// Hämta en specifik användare
export const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    if (!response.ok) throw new Error('Användaren hittades inte.');
    return await response.json();
  } catch (error) {
    console.error('Ett fel inträffade vid hämtning av användardata:', error);
    return null;
  }
};

// Hämta alla kurser
export const fetchAllCourses = async () => {
  try {
    const response = await fetch(`${BASE_URL}/courses`);
    if (!response.ok) throw new Error('Inga kurser hittades.');
    return await response.json();
  } catch (error) {
    console.error('Ett fel inträffade vid hämtning av kurser:', error);
    return null;
  }
};

// Uppdatera en användare (t.ex. för att avboka en kurs)
export const updateUserBooking = async (userId, updatedUser) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    });
    if (!response.ok)
      throw new Error('Något gick fel vid uppdatering av användaren.');
    return await response.json();
  } catch (error) {
    console.error('Ett fel inträffade:', error);
    return null;
  }
};
