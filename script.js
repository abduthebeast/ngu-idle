// Helper for scientific notation
function formatNum(n) {
  if (n < 1e3) return Math.floor(n).toString();
  if (n < 1e6) return (n / 1e3).toFixed(2) + "K";
  if (n < 1e9) return (n / 1e6).toFixed(2) + "M";
  if (n < 1e12) return (n / 1e9).toFixed(2) + "B";
  if (n < 1e15) return (n / 1e12).toFixed(2) + "T";
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
  document.getElementById("player-hp").textContent = stats.playerHP;
  document.getElementById("enemy-hp").textContent = formatNum(stats.enemyHP);
}

function showTab(id) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  const active = document.getElementById("tab-" + id);
  if (active) active.classList.add("active");
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
    inventory = [];
    equipped = { weapon: null, armor: null };
    updateStats();
    renderInventory();
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
