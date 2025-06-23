let energy = 0, mana = 0, power = 0, spellPower = 0, augmentPower = 0;
let enemyHP = 10, kills = 0, weapon = "None", weaponBonus = 0;
let timeJuice = 0, rebirthPoints = 0, totalEnergy = 0, totalMana = 0;

function updateUI() {
  document.getElementById("energyAmount").textContent = energy;
  document.getElementById("mana").textContent = mana;
  document.getElementById("powerAmount").textContent = power;
  document.getElementById("spellPower").textContent = spellPower;
  document.getElementById("augmentPower").textContent = augmentPower;
  document.getElementById("enemyHP").textContent = enemyHP;
  document.getElementById("kills").textContent = kills;
  document.getElementById("weapon").textContent = weapon;
  document.getElementById("timeJuice").textContent = timeJuice;
  document.getElementById("rebirthPoints").textContent = rebirthPoints;
  document.getElementById("statEnergy").textContent = totalEnergy;
  document.getElementById("statMana").textContent = totalMana;
  document.getElementById("rebirthMult").textContent = (1 + rebirthPoints * 0.1).toFixed(2) + "x";
}

function showTab(name) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(name).classList.add('active');
}

setInterval(() => {
  let mult = 1 + rebirthPoints * 0.1;
  energy += Math.floor(1 * mult);
  mana += Math.floor(2 * mult);
  totalEnergy += Math.floor(1 * mult);
  totalMana += Math.floor(2 * mult);
  updateUI();
}, 1000);

function spendEnergy() {
  if (energy >= 10) {
    energy -= 10;
    power++;
    updateUI();
  }
}

function castMagic() {
  if (mana >= 20) {
    mana -= 20;
    spellPower++;
    updateUI();
  }
}

function upgradeAugment() {
  if (energy >= 50) {
    energy -= 50;
    augmentPower++;
    updateUI();
  }
}

function attackEnemy() {
  let damage = power + spellPower + augmentPower + weaponBonus || 1;
  enemyHP -= damage;
  if (enemyHP <= 0) {
    enemyHP = 10;
    kills++;
  }
  updateUI();
}

function equipWeapon() {
  if (weapon === "None") {
    weapon = "Sword";
    weaponBonus = 5;
    updateUI();
  }
}

function boostTime() {
  if (energy >= 100) {
    energy -= 100;
    timeJuice++;
    updateUI();
  }
}

function rebirth() {
  if (power >= 10 || spellPower >= 10 || kills >= 10) {
    rebirthPoints++;
    energy = mana = power = spellPower = augmentPower = timeJuice = kills = 0;
    enemyHP = 10;
    weapon = "None";
    weaponBonus = 0;
    updateUI();
  } else {
    alert("You need at least 10 power, spell power, or kills to rebirth.");
  }
}

function saveGame() {
  const save = {
    energy, mana, power, spellPower, augmentPower, enemyHP,
    kills, weapon, weaponBonus, timeJuice, rebirthPoints,
    totalEnergy, totalMana
  };
  localStorage.setItem("nguIdleSave", JSON.stringify(save));
  alert("Game saved!");
}

function loadGame() {
  const save = localStorage.getItem("nguIdleSave");
  if (save) {
    const data = JSON.parse(save);
    energy = data.energy;
    mana = data.mana;
    power = data.power;
    spellPower = data.spellPower;
    augmentPower = data.augmentPower;
    enemyHP = data.enemyHP;
    kills = data.kills;
    weapon = data.weapon;
    weaponBonus = data.weaponBonus;
    timeJuice = data.timeJuice;
    rebirthPoints = data.rebirthPoints;
    totalEnergy = data.totalEnergy;
    totalMana = data.totalMana;
    updateUI();
    alert("Game loaded!");
  } else {
    alert("No save found.");
  }
}

updateUI();
