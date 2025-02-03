document.addEventListener('DOMContentLoaded', function () {
  const userInfoElement = document.getElementById('user-info');
  const loginLogoutButton = document.getElementById('login-btn');
  const userId = localStorage.getItem('loggedInUserId');

  // Funktion för att uppdatera användargränssnittet
  const updateUI = (user) => {
    if (user) {
      // Visa användarens namn och ändra knapptext till "Logga ut"
      userInfoElement.textContent = `Inloggad som: ${user.name}`;
      loginLogoutButton.textContent = 'Logga ut';
      loginLogoutButton.onclick = () => {
        localStorage.removeItem('loggedInUserId'); // Ta bort sparade användaruppgifter
        window.location.href = 'log-in.html'; // Omdirigera till inloggningssidan
      };
    } else {
      // Visa "Inget konto inloggat" och ändra knapptext till "Logga in"
      userInfoElement.textContent = 'Inget konto inloggat';
      loginLogoutButton.textContent = 'Logga in';
      loginLogoutButton.onclick = () => {
        window.location.href = 'log-in.html'; // Omdirigera till inloggningssidan
      };
    }
  };

  if (!userId) {
    // Ingen användare är inloggad
    updateUI(null);
  } else {
    // Hämta användarinformation från JSON-servern
    fetch(`http://localhost:3001/users/${userId}`)
      .then((response) => response.json())
      .then((user) => {
        updateUI(user); // Uppdatera gränssnittet med användardata
      })
      .catch((error) => {
        console.error('Fel vid hämtning av användare:', error);
        updateUI(null); // Uppdatera gränssnittet om något går fel
      });
  }
});
