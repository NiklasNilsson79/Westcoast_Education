// Funktion för att visa rätt formulär baserat på URL-parameter
function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const formType = urlParams.get('form');

  if (formType === 'register') {
    toggleForms(); // Visa registreringsformuläret
  }
}

// Kör funktionen när sidan laddas
document.addEventListener('DOMContentLoaded', function () {
  checkUrlParams(); // Kontrollera URL-parametrar
  document.getElementById('login-form').addEventListener('submit', loginUser);
  document
    .getElementById('register-form')
    .addEventListener('submit', (event) => {
      event.preventDefault();
      registerUser(event);
    });
});

// Funktion för att registrera en användare
function registerUser(event) {
  const name = event.target['register-name'].value;
  const email = event.target['register-email'].value;
  const password = event.target['register-password'].value;

  if (password.length < 4) {
    alert('Lösenordet måste vara minst 4 tecken långt.');
    return;
  }

  if (name && email && password) {
    const newUser = { name, email, password };
    addUser(newUser); // Skicka användaren till servern
    event.target.reset(); // Töm formuläret
  } else {
    alert('Fyll i alla fält korrekt.');
  }
}

// Funktion för att lägga till en ny användare
const addUser = async (user) => {
  try {
    const response = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error('Kunde inte lägga till användare.');
    }

    const addedUser = await response.json();
    console.log('Ny användare tillagd:', addedUser);

    alert('Registrering lyckades! Logga in med ditt nya konto.');
    toggleForms(); // Byt till inloggningsformuläret
  } catch (error) {
    console.error('Error adding user:', error);
    alert('Ett fel inträffade när användaren skulle läggas till.');
  }
};

// Funktion för att byta mellan inloggnings- och registreringsformulär
function toggleForms() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm.style.display === 'none') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  }
}

// Funktion för att logga in en användare
function loginUser(event) {
  event.preventDefault();

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  if (!emailInput || !passwordInput) {
    console.error('Kunde inte hitta inmatningsfälten!');
    return;
  }

  const email = emailInput.value;
  const password = passwordInput.value;

  fetch(`http://localhost:3001/users?email=${email}&password=${password}`)
    .then((response) => response.json())
    .then((users) => {
      if (users.length > 0) {
        const user = users[0];
        localStorage.setItem('loggedInUserId', user.id);
        window.location.href = 'index.html'; // Skicka användaren till startsidan
      } else {
        alert('Felaktig e-post eller lösenord');
      }
    })
    .catch((error) => console.error('Fel vid inloggning:', error));
}
