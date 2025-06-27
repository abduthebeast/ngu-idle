// Helper for scientific notation
function formatNum(n) {
  if (n < 1e3) return Math.floor(n).toString();
  if (n < 1e6) return (n / 1e3).toFixed(2) + "K";
  if (n < 1e9) return (n / 1e6).toFixed(2) + "M";
  if (n < 1e12) return (n / 1e9).toFixed(2) + "B";
  if (n < 1e15) return (n / 1e12).toFixed(2) + "T";
  return n.toExponential(3).replace('+', '').toUpperCase();
}

let bosses = [
  { name: "Ratling", hp: 100, reward: 20, sprite: "Ratling.png" },
  { name: "Sewer Slime", hp: 300, reward: 50, sprite: "Sewer-slime.png" },
  { name: "Toilet Ghost", hp: 1000, reward: 150, sprite: "Toilet-ghost.png" },
  { name: "Plunger Warrior", hp: 5000, reward: 500, sprite: "Plunger-warrior.png" },
  { name: "Mold Titan", hp: 25000, reward: 1500, sprite: "Mold-titan.png" },
  { name: "Sinkhole Horror", hp: 150000, reward: 4500, sprite: "Sinkhole-horror.png" },
  { name: "Giga Hairball", hp: 1000000, reward: 12000, sprite: "Giga-hairball.png" },
  { name: "Cursed Drain Lord", hp: 10000000, reward: 40000, sprite: "Cursed-drain-lord.png" },
  { name: "The Forgotten Flush", hp: 100000000, reward: 150000, sprite: "The-forgotten-flush.png" },
  { name: "Omega Blockage", hp: 1000000000, reward: 500000, sprite: "Omega-blockage.png" },
  { name: "Cosmic Plumber", hp: 10000000000, reward: 2500000, sprite: "Cosmic-plumber.png" }
];

let currentBossIndex = 0;
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
enemyHP: bosses[0].hp,
  rebirths: 0,
};

let inventory = [];
let equipped = {
  weapon: null,
  armor: null
};

function updateStats() {
  document.getElementById("stat-energy").textContent = formatNum(stats.energy);
  document.getElementById("stat-mana").textContent = formatNum(stats.mana);
  document.getElementById("stat-blood").textContent = stats.blood;
  document.getElementById("stat-hp").textContent = stats.hp;
  document.getElementById("stat-atk").textContent = stats.atk;
  document.getElementById("stat-def").textContent = stats.def;
  document.getElementById("stat-gold").textContent = formatNum(stats.gold);
  document.getElementById("stat-rebirth-time").textContent = stats.rebirthTime.toFixed(1) + "s";

  // Update HP bar and text for player
  const hpRatioPlayer = stats.playerHP / stats.hp;
  document.getElementById("player-hp-bar").style.width = `${Math.max(0, Math.min(1, hpRatioPlayer)) * 100}%`;
  document.getElementById("player-hp-text").textContent = `${Math.floor(stats.playerHP)} / ${Math.floor(stats.hp)}`;

  // Update HP bar and text for enemy
  const currentBoss = bosses[currentBossIndex];
  const hpRatioEnemy = stats.enemyHP / currentBoss.hp;
  document.getElementById("enemy-hp-bar").style.width = `${Math.max(0, Math.min(1, hpRatioEnemy)) * 100}%`;
  document.getElementById("enemy-hp-text").textContent = `${formatNum(stats.enemyHP)} / ${formatNum(currentBoss.hp)}`;
}

function showTab(id) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  const active = document.getElementById("tab-" + id);
  if (active) active.classList.add("active");
}

function rebirth() {
  if (stats.atk >= 10 || stats.gold >= 1000) {
    currentBossIndex = 0;
updateBossDisplay();
    stats.rebirths++;
    stats.energy = 1;
    stats.mana = 1;
    stats.blood = 0;
    stats.hp = 100;
    stats.atk = 1;
    stats.def = 0;
    stats.gold = 0;
    stats.playerHP = 100;
    stats.enemyHP = bosses[currentBossIndex].hp;
    stats.rebirthTime = 0;
    inventory = [];
    equipped = { weapon: null, armor: null };
    updateStats();
    renderInventory();
    alert("You have rebirthed! Total Rebirths: " + stats.rebirths);
  } else {
    alert("Not strong enough to rebirth yet!");
  }
}

function loadBoss(index) {
  let boss = bosses[index];
  currentBoss = { ...boss, currentHp: boss.hp };

  // Update boss image
  let img = document.getElementById("bossImage");
  img.src = `images/bosses/${boss.sprite}`;
  img.alt = boss.name;

  // You might already be updating other stuff like name, HP bar, etc.
}

function updateBossDisplay() {
  const boss = bosses[currentBossIndex];
  document.getElementById("enemy-name").textContent = boss.name;

  const fileName = boss.name
    .toLowerCase()
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/[^a-z\-]/g, ''); // remove non-letter characters

  const spritePath = `sprites/${fileName}.png`;
  document.getElementById("enemy-sprite").innerHTML = `<img src="${spritePath}" alt="${boss.name}" style="max-height:100px;">`;
}


function fight() {
  const boss = bosses[currentBossIndex];
  const playerDamage = stats.atk;
  const enemyDamage = Math.max(1, boss.hp / 1000 - stats.def); // scales with boss

  stats.enemyHP -= playerDamage;
  stats.playerHP -= enemyDamage;

  if (stats.enemyHP <= 0) {
    stats.gold += boss.reward;
    logAdventure(`✅ You defeated ${boss.name} and gained ${formatNum(boss.reward)} gold!`);
    stats.playerHP = stats.hp;
    
    // Progress to next boss
    updateBossDisplay();
    if (currentBossIndex < bosses.length - 1) {
      currentBossIndex++;
      stats.enemyHP = bosses[currentBossIndex].hp;
      logAdventure(`⚔️ New boss appears: ${bosses[currentBossIndex].name}`);
    } else {
      stats.enemyHP = boss.hp; // loop final boss
      logAdventure(`💀 ${boss.name} returns stronger than ever!`);
    }updateBossDisplay();
  }
  document.getElementById("enemy-name").textContent = bosses[currentBossIndex].name;
document.getElementById("enemy-sprite").textContent = bosses[currentBossIndex].sprite;

  if (stats.playerHP <= 0) {
    stats.playerHP = stats.hp;
    stats.gold = Math.max(0, stats.gold - 100);
    logAdventure(`❌ You died and lost 100 gold.`);
  }

  updateStats();
}
function nuke() {
  if (stats.energy >= 10000) {
    stats.energy -= 10000;
    stats.enemyHP = 0;
    fight(); // triggers victory & progress
  } else {
    alert("❌ Not enough Energy to Nuke! Requires 10,000.");
  }
}

function tossGold() {
  if (stats.gold >= 100) {
    stats.gold -= 100;
    const outcome = Math.random();
    if (outcome < 0.3) {
      stats.energy += 500;
      logAdventure("The Money Pit gifted you 500 Energy!");
    } else if (outcome < 0.6) {
      stats.mana += 500;
      logAdventure("You gained 500 Magic from the pit!");
    } else {
      stats.atk += 1;
      stats.def += 1;
      logAdventure("The pit empowered your stats!");
    }
    updateStats();
  } else {
    alert("You need at least 100 Gold to toss!");
  }
}

function startAdventure(zone) {
  const enemies = ["Ratling", "Sewer Slime", "Toilet Ghost"];
  const enemy = enemies[Math.floor(Math.random() * enemies.length)];
  const reward = Math.floor(Math.random() * 100) + 50;
  stats.gold += reward;
  logAdventure(`You defeated a ${enemy} and looted ${reward} gold!`);
  dropRandomItem();
  updateStats();
}

function dropRandomItem() {
  const types = ["weapon", "armor"];
  const type = types[Math.floor(Math.random() * types.length)];
  const item = {
    name: type === "weapon" ? "Rusty Sword" : "Cracked Armor",
    type: type,
    atk: type === "weapon" ? 5 : 0,
    def: type === "armor" ? 5 : 0
  };
  inventory.push(item);
  logAdventure(`You found: ${item.name}`);
  renderInventory();
}

function renderInventory() {
  const grid = document.getElementById("inventory-grid");
  grid.innerHTML = "";
  inventory.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "inventory-item";
    div.textContent = item.name;
    div.onclick = () => equipItem(index);
    grid.appendChild(div);
  });
}

function equipItem(index) {
  const item = inventory[index];
  if (!item) return;

  if (equipped[item.type]) {
    stats.atk -= equipped[item.type].atk;
    stats.def -= equipped[item.type].def;
  }

  equipped[item.type] = item;
  stats.atk += item.atk;
  stats.def += item.def;

  logAdventure(`Equipped ${item.name}`);
  updateStats();
}

function logAdventure(text) {
  const log = document.getElementById("adventure-log");
  const entry = document.createElement("p");
  entry.textContent = text;
  log.prepend(entry);
}

function saveGame() {
  localStorage.setItem("nguSave", JSON.stringify({ stats, inventory, equipped }));
  alert("Game Saved!");
}

function loadGame() {
  const save = JSON.parse(localStorage.getItem("nguSave"));
  if (save) {
    Object.assign(stats, save.stats);
    inventory = save.inventory || [];
    equipped = save.equipped || { weapon: null, armor: null };
    updateStats();
    renderInventory();
    alert("Game Loaded!");
  }
}

setInterval(() => {
  stats.energy *= 1.01;
  stats.mana *= 1.02;
  stats.rebirthTime += 0.1;
  updateStats();
}, 100);
function buyAtk1k() {
  if (stats.energy >= 1_000) {
    stats.energy -= 1_000;
    stats.atk += 10;
    updateStats();
    logAdventure("You trained Attack (+10 ATK) using 1,000 Energy!");
  } else {
    alert("Not enough Energy!");
  }
}

function buyAtk3k() {
  if (stats.energy >= 3_000) {
    stats.energy -= 3_000;
    stats.atk += 30;
    updateStats();
    logAdventure("You trained Attack (+30 ATK) using 3,000 Energy!");
  } else {
    alert("Not enough Energy!");
  }
}

function buyAtk5k() {
  if (stats.energy >= 5_000) {
    stats.energy -= 5_000;
    stats.atk += 50;
    updateStats();
    logAdventure("You trained Attack (+50 ATK) using 5,000 Energy!");
  } else {
    alert("Not enough Energy!");
  }
}

function buyAtk10k() {
  if (stats.energy >= 10_000) {
    stats.energy -= 10_000;
    stats.atk += 100;
    updateStats();
    logAdventure("You trained Attack (+100 ATK) using 10,000 Energy!");
  } else {
    alert("Not enough Energy!");
  }
}

function buyAtk50k() {
  if (stats.energy >= 50_000) {
    stats.energy -= 50_000;
    stats.atk += 500;
    updateStats();
    logAdventure("You trained Attack (+500 ATK) using 50,000 Energy!");
  } else {
    alert("Not enough Energy!");
  }
}

function buyAtk100k() {
  if (stats.energy >= 100_000) {
    stats.energy -= 100_000;
    stats.atk += 1000;
    updateStats();
    logAdventure("You trained Attack (+1,000 ATK) using 100,000 Energy!");
  } else {
    alert("Not enough Energy!");
  }
}

function buyAtk1m() {
  if (stats.energy >= 1_000_000) {
    stats.energy -= 1_000_000;
    stats.atk += 10_000;
    updateStats();
    logAdventure("You trained Attack (+10,000 ATK) using 1,000,000 Energy!");
  } else {
    alert("Not enough Energy!");
  }
}

function buyAtk10m() {
  if (stats.energy >= 10_000_000) {
    stats.energy -= 10_000_000;
    stats.atk += 100_000;
    updateStats();
    logAdventure("You trained Attack (+100,000 ATK) using 10,000,000 Energy!");
  } else {
    alert("Not enough Energy!");
  }
}

function buyAtk100m() {
  if (stats.energy >= 100_000_000) {
    stats.energy -= 100_000_000;
    stats.atk += 1_000_000;
    updateStats();
    logAdventure("You trained Attack (+1,000,000 ATK) using 100,000,000 Energy!");
  } else {
    alert("Not enough Energy!");
  }
}

function buyAtk1b() {
  if (stats.energy >= 1_000_000_000) {
    stats.energy -= 1_000_000_000;
    stats.atk += 10_000_000;
    updateStats();
    logAdventure("You trained Attack (+10,000,000 ATK) using 1,000,000,000 Energy!");
  } else {
    alert("Not enough Energy!");
  }
}

function buyAtk10b() {
  if (stats.energy >= 10_000_000_000) {
    stats.energy -= 10_000_000_000;
    stats.atk += 100_000_000;
    updateStats();
    logAdventure("You trained Attack (+100,000,000 ATK) using 10,000,000,000 Energy!");
  } else {
    alert("Not enough Energy!");
  }
}

function buyAtk100b() {
  if (stats.energy >= 100_000_000_000) {
    stats.energy -= 100_000_000_000;
    stats.atk += 1_000_000_000;
    updateStats();
    logAdventure("You trained Attack (+1,000,000,000 ATK) using 100,000,000,000 Energy!");
  } else {
    alert("Not enough Energy!");
  }
}

function buyAtk1t() {
  if (stats.energy >= 1_000_000_000_000) {
    stats.energy -= 1_000_000_000_000;
    stats.atk += 10_000_000_000;
    updateStats();
    logAdventure("You trained Attack (+10,000,000,000 ATK) using 1,000,000,000,000 Energy!");
  } else {
    alert("Not enough Energy!");
  }
}

function buyAtk10t() {
  if (stats.energy >= 10_000_000_000_000) {
    stats.energy -= 10_000_000_000_000;
    stats.atk += 100_000_000_000;
    updateStats();
    logAdventure("You trained Attack (+100,000,000,000 ATK) using 10,000,000,000,000 Energy!");
  } else {
    alert("Not enough Energy!");
  }
}

function buyAtk100t() {
  if (stats.energy >= 100_000_000_000_000) {
    stats.energy -= 100_000_000_000_000;
    stats.atk += 1_000_000_000_000;
    updateStats();
    logAdventure("You trained Attack (+1,000,000,000,000 ATK) using 100,000,000,000,000 Energy!");
  } else {
    alert("Not enough Energy!");
  }
}

updateStats();
function buyDef1k() {
  if (stats.mana >= 1_000) {
    stats.mana -= 1_000;
    stats.def += 10;
    stats.hp = 100 + stats.def * 10;
    updateStats();
    logAdventure("You trained Defense (+10 DEF) using 1,000 Mana!");
  } else {
    alert("Not enough Mana!");
  }
}

function buyDef3k() {
  if (stats.mana >= 3_000) {
    stats.mana -= 3_000;
    stats.def += 30;
    stats.hp = 100 + stats.def * 10;
    stats.hp = 100 + stats.def * 10;

    updateStats();
    logAdventure("You trained Defense (+30 DEF) using 3,000 Mana!");
  } else {
    alert("Not enough Mana!");
  }
}

function buyDef5k() {
  if (stats.mana >= 5_000) {
    stats.mana -= 5_000;
    stats.def += 50;
    stats.hp = 100 + stats.def * 10;

    updateStats();
    logAdventure("You trained Defense (+50 DEF) using 5,000 Mana!");
  } else {
    alert("Not enough Mana!");
  }
}

function buyDef10k() {
  if (stats.mana >= 10_000) {
    stats.mana -= 10_000;
    stats.def += 100;
    stats.hp = 100 + stats.def * 10;

    updateStats();
    logAdventure("You trained Defense (+100 DEF) using 10,000 Mana!");
  } else {
    alert("Not enough Mana!");
  }
}

function buyDef50k() {
  if (stats.mana >= 50_000) {
    stats.mana -= 50_000;
    stats.def += 500;
    stats.hp = 100 + stats.def * 10;

    updateStats();
    logAdventure("You trained Defense (+500 DEF) using 50,000 Mana!");
  } else {
    alert("Not enough Mana!");
  }
}

function buyDef100k() {
  if (stats.mana >= 100_000) {
    stats.mana -= 100_000;
    stats.def += 1_000;
    stats.hp = 100 + stats.def * 10;

    updateStats();
    logAdventure("You trained Defense (+1,000 DEF) using 100,000 Mana!");
  } else {
    alert("Not enough Mana!");
  }
}

function buyDef1m() {
  if (stats.mana >= 1_000_000) {
    stats.mana -= 1_000_000;
    stats.def += 10_000;
    stats.hp = 100 + stats.def * 10;

    updateStats();
    logAdventure("You trained Defense (+10,000 DEF) using 1,000,000 Mana!");
  } else {
    alert("Not enough Mana!");
  }
}

function buyDef10m() {
  if (stats.mana >= 10_000_000) {
    stats.mana -= 10_000_000;
    stats.def += 100_000;
    stats.hp = 100 + stats.def * 10;

    updateStats();
    logAdventure("You trained Defense (+100,000 DEF) using 10,000,000 Mana!");
  } else {
    alert("Not enough Mana!");
  }
}

function buyDef100m() {
  if (stats.mana >= 100_000_000) {
    stats.mana -= 100_000_000;
    stats.def += 1_000_000;
    stats.hp = 100 + stats.def * 10;

    updateStats();
    logAdventure("You trained Defense (+1,000,000 DEF) using 100,000,000 Mana!");
  } else {
    alert("Not enough Mana!");
  }
}

function buyDef1b() {
  if (stats.mana >= 1_000_000_000) {
    stats.mana -= 1_000_000_000;
    stats.def += 10_000_000;
    stats.hp = 100 + stats.def * 10;

    updateStats();
    logAdventure("You trained Defense (+10,000,000 DEF) using 1,000,000,000 Mana!");
  } else {
    alert("Not enough Mana!");
  }
}

function buyDef10b() {
  if (stats.mana >= 10_000_000_000) {
    stats.mana -= 10_000_000_000;
    stats.def += 100_000_000;
    stats.hp = 100 + stats.def * 10;

    updateStats();
    logAdventure("You trained Defense (+100,000,000 DEF) using 10,000,000,000 Mana!");
  } else {
    alert("Not enough Mana!");
  }
}

function buyDef100b() {
  if (stats.mana >= 100_000_000_000) {
    stats.mana -= 100_000_000_000;
    stats.def += 1_000_000_000;
    stats.hp = 100 + stats.def * 10;

    updateStats();
    logAdventure("You trained Defense (+1,000,000,000 DEF) using 100,000,000,000 Mana!");
  } else {
    alert("Not enough Mana!");
  }
}

function buyDef1t() {
  if (stats.mana >= 1_000_000_000_000) {
    stats.mana -= 1_000_000_000_000;
    stats.def += 10_000_000_000;
    stats.hp = 100 + stats.def * 10;

    updateStats();
    logAdventure("You trained Defense (+10,000,000,000 DEF) using 1,000,000,000,000 Mana!");
  } else {
    alert("Not enough Mana!");
  }
}

function buyDef10t() {
  if (stats.mana >= 10_000_000_000_000) {
    stats.mana -= 10_000_000_000_000;
    stats.def += 100_000_000_000;
    stats.hp = 100 + stats.def * 10;

    updateStats();
    logAdventure("You trained Defense (+100,000,000,000 DEF) using 10,000,000,000,000 Mana!");
  } else {
    alert("Not enough Mana!");
  }
}

function buyDef100t() {
  if (stats.mana >= 100_000_000_000_000) {
    stats.mana -= 100_000_000_000_000;
    stats.def += 1_000_000_000_000;
    stats.hp = 100 + stats.def * 10;

    updateStats();
    logAdventure("You trained Defense (+1,000,000,000,000 DEF) using 100,000,000,000,000 Mana!");
  } else {
    alert("Not enough Mana!");
  }
}

// --- Offline Progress System ---

// Modified saveGame to store lastSaveTime
function saveGame() {
  const saveData = {
    stats,
    inventory,
    equipped,
    lastSaveTime: Date.now()
  };
  localStorage.setItem("nguSave", JSON.stringify(saveData));
  alert("Game Saved!");
}

// Modified loadGame to apply offline progress
function loadGame() {
  const save = JSON.parse(localStorage.getItem("nguSave"));
  if (save) {
    Object.assign(stats, save.stats);
    inventory = save.inventory || [];
    equipped = save.equipped || { weapon: null, armor: null };

    const now = Date.now();
    const offlineTime = now - (save.lastSaveTime || now);
    applyOfflineProgress(offlineTime);

    updateStats();
    renderInventory();
    alert("Game Loaded!");
    if (!stats.enemyHP || stats.enemyHP <= 0) {
  stats.enemyHP = bosses[currentBossIndex].hp;
}
  }
}

// Function to apply offline gains based on milliseconds offline
function applyOfflineProgress(msElapsed) {
  const secondsOffline = msElapsed / 1000;

  // Cap offline time to 24 hours (86400 seconds)
  const cappedSeconds = Math.min(secondsOffline, 86400);

  // Apply exponential growth scaled by offline seconds (match your existing growth rates)
  stats.energy *= Math.pow(1.01, cappedSeconds);
  stats.mana *= Math.pow(1.02, cappedSeconds);

  stats.rebirthTime += cappedSeconds;

  logAdventure(`You were offline for ${Math.floor(cappedSeconds)} seconds and gained some progress!`);
}

// Optional: Autosave every 60 seconds to keep timestamp updated
setInterval(() => {
  saveGame();
}, 60000);

window.addEventListener('DOMContentLoaded', () => {
  // your entire script here, or at least your init code
});
updateBossDisplay();
updateStats();
renderInventory();
