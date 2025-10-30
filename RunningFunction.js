
/* ---------- Utility ---------- */
function resetGame() {
  localStorage.removeItem('gameSave');
  location.reload();
}
function loadGame() {
  var saved = JSON.parse(localStorage.getItem('gameSave'));
  if (!saved) return;

  hope = saved.hope ?? hope;
  Startblood = saved.Startblood ?? Startblood;
  bloodGainMult = saved.bloodGainMult ?? bloodGainMult;
  willMultiply = saved.willMultiply ?? willMultiply;
  willShow = saved.willShow ?? willShow;
  willGainLevel = saved.willGainLevel ?? willGainLevel;
  bloodGainLevel = saved.bloodGainLevel ?? bloodGainLevel;
  bloodDrainLevel = saved.bloodDrainLevel ?? bloodDrainLevel;
  bloodMultLevel = saved.bloodMultLevel ?? bloodMultLevel;
  startingBloodLevel = saved.startingBloodLevel ?? startingBloodLevel;
  willBloodLevel = saved.willBloodLevel ?? willBloodLevel;
  bloodProductLevel = saved.bloodProductLevel ?? bloodProductLevel;
  mutagen = saved.mutagen ?? mutagen;
}
function updateDisplays(){
	if (bloodLabelChange == false){
  bloodValue.textContent = (remainingTime > 0 && !dead) ? `Blood: ${remainingTime.toFixed(2)}` : dead ? "Blood: (dead)" : `Blood: ${remainingTime.toFixed(2)}`;
} else {
bloodValue.textContent = (remainingTime > 0 && !dead) ? `Oxygenated Blood: ${remainingTime.toFixed(2)}` : dead ? "Oxygenated Blood: (dead)" : `Oxygenated Blood: ${remainingTime.toFixed(2)}`
}
  willText.textContent = `Will: ${will.toFixed(2)}`;
  hopeValue.textContent = `Hope: ${hope.toFixed(2)}`;
  willBlood.textContent = `Restores blood: ${willBloodCost} Will`
	thoughtLabel.textContent = `Thoughts: ${thought.toFixed(2)}`
	unBloodValue.textContent = `Unoxygenated Blood: ${unBlood.toFixed(2)}`
	bloodTotalLabel.textContent = `Blood total: ${bloodTotal}` 
        combatTotalBlood.textContent = bloodTotalLabel.textContent
 	combatOxyBlood.textContent = bloodValue.textContent
saveGame()
}

function saveGame() {
  var saveData = {
    hope,
    Startblood,
    bloodGainMult,
    willMultiply,
    willShow,
    willGainLevel,
    bloodGainLevel,
    bloodDrainLevel,
    bloodMultLevel,
    startingBloodLevel,
    willBloodLevel,
    bloodProductLevel,
	mutagen
  };

  localStorage.setItem('gameSave', JSON.stringify(saveData));
}

/* ---------- Timer / run control ---------- */
function startRun(){
  // initialize run values
  dead = false;
  Startblood *= heartSize
  remainingTime = (Startblood + 0); // fresh start; bloodBonus starts at 0
  bloodBonus = 0;
  will = 0;
  trueWill = 0;
  bloodTotal = Startblood * heartSize
  realBloodTotal = bloodTotal
  storyText.textContent = "You're bleeding out";
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, tickMs);
  Startblood /= heartSize
  updateDisplays();
}

function updateTimer(){
  if (dead) return;
  // decrement authoritative remainingTime
	timeBefore = remainingTime
  remainingTime = remainingTime - (decayPerTick * timeMult) + ((bloodProduct * thoughtBloodMult) * heartBloodMult);

if (thinking) {
remainingTime -= thinkLoss * (tickMs/1000);
thought = parseFloat((thought + 0.5 * (tickMs/1000)).toFixed(2));
thoughtLabel.textContent = `Thoughts: ${thought.toFixed(2)}`
}
unBlood += (decayPerTick * timeMult) - ((thoughtBloodMult * bloodProduct) * heartBloodMult) + thinkLoss * (tickMs/1000)
bloodTotal = Math.round(remainingTime + unBlood, 0)


abilityTrigger()
if (combatEngaged == true) {
monsterAbility()
}

  // clamp so it doesn't go wildly negative for display purposes
  if (remainingTime <= 0) {
    remainingTime = 0;
    handleDeath();
  } else if (remainingTime > bloodTotal && evolved == false) {
	evolved = true
	prestigeTrigger()	
} 

if (remainingTime > bloodTotal) {
remainingTime = bloodTotal
unBlood = 0
}
updateDisplays()
}

function handleDeath(){
  if (dead) return;
  dead = true;
  clearInterval(timerInterval);
  // award hope equal to trueWill (what you actually generated during run)
  hope = parseFloat(((hope + trueWill) * hopeMultiplier).toFixed(2));
  storyText.textContent = diedOnce ? "You are getting better... You're still dying but improving." : "You died but that's okay this time you can try again. You're second chance gives you HOPE.";
  diedOnce = true;
  hopeOnce = true;
  // reset run-specific values
  hopeMultiplier = 1
  will = 0;
  trueWill = 0;
  unBlood = 0
  willBloodCost = 1
if (willShow == true) {
  hopeMult.style.display = "inline-block"
saveGame()
}
	bloodProductCost = 10
bloodproduce.textContent = `Produce blood: ${bloodProductCost} Will`
combatEngaged = false
combatDiv.style.display = 'none'
  updateDisplays();
  
}

function prestigeTrigger() {
if (prestigeTriggered) return;
  prestigeTriggered = true
storyText.textContent = 'The bleeding stops but you are still weak you must.'
for (var i = 0; i < firstScreen.length; i++) {
    firstScreen[i].style.display = 'none';
}
evolveBtn.style.display = 'inline-block'
prestigeDiv.style.display = 'inline-block'
prestigeGrade.style.display = 'none'
brainDiv.style.display = 'none'
}

function abilityTrigger() {
  if (dead) return;

  for (var ability of abilities) {
    // Ensure slider exists
    if (!ability.sliderElem) continue;
    var rate = parseFloat(ability.sliderElem.value) || 0;

    // If ability is on cooldown -> decrement timer and update display, then skip charging
    if (ability.cooldownTimer > 0) {
      ability.cooldownTimer -= (tickMs / 1000) * sprayCooldownMult
      if (ability.cooldownTimer <= 0) {
        ability.cooldownTimer = 0;
        ability.cooldownAsk = false;
      } else {
        ability.cooldownAsk = true;
        ability.progressDisplay.textContent = `${ability.name} cooldown: ${ability.cooldownTimer.toFixed(1)}s`;
      }
      if (ability.progressDisplay) {
        ability.progressDisplay.textContent = `Cooldown: ${ability.cooldownTimer.toFixed(1)}s`;
        if (ability.autoDisplay) ability.autoDisplay.textContent = `Blood automation: ${rate.toFixed(2)}/s`;
      }
      continue; // don't charge while cooling down
    }

    // If slider is zero/inactive, show current progress but do not drain
    if (rate <= 0) {
      ability.active = false;
      if (ability.progressDisplay) {
        ability.progressDisplay.textContent = `${ability.progress.toFixed(2)}/${ability.cost.toFixed(2)}`;
        if (ability.autoDisplay) ability.autoDisplay.textContent = `Blood automation: ${rate.toFixed(2)}/s`;
      }
      continue;
    }

    // Active and not on cooldown: drain blood and charge ability
    ability.active = true;
    var drain = rate * (tickMs / 1000);
	var oxygenDrain = Math.min(remainingTime, drain);
    if (oxygenDrain > 0) {
      remainingTime -= oxygenDrain;
	unBlood += oxygenDrain;
      ability.progress += (oxygenDrain * spraySpeedMult);
    }

    // Fired
    if (ability.progress >= ability.cost) {
      ability.effect();
      ability.progress = 0;
      ability.cooldownTimer = ability.cooldown;
      if (ability.progressDisplay) ability.progressDisplay.textContent = `Cooldown: ${ability.cooldownTimer.toFixed(1)}s`;
    } else {
      if (ability.progressDisplay) ability.progressDisplay.textContent = `${ability.progress.toFixed(2)}/${ability.cost.toFixed(02)}`;
    }

    if (ability.autoDisplay) ability.autoDisplay.textContent = `Blood automation: ${rate.toFixed(2)}/s`;
  }

 if (combatShown) updateCombatUI()
}

function monsterAbility() {
if (!combatEngaged) return;
var dt = tickMs / 1000;

  monsterArr.forEach(monster => {
    var drain = monster.rate * dt;
	if (monster.cooldownTimer > 0) {
      monster.cooldownTimer -= dt;
      if (monster.cooldownTimer <= 0) {
        monster.cooldownTimer = 0;
	monster.cooldownAsk = false
      }
else {
monster.cooldownAsk = true 
};
if (monster.attackDisplay) {
if (monster.cooldownAsk == true) { 
monster.attackDisplay.textContent = `Cooldown: ${monster.cooldownTimer.toFixed(02)} seconds left`
}
else {
monster.attackDisplay.textContent = `${monster.progress.toFixed(1)}/${monster.cost.toFixed(02)}`
}
}
return
}


    monster.progress += drain;

    if (monster.progress >= monster.cost) {
      monster.progress = 0;
      remainingTime -= monster.attack;
      bloodTotal -= monster.attack;
	monster.cooldownTimer = monster.cooldown
	monster.cooldownAsk = true
if (monster.attackDisplay) monster.attackDisplay.textContent = `Cooldown: ${monster.cooldownTimer.toFixed(1)}s`;
      return;
    }

    // Update progress display while charging
    if (monster.attackDisplay) {
      monster.attackDisplay.textContent = `${monster.progress.toFixed(2)}/${monster.cost.toFixed(02)}`;
    
    }
	 if (combatShown) updateCombatUI()
  });
}

function damageEnemy(monsterNumber,playerDamage) {
var monsterObject = monsterArr[monsterNumber]
monsterObject.health -= playerDamage
monsterObject.healthDisplay.textContent = `${monsterObject.name}: ${monsterObject.health}/${monsterObject.maxHealth}`
if (monsterObject.health <= 0) {
   playerWin(monsterObject)
}
}
function playerWin(monsterObject) {
storyText.textContent = `The ${monsterObject.name} crumples to the floor. You get ${monsterObject.reward} tissue.`
tissue += 1
tissueCounter.textContent =  `${tissue} Tissue`
combatEngaged = false
combatDiv.style.display = 'none'
}

function battleStart() {
monsterSelect()
var monsterObject = monsterArr[activeEnemy]
monsterArr[activeEnemy].health = monsterArr[activeEnemy].maxHealth
storyText.textContent = `a ${monsterObject.name} aproaches`
combatEngaged = true
combatDiv.style.display = 'inline-block'
}

function monsterSelect() {
activeEnemy = 0
}
function healPlayer(healing) {
unBlood += healing
bloodTotal += healing
if (bloodTotal >= realBloodTotal) {
bloodTotal = realBloodTotal
}
}
function mapMaker() {
const newTable = document.createElement("table")
const newTableBody = document.createElement('tbody')
for (let i = 0;i < 4; i++) {
const row = document.createElement('tr')
newTableBody.appendChild(row)
	for (let j = 0; j < 4; j++){
	const cell = document.createElement('td')
		cell.id = `${i}-${j}`
	const cellText = document.createTextNode('ahh')
	cell.appendChild(cellText)
	row.appendChild(cell)
}
}
newTable.appendChild(newTableBody)
mapDiv.appendChild(newTable)
}
function mapUpdate() {
const evilCell = document.getElementById(`${mapDown}-${mapRight}`)
evilCell.textContent = 'done'
mapRight += 1
if (mapRight == 4) {
mapRight = 0
mapDown += 1
}

}

function updateCombatUI() {
  monsterArr.forEach(monster => {
    if (monster.nameDisplay) monster.nameDisplay.textContent = monster.name;
    if (monster.healthDisplay) monster.healthDisplay.textContent = `${monster.health}/${monster.maxHealth}`;
    if (monster.attackDisplay) {
      if (monster.cooldownTimer > 0) monster.attackDisplay.textContent = `Cooldown: ${monster.cooldownTimer.toFixed(1)}s`;
      else monster.attackDisplay.textContent = `${monster.progress.toFixed(2)}/${monster.cost.toFixed(02)}`;
    }
  });
}

/* ---------- Initialization ---------- */

function initAbilities() {
  // link slider elements once DOM is ready
  for (var ability of abilities) {
    if (ability.sliderId) {
      ability.sliderElem = document.getElementById(ability.sliderId);
      if (ability.sliderElem) {
        ability.sliderElem.addEventListener("input", () => {
          ability.active = parseFloat(ability.sliderElem.value) > 0;
        });
      }
    }
  }
}
// optional per-panel onShow hooks
var onShow = {
  combat: () => {
    // refresh combat UI when user opens combat tab
    combatDiv.style.display = 'inline-block'; // if you still control visibility via this
    // force immediate UI update for monster stats
    monsterArr.forEach(m => {
      if (m.nameDisplay) m.nameDisplay.textContent = m.name;
      if (m.healthDisplay) m.healthDisplay.textContent = `${m.health}/${m.maxHealth}`;
      if (m.attackDisplay) m.attackDisplay.textContent = `${m.progress.toFixed(02)}/${m.cost.toFixed(02)}`;
    });
  },
  abilities: () => {
    // refresh ability displays if you want
    abilities.forEach(a => {
      if (a.progressDisplay) a.progressDisplay.textContent = `${a.progress.toFixed(02)}/${a.cost.toFixed(02)}`;
      if (a.autoDisplay && a.sliderElem) a.autoDisplay.textContent = `Blood automation: ${parseFloat(a.sliderElem.value).toFixed(02)}/s`;
    });
  }
};

function showTab(name) {
  // hide all panels
  Object.values(panelIds).forEach(id => {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // remove active class from all tab buttons
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  // show requested panel (and make any ancestor tab-panel visible)
  var panel = document.getElementById(panelIds[name]);
  if (panel) {
    panel.style.display = 'block';

    // ensure any ancestor tab-panel containers are also shown (fixes accidental nesting)
   
  }

  // mark button active
  var btn = document.querySelector(`.tab-btn[data-tab="${name}"]`);
  if (btn) btn.classList.add('active');

  // run optional refresh callback
  if (onShow[name]) onShow[name]();

  if (name === "combat") {
  updateCombatUI();
  combatShown = true;

  if (abilityTriggerable === true) {
    // show the ability container
    abilityDiv.style.display = 'inline-block';

    // show unlocked ability panels, hide locked ones
    for (var ability of abilities) {
      if (ability.abilityDiv) {
        ability.abilityDiv.style.display = ability.unlocked ? 'inline-block' : 'none';
      }
      // also show/hide any linked sliders
      if (ability.sliderElem) {
        ability.sliderElem.style.display = ability.unlocked ? '' : 'none';
      }
    }
  }

  if (combatEngaged == false) {
    combatDiv.style.display = 'none';
  }
} else {
  combatShown = false;
}
console.log(document.querySelectorAll('.tab-btn').forEach(b => console.log(b, b.dataset.tab)))
}




// wire tab buttons
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
console.log("Story tab clicked:", btn.dataset.tab);
showTab(btn.dataset.tab)});
});

// optionally show the default tab
showTab('main');



initAbilities()
// Make sure displays show initial values and the run is not active until user starts

setInterval(saveGame, 5000)
// loadGame()
updateDisplays();
// (optionally auto-start)
startRun();
evolved = true
prestigeTrigger()
