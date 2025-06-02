// Firebase setup (doit aussi être dans chaque .html concerné)
const db = firebase.firestore();

const users = {
  "louison": "password1",
  "pote": "password2"
};

// LOGIN
if (document.getElementById("login-form")) {
  document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (users[username] && users[username] === password) {
      localStorage.setItem("user", username);

      // Vérifie ou crée user dans Firestore
      const userRef = db.collection("users").doc(username);
      const doc = await userRef.get();
      if (!doc.exists) {
        await userRef.set({ coins: 10, progress: 1 });
      }

      window.location.href = "home.html";
    } else {
      document.getElementById("error-msg").textContent = "Identifiant ou mot de passe incorrect";
    }
  });
}

// HOME
if (document.getElementById("user")) {
  const username = localStorage.getItem("user");
  if (!username) window.location.href = "index.html";
  document.getElementById("user").textContent = username;

  const userRef = db.collection("users").doc(username);
  userRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      document.getElementById("coins").textContent = data.coins;
      if (data.progress >= 2) {
        document.getElementById("level2").disabled = false;
      }
    }
  });

  if (username !== "louison") {
    const adminLink = document.querySelector('a[href="admin.html"]');
    if (adminLink) adminLink.style.display = "none";
  }
}

// NIVEAU 1
if (document.getElementById("timer")) {
  const username = localStorage.getItem("user");
  if (!username) window.location.href = "index.html";

  let seconds = 60;
  const timerDisplay = document.getElementById("timer");
  const message = document.getElementById("message");

  function updateCoinsDisplay() {
    db.collection("users").doc(username).get().then(doc => {
      document.getElementById("coins").textContent = doc.data().coins;
    });
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

  window.buyTime = async function () {
    const userRef = db.collection("users").doc(username);
    const doc = await userRef.get();
    let data = doc.data();
    if (data.coins >= 5) {
      await userRef.update({ coins: data.coins - 5 });
      seconds += 30;
      updateCoinsDisplay();
    } else {
      message.textContent = "Pas assez de coins !";
    }
  };

  window.validateLevel = async function () {
    clearInterval(interval);
    const userRef = db.collection("users").doc(username);
    const doc = await userRef.get();
    const data = doc.data();
    if (data.progress < 2) {
      await userRef.update({ progress: 2 });
    }
    message.textContent = "Niveau validé ! Retour à l'accueil...";
    setTimeout(() => window.location.href = "home.html", 2000);
  };
}

// ADMIN
if (document.getElementById("targetUser")) {
  const username = localStorage.getItem("user");
  if (username !== "louison") window.location.href = "index.html";

  window.addCoinsToUser = async function () {
    const target = document.getElementById("targetUser").value;
    const amount = parseInt(document.getElementById("coinAmount").value);
    const msg = document.getElementById("adminMsg");

    if (!users[target]) {
      msg.textContent = "Utilisateur inconnu.";
      return;
    }

    const userRef = db.collection("users").doc(target);
    const doc = await userRef.get();
    const currentCoins = doc.exists ? doc.data().coins : 0;
    await userRef.set({ coins: currentCoins + amount }, { merge: true });
    msg.textContent = `Ajouté ${amount} coins à ${target}.`;
  };
}

function startLevel(level) {
  window.location.href = `niveau${level}.html`;
}
