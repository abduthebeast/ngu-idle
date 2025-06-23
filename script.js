// Helper for scientific notation
function formatNum(n) {
  return n.toExponential(3).replace('+', '').toUpperCase();
}

let stats = {
  energy: 1e0,
  mana: 1e0,
  blood: 0,
  hp: 100,
  atk: 1,
  def: 0,
  gold: 0,
  rebirthTime: 0,
  playerHP: 100,
  enemyHP: 325000000,
  rebirths: 0,
};

function updateStats() {
  document.getElementById("stat-energy").textContent = formatNum(stats.energy);
  document.getElementById("stat-mana").textContent = formatNum(stats.mana);
  document.getElementById("stat-blood").textContent = stats.blood;
  document.getElementById("stat-hp").textContent = stats.hp;
  document.getElementById("stat-atk").textContent = stats.atk;
  document.getElementById("stat-def").textContent = stats.def;
  document.getElementById("stat-gold").textContent = stats.gold;
  document.getElementById("stat-rebirth-time").textContent = stats.rebirthTime.toFixed(1) + "s";
  document.getElementById("player-hp").textContent = stats.playerHP;
  document.getElementById("enemy-hp").textContent = formatNum(stats.enemyHP);
}

function showTab(id) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById("tab-" + id).classList.add('active');
}

function rebirth() {
  if (stats.atk >= 10 || stats.gold >= 1000) {
    stats.rebirths++;
    stats.energy = 1;
    stats.mana = 1;
    stats.blood = 0;
    stats.hp = 100;
    stats.atk = 1;
    stats.def = 0;
    stats.gold = 0;
    stats.playerHP = 100;
    stats.enemyHP = 325000000;
    stats.rebirthTime = 0;
    updateStats();
    alert("You have rebirthed! Total Rebirths: " + stats.rebirths);
  } else {
    alert("Not strong enough to rebirth yet!");
  }
}

function fight() {
  let playerDamage = stats.atk;
  let enemyDamage = 10;

  stats.enemyHP -= playerDamage;
  stats.playerHP -= enemyDamage;

  if (stats.enemyHP <= 0) {
    stats.gold += 100;
    stats.enemyHP = 325000000;
    alert("Victory! You gained 100 gold.");
  }
  if (stats.playerHP <= 0) {
    stats.playerHP = 100;
    stats.gold = Math.max(0, stats.gold - 50);
    alert("You died! Lost 50 gold.");
  }
  updateStats();
}

function nuke() {
  if (stats.energy >= 1e4) {
    stats.energy -= 1e4;
    stats.enemyHP = 0;
    fight();
  } else {
    alert("Not enough Energy to Nuke!");
  }
}

function saveGame() {
  localStorage.setItem("nguSave", JSON.stringify(stats));
  alert("Game Saved!");
}

function loadGame() {
  const save = JSON.parse(localStorage.getItem("nguSave"));
  if (save) {
    stats = { ...stats, ...save };
    updateStats();
    alert("Game Loaded!");
  }
}

setInterval(() => {
  stats.energy *= 1.01;
  stats.mana *= 1.02;
  stats.rebirthTime += 0.1;
  updateStats();
}, 100);

updateStats();
