<!-- script.js -->
const users = {
  "louison": "password1",
  "sexyzozo": "password2"
};

const coinsStorageKey = "coins";
const progressStorageKey = "progress";

// Login handler
if (document.getElementById("login-form")) {
  document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (users[username] && users[username] === password) {
      localStorage.setItem("user", username);
      if (!localStorage.getItem(coinsStorageKey)) {
        localStorage.setItem(coinsStorageKey, JSON.stringify({ [username]: 10 }));
      }
      if (!localStorage.getItem(progressStorageKey)) {
        localStorage.setItem(progressStorageKey, JSON.stringify({ [username]: 1 }));
      }
      window.location.href = "home.html";
    } else {
      document.getElementById("error-msg").textContent = "Identifiant ou mot de passe incorrect";
    }
  });
}

// Accueil handler
if (document.getElementById("user")) {
  const username = localStorage.getItem("user");
  if (!username) window.location.href = "index.html";
  document.getElementById("user").textContent = username;

  const coins = JSON.parse(localStorage.getItem(coinsStorageKey))[username];
  document.getElementById("coins").textContent = coins;

  const progress = JSON.parse(localStorage.getItem(progressStorageKey))[username];
  if (progress >= 2) document.getElementById("level2").disabled = false;
}

function startLevel(level) {
  alert("Lancement du niveau " + level + " (à faire)");
  // Rediriger vers niveau1.html etc. à ajouter plus tard
}
