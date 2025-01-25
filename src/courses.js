import { createCourseDisplay } from './dom.js';

const list = document.querySelector('#courses');
const form = document.querySelector('#new-course');
const deleteBtn = document.querySelector('#delete');
const updateBtn = document.querySelector('#update');

const initApp = () => {
  loadCourses();
};

const loadCourses = async () => {
  const url = 'http://localhost:3001/courses';
  const response = await fetch(url);

  if (response.ok) {
    const courses = await response.json();
    displayCourses(courses);
  } else {
    console.error('Failed to load courses');
  }
};

const displayCourses = (courses) => {
  list.innerHTML = '';
  list.insertAdjacentHTML('beforeend', createCourseDisplay(courses));
};

const handleSaveCourse = async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  data.append('imageUrl', 'default-course.jpg'); // Placeholder-bild
  const body = Object.fromEntries(data);

  try {
    const response = await fetch('http://localhost:3001/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(await response.json());
    await loadCourses();
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteCourse = async (e) => {
  e.preventDefault();

  const courseId = prompt('Enter Course ID to delete:'); // Förenklad input för demo
  const url = `http://localhost:3001/courses/${courseId}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    await loadCourses();
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

const handleUpdateCourse = async (e) => {
  e.preventDefault();

  const courseId = prompt('Enter Course ID to update:'); // Förenklad input för demo
  const url = `http://localhost:3001/courses/${courseId}`;

  const course = {
    title: 'Updated Course Title',
    description: 'Updated Description',
    duration: 20,
    imageUrl: 'updated-course.jpg',
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course),
    });

    await loadCourses();
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleSaveCourse);
deleteBtn.addEventListener('click', handleDeleteCourse);
updateBtn.addEventListener('click', handleUpdateCourse);
