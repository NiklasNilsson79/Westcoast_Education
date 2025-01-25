const BASE_URL = 'http://localhost:3001/courses';

export async function fetchCourses() {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error('Kunde inte hämta kurser');
  }
  return response.json();
}
