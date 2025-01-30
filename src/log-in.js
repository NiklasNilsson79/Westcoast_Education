function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  const user = {
    name: name,
    email: email,
    password: password,
  };

  fetch('http://localhost:3001/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((newUser) => {
      alert('Registrering lyckades! Logga in med ditt nya konto.');
      document.getElementById('register-form').style.display = 'none';
      document.getElementById('login-form').style.display = 'block';
    });
}

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
