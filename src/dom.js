export const createCourseDisplay = (courses) => {
  return courses
    .map(
      (course) => `
      <li>
        <h2>${course.title}</h2>
        <p>${course.description}</p>
        <p>Duration: ${course.duration} hours</p>
        <img src="${course.imageUrl}" alt="${course.title}" width="150">
      </li>
    `
    )
    .join('');
};
