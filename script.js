const users = {
  "louison": "3073",
  "sexyzozo": "090304"
};

const coinsStorageKey = "coins";
const progressStorageKey = "progress";
const currentUserKey = "currentUser";

// Fonctions utilitaires
function getCurrentUser() {
  return localStorage.getItem(currentUserKey);
}

function getCoins(username) {
  const coinsData = JSON.parse(localStorage.getItem(coinsStorageKey)) || {};
  return coinsData[username] || 0;
}

function updateCoins(username, amount) {
  const coinsData = JSON.parse(localStorage.getItem(coinsStorageKey)) || {};
  coinsData[username] = (coinsData[username] || 0) + amount;
  localStorage.setItem(coinsStorageKey, JSON.stringify(coinsData));
  return coinsData[username];
}

function getProgress(username) {
  const progressData = JSON.parse(localStorage.getItem(progressStorageKey)) || {};
  return progressData[username] || 1;
}

function updateProgress(username, level) {
  const progressData = JSON.parse(localStorage.getItem(progressStorageKey)) || {};
  if (level > progressData[username]) {
    progressData[username] = level;
    localStorage.setItem(progressStorageKey, JSON.stringify(progressData));
  }
  return progressData[username];
}

// Gestion de la connexion
if (document.getElementById("login-form")) {
  document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (users[username] && users[username] === password) {
      localStorage.setItem(currentUserKey, username);
      
      // Initialisation si premier connexion
      if (!localStorage.getItem(coinsStorageKey)) {
        updateCoins(username, 10);
      }
      if (!localStorage.getItem(progressStorageKey)) {
        updateProgress(username, 1);
      }
      
      window.location.href = "home.html";
    } else {
      document.getElementById("error-msg").textContent = "Identifiant ou mot de passe incorrect";
    }
  });
}

// Gestion de l'accueil
if (document.getElementById("user")) {
  const username = getCurrentUser();
  if (!username) window.location.href = "index.html";
  
  document.getElementById("user").textContent = username;
  document.getElementById("coins").textContent = getCoins(username);

  // Active les boutons des niveaux débloqués
  const progress = getProgress(username);
  for (let i = 2; i <= 5; i++) {
    const btn = document.getElementById(`level${i}`);
    if (btn) btn.disabled = progress < i;
  }
}

function startLevel(level) {
  window.location.href = `niveau${level}.html`;
}
