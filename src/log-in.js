import { checkUrlParams, loginUser, registerUser } from './services/app.js';

document.addEventListener('DOMContentLoaded', () => {
  checkUrlParams(); // Kontrollera URL-parametrar

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = event.target.email.value;
      const password = event.target.password.value;
      loginUser(email, password);
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = event.target['register-name'].value;
      const email = event.target['register-email'].value;
      const address = event.target['register-address'].value;
      const phone = event.target['register-phone'].value;
      const password = event.target['register-password'].value;
      registerUser(name, email, address, phone, password);
    });
  }
});
