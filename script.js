// utilisateurs connus et leurs mots de passe
const users = {
  "louison": "3073",
  "sexyzozo": "09032004"
};

// Firestore reference (doit être initialisé dans HTML)
const db = firebase.firestore();

// Récupérer les données d'un utilisateur (coins, progression)
async function getUserData(username) {
  const doc = await db.collection("users").doc(username).get();
  if (!doc.exists) {
    // Création initiale des données si absent
    await db.collection("users").doc(username).set({
      coins: 10,
      progress: 1,
    });
    return { coins: 10, progress: 1 };
  }
  return doc.data();
}

// Mettre à jour des données utilisateur
async function updateUserData(username, data) {
  await db.collection("users").doc(username).update(data);
}

// --- Login handler ---
if (document.getElementById("login-form")) {
  document.getElementById("login-form").addEventListener("submit", async function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (users[username] && users[username] === password) {
      await getUserData(username); // créer ou récupérer les données Firestore
      localStorage.setItem("user", username); // garder le user en session
      window.location.href = "home.html";
    } else {
      document.getElementById("error-msg").textContent = "Identifiant ou mot de passe incorrect";
    }
  });
}

// --- Page d'accueil ---
if (document.getElementById("user")) {
  const username = localStorage.getItem("user");
  if (!username) window.location.href = "index.html";

  document.getElementById("user").textContent = username;

  getUserData(username).then(data => {
    document.getElementById("coins").textContent = data.coins;
    if (data.progress >= 2) {
      document.getElementById("level2").disabled = false;
    }
  });
}

// --- Niveau 1 ---
if (document.getElementById("timer")) {
  const username = localStorage.getItem("user");
  if (!username) window.location.href = "index.html";

  let seconds = 60;
  const timerDisplay = document.getElementById("timer");
  const message = document.getElementById("message");

  async function updateCoinsDisplay() {
    const data = await getUserData(username);
    document.getElementById("coins").textContent = data.coins;
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

  window.buyTime = async function() {
    const data = await getUserData(username);
    if (data.coins >= 5) {
      await updateUserData(username, { coins: data.coins - 5 });
      seconds += 30;
      updateCoinsDisplay();
    } else {
      message.textContent = "Pas assez de coins !";
    }
  };

  window.validateLevel = async function() {
    clearInterval(interval);
    const data = await getUserData(username);
    if (data.progress < 2) {
      await updateUserData(username, { progress: 2 });
    }
    message.textContent = "Niveau validé ! Retour à l'accueil...";
    setTimeout(() => window.location.href = "home.html", 2000);
  };
}

// --- Admin page ---
if (document.getElementById("targetUser")) {
  const adminUser = localStorage.getItem("user");
  if (adminUser !== "louison") {
    alert("Accès interdit : réservé à Louison");
    window.location.href = "home.html";
  }

  window.addCoinsToUser = async function() {
    const target = document.getElementById("targetUser").value;
    const amount = parseInt(document.getElementById("coinAmount").value);
    const msg = document.getElementById("adminMsg");

    if (!users[target]) {
      msg.textContent = "Utilisateur inconnu.";
      return;
    }

    const data = await getUserData(target);
    await updateUserData(target, { coins: data.coins + amount });
    msg.textContent = `Ajouté ${amount} coins à ${target}.`;
  }
}

function startLevel(level) {
  window.location.href = `niveau${level}.html`;
}
