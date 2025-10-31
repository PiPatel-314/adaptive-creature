
/* --- Game state --- */
var remainingTime = 0;        // authoritative timer (seconds)
var tickMs = 100;             // tick every 100ms
var decayPerTick = tickMs/1000; // seconds lost per tick
var prestigeCheck = 0
var timeBefore = 0

var Startblood = 10;          // base starting blood for a run
var bloodBonus = 0;           // added by heals during run (persistent for run)
var bloodGainMult = 1;
var will = 0;                 // displayed will you spend/use
var trueWill = 0;             // will accumulated for converting to hope on death
var hope = 0;                 // currency between runs

var unBlood = 0

var willMultiply = 1;         // will gain multiplier
var timerInterval = null;
var dead = true;              // start as not running until start/revive
var diedOnce = false;
var hopeOnce = false;

/* --- Upgrade costs/scale --- */
var willGainCost = 0.1;       // cost in hope for next will-gain upgrade
var willGainScale = 2;       // multiplicative scale after purchase

var bloodGainCost = 1;        // cost in hope for starting blood upgrade
var bloodGainScale = 3;     // scale multiplier after purchase

var willBloodCost = 1;        // will cost to use willBlood heal
var willBloodScale = 0.1;     // increase to willBloodCost after each use

var bloodDrainCost = 10;
var bloodDrainScale = 1.5

var bloodMultCost = 20
var bloodMultScale = 1.75

var willGainLevel = 0
var bloodGainLevel = 0
var bloodDrainLevel = 0
var bloodMultLevel = 0
var startingBloodLevel = 0
var willBloodLevel = 0
var bloodProductLevel = 0
var thoughtBloodProductLevel = 0
var thoughtBloodMult = 1

var hopeMultiplier = 1
var timeMult = 1

var bloodProduct = 0
var bloodProductScale = 1.3
var bloodProductCost = 10
var willShow = false
var prestigeTriggered = false
var evolved = false

var mutagen = 0
var thinkLoss = 0
var thinking = false
var thought = 0
var bloodTotal = 0
var bloodLabelChange = false
var randomNumber = 0
var abilityTriggerable = false
var cooldownTime = 0

var exploreAutomated = false
var sprayTime = 0
var abilityCooldown = 0
var combatEngaged = false
var activeEnemy = 0
var combatShown = false


var heartSize = 1
var heartBloodMult = 1
var realBloodTotal = 0
var areaExplored = 0
var tissue = 0
var dna = 0

var sprayAttackMult = 1
var spraySpeedMult = 1
var sprayCooldownMult = 1

var mapDown = 0
var mapRight = 0

var draggingDown = 0 
var draggingRight = 0
var draggedObject = ""
/* --- Elements --- */
var firstScreen = document.getElementsByClassName('first')

var unBloodValue = document.getElementById('unblood-value')
var bloodValue = document.getElementById('blood-value');
var willText = document.getElementById('will-value');
var hopeValue = document.getElementById('hope-value');
var storyText = document.getElementById('story-text');

var incrementButton = document.getElementById('increment-btn');
var purchaseButton = document.getElementById('purchase-btn');

var willBlood = document.getElementById('will-blood');
var willGain = document.getElementById('will-gain');
var bloodGain = document.getElementById('blood-gain');
var willUpgrade = document.getElementById('will-upgrade');
var hopeMult = document.getElementById('hope-mult');
var bloodDrain = document.getElementById('blood-drain');
var btnGainBlood = document.getElementById('btn-blood-gain');
var bloodproduce = document.getElementById('blood-produce')

var prestigeDiv = document.getElementById('prestige-div')
var evolveBtn = document.getElementById('evolve')
var prestigeGrade = document.getElementById('prestigeTwo')

var mutagenLabel = document.getElementById('mutagen-label')
var brainBtn = document.getElementById('brain-unlock')

var brainDiv = document.getElementById('brain-div')
var thinkBtn = document.getElementById('think-btn')
var thoughtLabel = document.getElementById('thought-label')
var exploreUnlock = document.getElementById('explore-Btn')
var bloodUnlock = document.getElementById('see-blood')
var thoughtBloodProduct = document.getElementById('thought-blood-product')
var bloodTotalLabel = document.getElementById('blood-total')

var exploreDiv = document.getElementById('explore-div')
var abilityDiv = document.getElementById('ability-div')
var exploreBtn = document.getElementById('explore-btn')
var exploreAuto = document.getElementById('explore-auto')
var exploreCount = document.getElementById('explore-count')
var exploreValue = document.getElementById('explore-value')

var sprayValue = document.getElementById('spray-value')
var sprayCount = document.getElementById('spray-count')
var sprayDiv = document.getElementById('spray-div')
var sprayAuto = document.getElementById('spray-auto')


var critCount = document.getElementById('crit-count')
var critValue = document.getElementById('crit-value')
var critDiv = document.getElementById('crit-div')

var healCount = document.getElementById('heal-count')
var healValue = document.getElementById('heal-value')
var healDiv = document.getElementById('heal-div')


var combatDiv = document.getElementById('combat-panel')
var monsterName = document.getElementById('monster-name')
var monsterAttack = document.getElementById('monster-attack')
var monsterHealthLabel = document.getElementById('monster-health')

var acidUnlock = document.getElementById('acid-unlock')
var thoughtAbilityUnlock = document.getElementById('thought-ability-unlock')
var thoughtProduct = document.getElementById('thought-product')
var evolutionUnlock = document.getElementById('evolution-unlock')

var devMode = document.getElementById('dev-mode');

var heartLarge = document.getElementById('heart-large')
var heartRegular = document.getElementById('heart-regular')

var tissueCounter = document.getElementById('tissue-counter')

var sprayAttack = document.getElementById('acid-attack')
var spraySpeed = document.getElementById('acid-speed')
var sprayCooldown = document.getElementById('acid-cooldown')

var combatTotalBlood = document.getElementById('combat-total-blood')
var combatOxyBlood = document.getElementById('combat-oxy-blood')

var mapDiv = document.getElementById('map-div')

var sprayHolder = document.getElementById('spray-holder')
var exploreHolder = document.getElementById('explore-holder')
var critHolder = document.getElementById('crit-holder')
var healHolder = document.getElementById('heal-holder')

var abilitieSelectHolder = document.getElementById('abilitie-select-holder')
/* -----------Abilities----------*/
var abilities = [
  {
    id: "acidSpray",
    name: "Acid Spray",
    cost: 5,              // total blood required to charge
    cooldown: 1,          // seconds of cooldown after firing
    sliderId: "spray-auto", // id of the linked range input
    sliderElem: null,     // assigned later
    progress: 0,          // how much blood invested so far
    progressDisplay: sprayValue,
    autoDisplay: sprayCount,
    abilityDiv: sprayDiv,
    cooldownTimer: 0,
    cooldownAsk: false,
    active: false,
	unlocked: false,
    effect: () => {
if (combatEngaged == true) {
damageEnemy(activeEnemy,(1 * sprayAttackMult))
}
    }
  },
  {
    id: "exploration",
    name: "Exploration",
    cost: 2,
    cooldown: 2,
    sliderId: "explore-auto",
    sliderElem: null,
    progress: 0,
	progressDisplay: exploreValue,
	autoDisplay: exploreCount,
	abilityDiv: exploreDiv,
    cooldownTimer: 0,
    active: false,
	unlocked: false,
    effect: () => {
      randomNumber = Math.random() * 100
      if (randomNumber <= 50) {
battleStart()
};
areaExplored += 1
mapUpdate()
    }
  },
{
id: "critical",
name: "Exploration",
cost: 3,
cooldown: 1,
sliderId: "crit-auto",
sliderElem: null,
progress: 0,
progressDisplay: critValue,
autoDisplay: critCount,
abilityDiv: critDiv,
cooldownTimer: 0,
active: false,
unlocked: false,
effect: () => {

}
},

{
id: "basicHeal",
name: "Recover",
cost: 5,
cooldown: 3,
sliderId: "heal-auto",
sliderElem: null,
progress: 0,
progressDisplay: healValue,
autoDisplay: healCount,
abilityDiv: healDiv,
cooldownTimer: 0,
active: false,
unlocked: false,
effect: () => {
healPlayer(2)
},
}
];

var panelIds = {
  main: 'panel-main',
  abilities: 'panel-abilities',
  combat: 'panel-combat',
  story: 'panel-story',
  body: 'panel-body'
};


/*-----------Monsters------------*/
//Note to self this is a terrible idea
var monsterArr = [{
id: "rat",
name: "Rat",
maxHealth: 5,
health: 5,
cooldown: 2,
cooldownAsk: false,
progress: 0,
cooldownTimer: 0,
rate: 0.5,
cost: 3,
attack: 2,
healthDisplay: monsterHealthLabel,
attackDisplay: monsterAttack,
nameDisplay: monsterName,
reward: 1,
}]

