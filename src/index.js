document.addEventListener('DOMContentLoaded', function () {
  const userInfoElement = document.getElementById('user-info');
  const userId = localStorage.getItem('loggedInUserId');

  if (!userId) {
    userInfoElement.textContent = 'Inget konto inloggat';
    return;
  }

  // Hämta användarinformation från JSON-servern
  fetch(`http://localhost:3001/users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      if (user) {
        userInfoElement.textContent = `Inloggad som: ${user.name}`;
      } else {
        userInfoElement.textContent = 'Inget konto inloggat';
      }
    })
    .catch((error) => {
      console.error('Fel vid hämtning av användare:', error);
      userInfoElement.textContent = 'Inget konto inloggat';
    });
});

document.getElementById('logout-btn').addEventListener('click', function () {
  localStorage.removeItem('loggedInUserId'); // Ta bort sparade användaruppgifter
  window.location.href = 'log-in.html'; // Skicka användaren till inloggningssidan
});
