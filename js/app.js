console.log("Magic: The Gathering");

//look at mtg api; use card class only for super values
// class Card {
// 	constructor(name, anyManaCost, whiteManaCost, blueManaCost, blackManaCost, redManaCost, greenManaCost, colorlessManaCost) {

// 	}
// }

class Card {

}

class Land extends Card {
	constructor(name,subtype,zone,isTapped) {
		this.name = name;
		this.subtype = subtype;
		this.zone = zone;
		this.isTapped = isTapped;
	}
	play() {
		//if zone = hand and game.phase = main1/main2, change zone from hand to bf on click
	}
	tap() {
		//if zone = battlefield, turn corresponding img element sideways, isTapped = true, add corresponding mana type to mana pool
	}
}

class Creature extends Card {
	constructor(name,manaCost,power,toughness,zone,isTapped,isAttacking,isBlocking,isBlocked,currentDamage) {
		this.name = name;
		this.manaCost = manaCost;
		this.power = power;
		this.toughness = toughness;
		this.zone = zone;
		this.isTapped = isTapped;
		this.isAttacking = isAttacking;
		this.isBlocking = isBlocking;
		this.isBlocked = isBlocked;
		this.currentDamage = currentDamage;
	}
	play() {
		//if zone = hand, change zone from hand to bf on click
	}
	attack() {
		//if zone = bf and game.phase = attack, turn corresponding img element sideways, isTapped = true, isAttacking = true
	}
	block(attacker) {
		//if zone = bf and game.phase = block and isTapped = false, move corresponding img element to attacker
	}
	dealDamage() {
		//if attacking and unblocked, reduce opponent's life total by power
		//if attacking and blocked, divide damage between blockers (i.e. change currentDamage values)
		//if blocking, deal damage to attacher (change cD value)
		//if cD >= toughness, die
	}
	die() {
		//move to graveyard or disappear
	}
}

const game = {
	turnCounter: 0,
	activePlayer: null,
	activePlayerName: null,
	phases: ["Untap","Draw","Main 1","Attack","Block","Damage","Main 2","End"],
	currentPhaseIndex: -1,
	currentPhase: null,
	startGame() {
		this.currentPhase = "Untap";
		player1.life = 20;
		player2.life = 20;
		this.updateTurn();
		this.updateActivePlayer();
		this.updatePhase();
		this.updateP1Life();
		this.updateP2Life();
	},
	updateTurn() {
		this.turnCounter++;
		$('#turn').text("Turn " + this.turnCounter + ":");
	},
	updateActivePlayer() {
		if(this.activePlayer === player1) {
			this.activePlayer = player2;
			this.activePlayerName = "Player 2"
		} else {
			this.activePlayer = player1;
			this.activePlayerName = "Player 1"
		}
		$('#actP').text(this.activePlayerName);
	},
	updatePhase() {
		if(this.currentPhaseIndex < this.phases.length - 1) {
			this.currentPhaseIndex++;
		} else {
			this.currentPhaseIndex = 0;
		}
		this.currentPhase = this.phases[this.currentPhaseIndex];
		$('#phase').text("Current Phase: " + this.currentPhase);
	},
	updateP1Life() {
		$('#p1lt').text("P1 Life: " + player1.life);
	},
	updateP2Life() {
		$('#p2lt').text("P2 Life: " + player2.life);
	}
}

const player1 = {
	life: 20,
	library: [],
	hand: [],
	permanents: [],
	graveyard: [],
	draw() {
		console.log("p1 draw");
		this.hand.push(this.library[0]);
	}
}

const player2 = {
	life: 20,
	library: [],
	hand: [],
	permanents: [],
	graveyard: [],
	draw() {
		console.log("p2 draw");
		this.hand.push(this.library[0]);
	}
}

game.startGame();





















