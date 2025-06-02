<!-- script.js -->
const users = {
  "louison": "062455",
  "sexyzozo": "090304"
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

// Niveau 1 handler
if (document.getElementById("timer")) {
  const username = localStorage.getItem("user");
  if (!username) window.location.href = "index.html";
  let seconds = 60;
  const timerDisplay = document.getElementById("timer");
  const message = document.getElementById("message");

  function updateCoinsDisplay() {
    const coins = JSON.parse(localStorage.getItem(coinsStorageKey))[username];
    document.getElementById("coins").textContent = coins;
  }

  updateCoinsDisplay();

  const interval = setInterval(() => {
    seconds--;
    timerDisplay.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(interval);
      message.textContent = "Temps écoulé !";
    }
  }, 1000);

  window.buyTime = function() {
    const coinsData = JSON.parse(localStorage.getItem(coinsStorageKey));
    if (coinsData[username] >= 5) {
      coinsData[username] -= 5;
      seconds += 30;
      localStorage.setItem(coinsStorageKey, JSON.stringify(coinsData));
      updateCoinsDisplay();
    } else {
      message.textContent = "Pas assez de coins !";
    }
  };

  window.validateLevel = function() {
    clearInterval(interval);
    const progressData = JSON.parse(localStorage.getItem(progressStorageKey));
    if (progressData[username] < 2) {
      progressData[username] = 2;
      localStorage.setItem(progressStorageKey, JSON.stringify(progressData));
    }
    message.textContent = "Niveau validé ! Retour à l'accueil...";
    setTimeout(() => window.location.href = "home.html", 2000);
  };
}

function startLevel(level) {
  window.location.href = `niveau${level}.html`;
}
