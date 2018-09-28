console.log("Magic: The Gathering");

class Card {
	constructor(image,zone,visibility) {
		this.image = image;
		this.zone = zone;
		this.visibility = visibility;
	}
}

class Land extends Card {
	constructor(name,subtype,zone,isTapped, image) {
		super(zone,image);
		this.name = name;
		this.subtype = subtype;
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
	constructor(name,manaCost,power,toughness,zone,isTapped,isAttacking,isBlocking,isBlocked,currentDamage, image) {
		super(zone,image);
		this.name = name;
		this.manaCost = manaCost;
		this.power = power;
		this.toughness = toughness;
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
		player1.life = 20;
		player2.life = 20;
		this.updateTurn();
		this.updateActivePlayer();
		this.updatePhase();
		this.updateP1Life();
		this.updateP2Life();
		this.shuffleLibrary(player1.library);
		this.shuffleLibrary(player2.library);
		this.dealHands();
		//prompt player 1 to start playing
		this.message("Press the button to move to the next phase.");
	},
	shuffleLibrary(library) {
		let i = 0;
		let j = 0;
		let temp = null;
		for(let i = library.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1))
			temp = library[i];
			library[i] = library[j];
			library[j] = temp;
		}
	},
	dealHands() {
		for(let i = 0; i < 7; i++) {
			player1.hand.push(player1.library.shift());
		}
		for(let i = 0; i < 7; i++) {
			player2.hand.push(player2.library.shift());
		}
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
			if(this.turnCounter > 0) {
				if(this.activePlayer === player2) {
					this.updateTurn();
				}
				this.updateActivePlayer();
			}
		}
		this.currentPhase = this.phases[this.currentPhaseIndex];
		$('#phase').text("Current Phase: " + this.currentPhase);
	},
	updateP1Life() {
		$('#p1lt').text("P1 Life: " + player1.life);
	},
	updateP2Life() {
		$('#p2lt').text("P2 Life: " + player2.life);
	},
	message(content) {
		$('#message').text(content);
	}
}

const player1 = {
	life: 20,
	library: [
			new Land("Mountain","Mountain","Library",false,""),
			new Land("Mountain","Mountain","Library",false,""),
			new Land("Mountain","Mountain","Library",false,""),
			new Land("Mountain","Mountain","Library",false,""),
			new Land("Mountain","Mountain","Library",false,""),
			new Land("Mountain","Mountain","Library",false,""),
			new Land("Mountain","Mountain","Library",false,""),
			new Land("Forest","Forest","Library",false,""),
			new Land("Forest","Forest","Library",false,""),
			new Land("Forest","Forest","Library",false,""),
			new Land("Forest","Forest","Library",false,""),
			new Land("Forest","Forest","Library",false,""),
			new Land("Forest","Forest","Library",false,""),
			new Land("Forest","Forest","Library",false,""),
			new Creature("Woodland Druid",[0,0,0,0,1,0,0],1,2,"Library",false,false,false,false,0,""),
			new Creature("Woodland Druid",[0,0,0,0,1,0,0],1,2,"Library",false,false,false,false,0,""),
			new Creature("Grizzly Bears",[0,0,0,0,1,1,0],2,2,"Library",false,false,false,false,0,""),
			new Creature("Grizzly Bears",[0,0,0,0,1,1,0],2,2,"Library",false,false,false,false,0,""),
			new Creature("Grizzly Bears",[0,0,0,0,1,1,0],2,2,"Library",false,false,false,false,0,""),
			new Creature("Grizzly Bears",[0,0,0,0,1,1,0],2,2,"Library",false,false,false,false,0,""),
			new Creature("Frenzied Raptor",[0,0,0,1,0,2,0],4,2,"Library",false,false,false,false,0,""),
			new Creature("Frenzied Raptor",[0,0,0,1,0,2,0],4,2,"Library",false,false,false,false,0,""),
			new Creature("Lowland Giant",[0,0,0,2,0,2,0],4,3,"Library",false,false,false,false,0,""),
			new Creature("Lowland Giant",[0,0,0,2,0,2,0],4,3,"Library",false,false,false,false,0,""),
			new Creature("Hulking Devil",[0,0,0,1,0,3,0],5,2,"Library",false,false,false,false,0,""),
			new Creature("Hulking Devil",[0,0,0,1,0,3,0],5,2,"Library",false,false,false,false,0,""),
			new Creature("Rhox Brute",[0,0,0,1,1,2,0],4,4,"Library",false,false,false,false,0,""),
			new Creature("Rhox Brute",[0,0,0,1,1,2,0],4,4,"Library",false,false,false,false,0,""),
			new Creature("Ruination Wurm",[0,0,0,1,1,4,0],7,6,"Library",false,false,false,false,0,""),
			new Creature("Ancient Brontodon",[0,0,0,0,2,6,0],9,9,"Library",false,false,false,false,0,"")
	],
	hand: [],
	lands: [],
	creatures: [],
	graveyard: [],
	draw() {
		console.log("p1 draw");
		this.hand.push(this.library.shift());
	}
}

const player2 = {
	life: 20,
	library: [
			new Land("Plains","Plains","Library",false,""),
			new Land("Plains","Plains","Library",false,""),
			new Land("Plains","Plains","Library",false,""),
			new Land("Plains","Plains","Library",false,""),
			new Land("Plains","Plains","Library",false,""),
			new Land("Plains","Plains","Library",false,""),
			new Land("Plains","Plains","Library",false,""),
			new Land("Island","Island","Library",false,""),
			new Land("Island","Island","Library",false,""),
			new Land("Island","Island","Library",false,""),
			new Land("Island","Island","Library",false,""),
			new Land("Island","Island","Library",false,""),
			new Land("Island","Island","Library",false,""),
			new Land("Island","Island","Library",false,""),
			new Creature("Savannah lions",[1,0,0,0,0,0,0],2,1,"Library",false,false,false,false,0,""),
			new Creature("Savannah lions",[1,0,0,0,0,0,0],2,1,"Library",false,false,false,false,0,""),
			new Creature("Seagraf Skaab",[0,1,0,0,0,1,0],1,3,"Library",false,false,false,false,0,""),
			new Creature("Knight of New Benalia",[1,0,0,0,0,1,0],3,1,"Library",false,false,false,false,0,""),
			new Creature("Knight of New Benalia",[1,0,0,0,0,1,0],3,1,"Library",false,false,false,false,0,""),
			new Creature("Tolarian Scholar",[0,1,0,0,0,2,0],2,3,"Library",false,false,false,false,0,""),
			new Creature("Tolarian Scholar",[0,1,0,0,0,2,0],2,3,"Library",false,false,false,false,0,""),
			new Creature("Those Who Serve",[1,0,0,0,0,2,0],2,4,"Library",false,false,false,false,0,""),
			new Creature("Those Who Serve",[1,0,0,0,0,2,0],2,4,"Library",false,false,false,false,0,""),
			new Creature("Wishcoin Crab",[0,1,0,0,0,3,0],2,5,"Library",false,false,false,false,0,""),
			new Creature("Wishcoin Crab",[0,1,0,0,0,3,0],2,5,"Library",false,false,false,false,0,""),
			new Creature("Giant Octopus",[0,1,0,0,0,3,0],3,3,"Library",false,false,false,false,0,""),
			new Creature("Giant Octopus",[0,1,0,0,0,3,0],3,3,"Library",false,false,false,false,0,""),
			new Creature("Indomitable Ancients",[2,0,0,0,0,2,0],2,10,"Library",false,false,false,false,0,""),
			new Creature("Thraben Purebloods",[1,0,0,0,0,4,0],3,5,"Library",false,false,false,false,0,""),
			new Creature("Vizzerdrix",[0,1,0,0,0,6,0],7,7,"Library",false,false,false,false,0,"")
	],
	hand: [],
	lands: [],
	creatures: [],
	graveyard: [],
	draw() {
		console.log("p2 draw");
		this.hand.push(this.library.shift());
	}
}

$('#nextPhase').on('click', () => {
	game.updatePhase();
})

game.startGame();





















