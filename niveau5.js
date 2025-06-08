document.addEventListener('DOMContentLoaded', function() {
  const username = localStorage.getItem("user");
  if (!username) window.location.href = "index.html";
  
  let seconds = 360;
  let levelFailed = false;
  let levelCompleted = false;
  const timerDisplay = document.getElementById("timer");
  const message = document.getElementById("message");
  
  // Vérifie si le niveau est déjà raté ou complété
  const levelStatus = getLevelStatus(username, 5);
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
      markLevelAsFailed(username, 5;
      setTimeout(() => window.location.href = "home.html", 2000);
    }
  }, 1000);

  // Achat de temps
  window.buyTime = function() {
    if (levelFailed || levelCompleted) return;
    
    const coins = getCoins(username);
    if (coins >= 5) {
      updateCoins(username, -5);
      seconds += 60;
      timerDisplay.textContent = seconds;
      document.getElementById("coins").textContent = getCoins(username);
      message.textContent = "+60 secondes achetées !";
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
    
    if (reponse === 24) { // Ici on change la réponse pour 24
      levelCompleted = true;
      clearInterval(interval);
      markLevelAsCompleted(username, 6);
      updateCoins(username, 4); // Plus de coins pour niveau plus difficile
      
      message.textContent = "Niveau validé ! +4 coins";
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

  window.validateLevel = function() {
    clearInterval(interval);
    updateProgress(username, 6);
    updateCoins(username, 1);
    
    message.textContent = "Niveau validé ! +1 coins";
    setTimeout(() => window.location.href = "home.html", 2000);
  };
});
