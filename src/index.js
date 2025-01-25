import { fetchCourses } from './api.js';
import { renderCourses } from './dom.js';

// Hämta och rendera kurser
fetchCourses().then((courses) => renderCourses(courses));
