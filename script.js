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
// Dans la partie "Gestion de l'accueil" de script.js
if (document.getElementById("user")) {
  const username = getCurrentUser();
  if (!username) window.location.href = "index.html";
  
  document.getElementById("user").textContent = username;
  document.getElementById("coins").textContent = getCoins(username);

  const progress = getProgress(username);
  
  // Gestion des boutons de niveau
  for (let i = 1; i <= 5; i++) {
    const btn = document.getElementById(`level${i}`);
    if (btn) {
      const status = getLevelStatus(username, i);
      
      // Applique les classes selon le statut
      btn.classList.remove('completed', 'failed');
      if (status === 'completed') btn.classList.add('completed');
      if (status === 'failed') btn.classList.add('failed');
      
      // Désactive selon la progression et le statut
      btn.disabled = (status === 'failed') || 
                    (i > progress && i > 1) || 
                    (status === 'completed');
    }
  }
}

function startLevel(level) {
  window.location.href = `niveau${level}.html`;
}

// Nouvelle clé de stockage
const levelsStatusKey = "levelsStatus";

// Marquer un niveau comme échoué
function markLevelAsFailed(username, level) {
  const status = JSON.parse(localStorage.getItem(levelsStatusKey)) || {};
  if (!status[username]) status[username] = {};
  status[username][level] = 'failed';
  localStorage.setItem(levelsStatusKey, JSON.stringify(status));
}

// Marquer un niveau comme complété
function markLevelAsCompleted(username, level) {
  const status = JSON.parse(localStorage.getItem(levelsStatusKey)) || {};
  if (!status[username]) status[username] = {};
  status[username][level] = 'completed';
  localStorage.setItem(levelsStatusKey, JSON.stringify(status));
  // Met aussi à jour la progression globale
  updateProgress(username, level + 1);
}

// Obtenir le statut d'un niveau
function getLevelStatus(username, level) {
  const status = JSON.parse(localStorage.getItem(levelsStatusKey)) || {};
  return status[username]?.[level] || 'unattempted';
}
