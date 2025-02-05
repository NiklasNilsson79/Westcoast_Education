export const BASE_URL = 'http://localhost:3001';

// Generisk fetch-funktion för att hantera alla API-anrop
const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

// Kursrelaterade funktioner
export const fetchCourses = async () => fetchData(`${BASE_URL}/courses`);
export const fetchCourseDetails = async (courseId) =>
  fetchData(`${BASE_URL}/courses/${courseId}`);
export const fetchAllCourses = async () => fetchData(`${BASE_URL}/courses`);

export const addCourse = async (course) =>
  fetchData(`${BASE_URL}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course),
  });

export const deleteCourse = async (id) =>
  fetchData(`${BASE_URL}/courses/${id}`, { method: 'DELETE' });

export const updateCourse = async (id, updatedCourse) =>
  fetchData(`${BASE_URL}/courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedCourse),
  });

// Användarrelaterade funktioner
export const fetchUser = async (userId) =>
  fetchData(`${BASE_URL}/users/${userId}`);
export const fetchUserData = async (userId) =>
  fetchData(`${BASE_URL}/users/${userId}`);

export const fetchUserByCredentials = async (email, password) => {
  const users = await fetchData(
    `${BASE_URL}/users?email=${email}&password=${password}`
  );
  return users ? users[0] : null;
};

export const addUser = async (user) =>
  fetchData(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

export const updateUser = async (userId, updatedUser) =>
  fetchData(`${BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedUser),
  });

export const updateUserBooking = async (userId, updatedUser) =>
  fetchData(`${BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedUser),
  });

// Hjälpfunktion för att generera nästa ID
export const getNextId = async () => {
  const courses = await fetchCourses();
  if (!Array.isArray(courses)) return null;
  const maxId = courses.reduce(
    (max, course) => Math.max(max, parseInt(course.id)),
    0
  );
  return String(maxId + 1);
};
