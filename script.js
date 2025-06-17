// Stats
let energy = 0;
let power = 0;
let enemyHP = 10;
let kills = 0;

// DOM refs
const energyDisplay = document.getElementById("energyAmount");
const powerDisplay = document.getElementById("powerAmount");
const enemyHPDisplay = document.getElementById("enemyHP");
const killsDisplay = document.getElementById("kills");

// Energy gain over time
setInterval(() => {
  energy += 1;
  updateUI();
}, 1000);

// Spend energy to gain power
function spendEnergy() {
  if (energy >= 10) {
    energy -= 10;
    power += 1;
    updateUI();
  }
}

// Attack the enemy
function attackEnemy() {
  if (enemyHP > 0) {
    enemyHP -= power > 0 ? power : 1;
    if (enemyHP <= 0) {
      enemyHP = 10;
      kills += 1;
    }
    updateUI();
  }
}

// Tab switching
function showTab(name) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.add('hidden');
  });
  document.getElementById(name).classList.remove('hidden');
}

// Save game
function saveGame() {
  const save = {
    energy,
    power,
    enemyHP,
    kills,
    lastSave: Date.now()
  };
  localStorage.setItem("nguIdleSave", JSON.stringify(save));
  alert("Game saved!");
}

// Load game
function loadGame() {
  const save = localStorage.getItem("nguIdleSave");
  if (save) {
    const data = JSON.parse(save);
    const now = Date.now();
    const offlineTime = Math.floor((now - data.lastSave) / 1000);

    energy = data.energy + offlineTime; // simulate idle progress
    power = data.power;
    enemyHP = data.enemyHP;
    kills = data.kills;

    updateUI();
    alert(`Loaded! You were away for ${offlineTime}s and gained ${offlineTime} energy.`);
  } else {
    alert("No save found!");
  }
}

// UI updates
function updateUI() {
  energyDisplay.textContent = energy;
  powerDisplay.textContent = power;
  enemyHPDisplay.textContent = enemyHP;
  killsDisplay.textContent = kills;
}
