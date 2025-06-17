// Game State
let energy = 0;
let power = 0;
let mana = 0;
let spellPower = 0;
let augmentPower = 0;
let timeJuice = 0;
let enemyHP = 10;
let kills = 0;
let weapon = "None";
let weaponBonus = 0;

// DOM references
const energyDisplay = document.getElementById("energyAmount");
const powerDisplay = document.getElementById("powerAmount");
const manaDisplay = document.getElementById("mana");
const spellPowerDisplay = document.getElementById("spellPower");
const augmentDisplay = document.getElementById("augmentPower");
const enemyHPDisplay = document.getElementById("enemyHP");
const killsDisplay = document.getElementById("kills");
const weaponDisplay = document.getElementById("weapon");
const timeJuiceDisplay = document.getElementById("timeJuice");

// Energy and Mana gain
setInterval(() => {
  energy += 1;
  mana += 2;
  updateUI();
}, 1000);

// Tabs
function showTab(name) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
  document.getElementById(name).classList.remove('hidden');
}

// Energy System
function spendEnergy() {
  if (energy >= 10) {
    energy -= 10;
    power += 1;
    updateUI();
  }
}

// Magic System
function castMagic() {
  if (mana >= 20) {
    mana -= 20;
    spellPower += 1;
    updateUI();
  }
}

// Augments
function upgradeAugment() {
  if (energy >= 50) {
    energy -= 50;
    augmentPower += 1;
    updateUI();
  }
}

// Time Machine
function boostTime() {
  if (energy >= 100) {
    energy -= 100;
    timeJuice += 1;
    updateUI();
  }
}

// Equipment
function equipWeapon() {
  if (weapon === "None") {
    weapon = "Sword";
    weaponBonus = 5;
    updateUI();
  }
}

// Adventure Combat
function attackEnemy() {
  const damage = (power + spellPower + weaponBonus + augmentPower) || 1;
  enemyHP -= damage;
  if (enemyHP <= 0) {
    enemyHP = 10;
    kills += 1;
  }
  updateUI();
}

// UI
function updateUI() {
  energyDisplay.textContent = energy;
  powerDisplay.textContent = power;
  manaDisplay.textContent = mana;
  spellPowerDisplay.textContent = spellPower;
  augmentDisplay.textContent = augmentPower;
  enemyHPDisplay.textContent = enemyHP;
  killsDisplay.textContent = kills;
  weaponDisplay.textContent = weapon;
  timeJuiceDisplay.textContent = timeJuice;
}

// Save/Load
function saveGame() {
  const save = {
    energy, power, mana, spellPower, augmentPower,
    enemyHP, kills, weapon, weaponBonus, timeJuice,
    lastSave: Date.now()
  };
  localStorage.setItem("nguSave", JSON.stringify(save));
  alert("Game Saved!");
}

function loadGame() {
  const save = localStorage.getItem("nguSave");
  if (save) {
    const data = JSON.parse(save);
    const offlineTime = Math.floor((Date.now() - data.lastSave) / 1000);
    energy = data.energy + offlineTime;
    mana = data.mana + (offlineTime * 2);
    power = data.power;
    spellPower = data.spellPower;
    augmentPower = data.augmentPower;
    enemyHP = data.enemyHP;
    kills = data.kills;
    weapon = data.weapon;
    weaponBonus = data.weaponBonus;
    timeJuice = data.timeJuice;
    updateUI();
    alert(`Loaded! You gained ${offlineTime} energy and ${offlineTime * 2} mana offline.`);
  } else {
    alert("No save found.");
  }
}
