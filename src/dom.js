export const createCourseDisplay = (courses) => {
  // Kontrollera att courses är en array
  if (!Array.isArray(courses)) {
    console.error('Expected an array but got:', courses);
    return;
  }

  // Skapa dynamiska element
  const courseList = document.getElementById('courses');
  courseList.innerHTML = ''; // Rensa gamla kurser
  courses.map((course) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h3>${course.title}</h3>
      <p>${course.description}</p>
      <p>${course.duration} veckor</p>
      <img src="${course.imageUrl}" alt="${course.title}">
    `;
    li.addEventListener('click', () => {
      window.location.href = `details.html?id=${course.id}`;
    });
    courseList.appendChild(li);
  });
};

// Funktion som renderar kurser
export function renderCourses(courses) {
  const coursesContainer = document.getElementById('courses-list'); // Exempel på en container för kurser
  coursesContainer.innerHTML = ''; // Rensa tidigare innehåll

  courses.forEach((course) => {
    const courseElement = document.createElement('div');
    courseElement.classList.add('course');
    courseElement.innerHTML = `
      <h3>${course.name}</h3>
      <p>${course.description}</p>
    `;
    coursesContainer.appendChild(courseElement);
  });
}
