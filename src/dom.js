export function renderCourses(courses) {
  const courseContainer = document.getElementById('course-container');
  courseContainer.innerHTML = courses
    .map(
      (course) => `
      <div class="course">
        <img src="${course.image}" alt="${course.title}">
        <h2>${course.title}</h2>
        <p>Kursnummer: ${course.number}</p>
        <p>Antal dagar: ${course.days}</p>
        <p>Typ: ${course.type}</p>
        <p>Datum: ${course.date}</p>
      </div>
    `
    )
    .join('');
}
