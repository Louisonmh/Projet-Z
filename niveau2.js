document.addEventListener('DOMContentLoaded', function() {
  const username = getCurrentUser();
  if (!username) window.location.href = "index.html";
  
  let seconds = 180;
  const timerDisplay = document.getElementById("timer");
  const message = document.getElementById("message");
  
  // Affiche les coins
  document.getElementById("coins").textContent = getCoins(username);
  
  // Timer
const interval = setInterval(() => {
  seconds--;
  timerDisplay.textContent = seconds;
  
  if (seconds <= 0) {
    clearInterval(interval);
    message.textContent = "Temps écoulé ! Retour à l'accueil...";
    // Empêcher de rejouer le niveau en mettant à jour la progression
    updateProgress(username, 2); // On reste au niveau 2 (non complété)
    setTimeout(() => window.location.href = "home.html", 2000);
  }
}, 1000);
  
  // Achat de temps
  window.buyTime = function() {
    const coins = getCoins(username);
    if (coins >= 5) {
      updateCoins(username, -5);
      seconds += 30;
      document.getElementById("coins").textContent = getCoins(username);
    } else {
      message.textContent = "Pas assez de coins !";
    }
  };
  
  // Validation du niveau
  window.validateLevel = function() {
    clearInterval(interval);
    updateProgress(username, 3);
    updateCoins(username, 3);
    
    message.textContent = "Niveau validé ! +3 coins";
    setTimeout(() => window.location.href = "home.html", 2000);
  };

  window.verifierReponse = function() {
  const reponse = parseInt(document.getElementById("reponse").value);
  const progress = getProgress(username);
  
  // Vérifie si le niveau est déjà complété
  if (progress > 2) {
    message.textContent = "Vous avez déjà complété ce niveau !";
    message.style.color = "orange";
    return;
  }
  
  if (reponse === 6) {
    clearInterval(interval);
    // Marque le niveau comme complété (niveau suivant = 3)
    updateProgress(username, 3);
    updateCoins(username, 3);
    
    message.textContent = "Niveau validé ! +3 coins";
    message.style.color = "green";
    
    setTimeout(() => window.location.href = "home.html", 2000);
  } else {
    message.textContent = "Réponse incorrecte, essayez encore !";
    message.style.color = "red";
  }
};
});
