<!-- script.js -->
const users = {
  "louison": "3073",
  "sexyzozo": "090304"
};

const coinsStorageKey = "coins";
const progressStorageKey = "progress";
const failedLevelsKey = "failedLevels";

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
  const level1Button = document.getElementById("level1");
  const level2Button = document.getElementById("level2");
  const level3Button = document.getElementById("level3");
  if (progress >= 2) {
    level2Button.disabled = false;
    level1Button.disabled = true; // désactiver le niveau 1
    level1Button.textContent = "Niveau 1 (déjà terminé)";
  }
  if (progress >= 3) {
    level3Button.disabled = false;
    level2Button.disabled = true;
    level1Button.disabled = true; // désactiver le niveau 1
    level2Button.textContent = "Niveau 1 (déjà terminé)";
    level1Button.textContent = "Niveau 1 (déjà terminé)";
  }

  const failedData = JSON.parse(localStorage.getItem(failedLevelsKey)) || {};

if (failedData[username]?.includes(1)) {
  const level1Btn = document.getElementById("level1");
  level1Btn.disabled = true;
  level1Btn.textContent = "Niveau 1 (échoué)";
}
if (failedData[username]?.includes(2)) {
  const level2Btn = document.getElementById("level2");
  level2Btn.disabled = true;
  level2Btn.textContent = "Niveau 2 (échoué)";
}


}

// Niveau 1 handler
if (document.getElementById("timer")) {
  const username = localStorage.getItem("user");
  if (!username) window.location.href = "index.html";
  let seconds = 180;
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
      message.textContent = "Temps écoulé ! Niveau échoué.";

      const failedData = JSON.parse(localStorage.getItem(failedLevelsKey)) || {};
      if (!failedData[username]) failedData[username] = [];
      if (!failedData[username].includes(1)) {
        failedData[username].push(1);
        localStorage.setItem(failedLevelsKey, JSON.stringify(failedData));
      }

      setTimeout(() => window.location.href = "home.html", 2000);
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
      const coinsData = JSON.parse(localStorage.getItem(coinsStorageKey));
      coinsData[username] += 2;
    }
    message.textContent = "Niveau validé ! Retour à l'accueil...";
    setTimeout(() => window.location.href = "home.html", 2000);
  };
}

// Niveau 2 handler
if (document.title === "Niveau 2") {
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
      message.textContent = "Temps écoulé ! Niveau échoué.";

      const failedData = JSON.parse(localStorage.getItem(failedLevelsKey)) || {};
      if (!failedData[username]) failedData[username] = [];
      if (!failedData[username].includes(2)) {
        failedData[username].push(2);
        localStorage.setItem(failedLevelsKey, JSON.stringify(failedData));
      }

      setTimeout(() => window.location.href = "home.html", 2000);
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

  window.validateLevel2 = function() {
    clearInterval(interval);
    const progressData = JSON.parse(localStorage.getItem(progressStorageKey));
    progressData[username] = 3;
    const coinsData = JSON.parse(localStorage.getItem(coinsStorageKey));
    coinsData[username] += 2;
    localStorage.setItem(progressStorageKey, JSON.stringify(progressData));
    message.textContent = "Niveau 2 validé ! Retour à l'accueil...";
    setTimeout(() => window.location.href = "home.html", 2000);
  };
}


// Admin handler
if (document.getElementById("targetUser")) {
  window.addCoinsToUser = function() {
    const target = document.getElementById("targetUser").value;
    const amount = parseInt(document.getElementById("coinAmount").value);
    const msg = document.getElementById("adminMsg");

    if (!users[target]) {
      msg.textContent = "Utilisateur inconnu.";
      return;
    }

    const coinsData = JSON.parse(localStorage.getItem(coinsStorageKey)) || {};
    coinsData[target] = (coinsData[target] || 0) + amount;
    localStorage.setItem(coinsStorageKey, JSON.stringify(coinsData));
    msg.textContent = `Ajouté ${amount} coins à ${target}.`;
  }
}

function startLevel(level) {
  window.location.href = `niveau${level}.html`;
}
