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

    // Visa ett meddelande om att registreringen var lyckad
    alert('Registrering lyckades! Logga in med ditt nya konto.');

    // Byt till login-formuläret
    toggleForms();
  } catch (error) {
    console.error('Error adding user:', error);
    alert('Ett fel inträffade när användaren skulle läggas till.');
  }
};

// Lyssna på formuläret för att lägga till en användare
document.getElementById('register-form').addEventListener('submit', (event) => {
  event.preventDefault();

  // Hämta värden från formuläret
  const name = event.target['register-name'].value;
  const email = event.target['register-email'].value;
  const password = event.target['register-password'].value;

  // Kontrollera att lösenordet är minst 4 tecken långt
  if (password.length < 4) {
    alert('Lösenordet måste vara minst 4 tecken långt.');
    return; // Avbryt registreringen om lösenordet är för kort
  }

  if (name && email && password) {
    const newUser = { name, email, password };
    addUser(newUser); // Skicka användaren till servern
    event.target.reset(); // Töm formuläret
  } else {
    alert('Fyll i alla fält korrekt.');
  }
});

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

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('login-form').addEventListener('submit', loginUser);
});

function loginUser(event) {
  event.preventDefault(); // Förhindra att formuläret skickas normalt

  // Hämta input-fälten med rätt ID
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  // Säkerhetskoll så att elementen finns
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
