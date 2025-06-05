document.addEventListener('DOMContentLoaded', function() {
  const username = getCurrentUser();
  if (!username) window.location.href = "index.html";
  
  let seconds = 60;
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
      message.textContent = "Temps écoulé !";
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
});
