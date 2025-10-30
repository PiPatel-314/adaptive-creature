devMode.addEventListener('input', () => {
hope = parseFloat(devMode.value) || 0
updateDisplays()
})


evolveBtn.addEventListener('click', () => {
clearInterval(timerInterval);
for (let i = 0; i < firstScreen.length; i++) {
firstScreen[i].style.display = 'inline-block'
}
prestigeGrade.style.display = 'inline-block'
evolveBtn.style.display = 'none'
 willBlood.style.display = 'none';
	hopeMult.style.display = 'none'
	bloodproduce.style.display = 'none'
 Startblood = 10;          // base starting blood for a run
 bloodBonus = 0;           // added by heals during run (persistent for run)
 bloodGainMult = 1;
 will = 0;                 // displayed will you spend/use
 trueWill = 0;             // will accumulated for converting to hope on death
willGainCost = 0.1;       // cost in hope for next will-gain upgrade willGainScale = 2;       // multiplicative scale after purchase

bloodGainCost = 1;        // cost in hope for starting blood upgrade
bloodGainScale = 3;     // scale multiplier after purchase

 willBloodCost = 1;        // will cost to use willBlood heal
 willBloodScale = 0.1;     // increase to willBloodCost after each use

 bloodDrainCost = 10;
 bloodDrainScale = 1.5

 bloodMultCost = 20
 bloodMultScale = 1.75

 willGainLevel = 0
 bloodGainLevel = 0
 bloodDrainLevel = 0
 bloodMultLevel = 0
 startingBloodLevel = 0
 willBloodLevel = 0
 bloodProductLevel = 0
 willMultiply = 1

 hopeMultiplier = 1
 timeMult = 1

 bloodProduct = 0
 bloodProductScale = 1.3
 bloodProductCost = 10
 willShow = false
 unBlood = 0

prestigeTriggered = false
mutagen += 1

mutagenLabel.textContent  = `Mutagen: ${mutagen}`

bloodGain.textContent = `Increase starting blood: ${bloodGainCost.toFixed(2)} Hope`
btnGainBlood.textContent = `Increase blood gain: ${bloodMultCost.toFixed(2)} Hope`

	bloodDrain.textContent = `Reduce blood drain: ${bloodDrainCost.toFixed(2)} Hope`

willGain.textContent = `Increase will gain: ${willGainCost.toFixed(2)} Hope`

bloodGain.textContent = `Increase starting blood: ${bloodGainCost.toFixed(2)} Hope`

willUpgrade.style.display = 'inline-block'
saveGame()
startRun()
})
thoughtBloodProduct.addEventListener('click',() => {
if (thoughtBloodProductLevel < 1 && thought >= 2) {
thought -= 2
thoughtBloodProductLevel += 1
thoughtBloodMult += 1
thoughtBloodProduct.textContent = 'Maxed'
}
})




bloodUnlock.addEventListener('click',() => {
if (thought >= 10) {
thought -= 10
unBloodValue.style.display = 'inline-block'
bloodTotalLabel.style.display = 'inline-block'
bloodLabelChange = true
bloodUnlock.style.display = 'none'
}
})
exploreUnlock.addEventListener('click',() => {
if (thought >= 5) {
thought -= 5
exploreDiv.style.display = 'inline-block'
storyText.textContent = "You blindly trudge throught and endless void."
abilityTriggerable = true
exploreUnlock.style.display = 'none'
abilityDiv.style.display = 'inline-block'
abilities[1].unlocked = true
updateDisplays()
}
})
thinkBtn.addEventListener('click',() => {
if (thinking == false) {
thinking = true
thinkLoss = 1
} else {
thinking = false
thinkLoss = 0
}
})

bloodproduce.addEventListener('click', () => {
if (!dead && will >= bloodProductCost && bloodProductLevel == 0) {
	will = will - bloodProductCost
	bloodProductCost = bloodProductCost * bloodProductScale
	bloodProduct = bloodProduct + 0.1
bloodProductLevel += 1
	updateDisplays()
if (bloodProductLevel == 1) {
bloodproduce.textContent = 'Maxed'
} else {
bloodproduce.textContent = `Produce blood: ${bloodProductCost.toFixed(2)} Will`
}
}
})


btnGainBlood.addEventListener('click', () => {
	if (dead && hope >= bloodMultCost && bloodGainLevel < 5) {
		bloodGainLevel += 1
		hope = hope - bloodMultCost
		bloodGainMult = bloodGainMult + 1
		bloodMultCost = bloodMultCost * bloodMultScale
		if (bloodGainLevel == 5) {
		btnGainBlood.textContent = 'Maxed'
} else {
		btnGainBlood.textContent = `Increase blood gain: ${bloodMultCost.toFixed(2)} Hope`
}
	updateDisplays()

}
		

})

bloodDrain.addEventListener('click', () => {
 if (dead && hope >= bloodDrainCost && bloodDrainLevel < 9) {
	bloodDrainLevel += 1
	hope = hope - bloodDrainCost
	bloodDrainCost = bloodDrainCost * bloodDrainScale
	timeMult = timeMult - 0.1
	if (bloodDrainLevel == 9) {
	bloodDrain.textContent = 'Maxed'
} else {
	bloodDrain.textContent = `Reduce blood drain: ${bloodDrainCost.toFixed(2)} Hope`
}
		updateDisplays()
}
})
hopeMult.addEventListener('click', () => {
if (!dead && will >= 5) {
hopeMultiplier += 1
will = will - 5
hopeMult.style.display = 'none'}
})
// Gain will while alive
incrementButton.addEventListener('click', () => {
  if (dead) return;
  const gain = 0.01 * willMultiply;
  will += gain;
  trueWill += gain;
  updateDisplays();
});

// Revive / Start
purchaseButton.addEventListener('click', () => {
  if (dead) {
    startRun();
  }
});

// "Restore blood" - spend will in-run to add seconds
willBlood.addEventListener('click', () => {
  if (dead) return;
  if (will >= willBloodCost && willBloodLevel < 10){
    will -= willBloodCost;
    // scale cost for next use
    willBloodCost = parseFloat((willBloodCost + willBloodScale).toFixed(02));
    // Add persistent seconds directly to remainingTime (this works because remainingTime is authoritative)
    remainingTime += (1 * bloodGainMult);
	unBlood -= (1 * bloodGainMult)
    // update button text to reflect new cost
willBloodLevel += 1
if (willBloodLevel == 10) {
	willBlood.textContent = 'Maxed'
} else {
    willBlood.textContent = `Restores blood: ${willBloodCost} Will`;
}
    updateDisplays();
  }
});

// helper label for willBlood button
function willCreepedLabel(){
  return willBloodCost.toFixed(02);
}
/* ---------- Upgrades ---------- */

thoughtAbilityUnlock.addEventListener('click', () => {
if (thought >= 20) {
thought -= 20
abilityDiv.style.display = 'inline-block'
thoughtAbilityUnlock.style.display = 'none'
abilityTriggerable = true
abilities[2].unlocked = true
}

})
acidUnlock.addEventListener('click', () => {
if (thought >= 5) {
thought -= 5
abilityDiv.style.display = 'inline-block'
acidUnlock.style.display = 'none'
abilityTriggerable = true
abilities[0].unlocked = true
abilities[3].unlocked = true
}
})

// Increase will gain (cost in hope)
willGain.addEventListener('click', () => {
  if (hope >= willGainCost && dead == true && willGainLevel < 10){
    hope -= willGainCost;
    willMultiply += 1;
    willGainCost *= willGainScale;
	willGainLevel += 1
	if (willGainLevel == 10) {
    willGain.textContent = 'Maxed'
} else {
    willGain.textContent = `Increase will gain: ${willGainCost.toFixed(02)} Hope`;
}
    updateDisplays();
  }
});

// Increase starting blood permanently (cost in hope)
bloodGain.addEventListener('click', () => {
  if (hope >= bloodGainCost && dead == true && startingBloodLevel < 5) {
    hope -= bloodGainCost;
	startingBloodLevel += 1
    Startblood += 5;
    bloodGainCost *= bloodGainScale;
	if (startingBloodLevel == 5) {
	bloodGain.textContent = 'Maxed'
}
 else {
    bloodGain.textContent = `Increase starting blood: ${bloodGainCost.toFixed(02)} Hope`;
}
    updateDisplays();
  }
});
brainBtn.addEventListener('click', () => {
if (mutagen >= 1) {
mutagen -= 1
mutagenLabel.textContent = `Mutagen: ${mutagen}`
brainDiv.style.display = 'inline-block'
brainBtn.style.display = 'none'
}
})
exploreAuto.addEventListener('input',() => {
const rate = parseFloat(exploreAuto.value)
exploreAutomated = rate > 0
})
// Reveal will-based upgrades (cost in hope)
willUpgrade.addEventListener('click', () => {
  if (dead == true && hope >= 5){
    hope -= 5;
    willBlood.style.display = 'inline-block';
	hopeMult.style.display = 'inline-block'
	bloodproduce.style.display = 'inline-block'
    willUpgrade.style.display = 'none';
	
	willShow = true
    storyText.textContent = 'You can now spend Will during a run. (This will not affect hope gain)';
    updateDisplays();
  }
});
/*-----------Milestones--------*/
function milestoneCalculate(amountExplored) {
if (amountExplored >= 5){
dna += 1
}
}

/*-----------Body parts-----------*/
heartRegular.addEventListener('input',() => {
heartSize = 1
heartBloodMult = 1
})

heartLarge.addEventListener('input', () => {
heartSize = 2
heartBloodMult = 0.75
})
/*------------Ability upgrades----------*/
sprayAttack.addEventListener('click', () => {
if (tissue >= 5) {
tissue -= 5
sprayAttackMult += 1
}
})
spraySpeed.addEventListener('click', () => {
if (tissue >= 10) {
tissue -= 10
spraySpeedMult += 1
}
})
sprayCooldown.addEventListener('click', () => {
if (tissue >= 20) {
tissue -= 20
sprayCooldownMult += 1
}
})
