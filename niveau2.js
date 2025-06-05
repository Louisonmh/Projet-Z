document.addEventListener('DOMContentLoaded', function() {
  const username = getCurrentUser();
  if (!username) window.location.href = "index.html";
  
  let seconds = 60; // Temps initial
  let levelFailed = false;
  let levelCompleted = false;
  const timerDisplay = document.getElementById("timer");
  const message = document.getElementById("message");
  
  // Vérifie si le niveau est déjà raté ou complété
  const levelStatus = getLevelStatus(username, 2);
  if (levelStatus === 'failed' || levelStatus === 'completed') {
    message.textContent = levelStatus === 'failed' 
      ? "Vous avez échoué ce niveau !" 
      : "Niveau déjà complété !";
    message.style.color = "red";
    disableLevelActions();
    return;
  }

  // Affiche les coins
  document.getElementById("coins").textContent = getCoins(username);
  
  // Timer
  const interval = setInterval(() => {
    seconds--;
    timerDisplay.textContent = seconds;
    
    if (seconds <= 0 && !levelCompleted) {
      levelFailed = true;
      clearInterval(interval);
      message.textContent = "Temps écoulé ! Niveau échoué.";
      message.style.color = "red";
      markLevelAsFailed(username, 2);
      setTimeout(() => window.location.href = "home.html", 2000);
    }
  }, 1000);

  // Achat de temps
  window.buyTime = function() {
    if (levelFailed || levelCompleted) return;
    
    const coins = getCoins(username);
    if (coins >= 5) {
      updateCoins(username, -5);
      seconds += 30;
      timerDisplay.textContent = seconds;
      document.getElementById("coins").textContent = getCoins(username);
      message.textContent = "+30 secondes achetées !";
      message.style.color = "green";
    } else {
      message.textContent = "Pas assez de coins !";
      message.style.color = "red";
    }
  };
  
  // Validation du niveau
  window.verifierReponse = function() {
    if (levelFailed || levelCompleted) return;
    
    const reponse = parseInt(document.getElementById("reponse").value);
    
    if (reponse === 6) {
      levelCompleted = true;
      clearInterval(interval);
      markLevelAsCompleted(username, 2);
      updateCoins(username, 3);
      
      message.textContent = "Niveau validé ! +3 coins";
      message.style.color = "green";
      
      setTimeout(() => window.location.href = "home.html", 2000);
    } else {
      message.textContent = "Réponse incorrecte, essayez encore !";
      message.style.color = "red";
    }
  };

  function disableLevelActions() {
    document.getElementById("reponse").disabled = true;
    document.querySelector("button[onclick='verifierReponse()']").disabled = true;
    document.querySelector("button[onclick='buyTime()']").disabled = true;
  }
});
