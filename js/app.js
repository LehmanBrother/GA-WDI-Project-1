console.log("Magic: The Gathering");

class Card {
	constructor(image,zone,visibility) {
		this.image = image;
		this.zone = zone;
		this.visibility = visibility;
	}
}

class Land extends Card {
	constructor(name,subtype,zone,isTapped,image) {
		super(image,zone);
		this.name = name;
		this.subtype = subtype;
		this.isTapped = isTapped;
	}
	play() {
		//if zone = hand and game.phase = main1/main2, change zone from hand to bf on click
		console.log('play a land');

	}
	tap() {
		//if zone = battlefield, turn corresponding img element sideways, isTapped = true, add corresponding mana type to mana pool
	}
}

class Creature extends Card {
	constructor(name,manaCost,power,toughness,zone,isTapped,isAttacking,isBlocking,isBlocked,currentDamage,image) {
		super(image,zone);
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
		console.log('play a creature');
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
		player1.showHand();
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
		//flip battlefield
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
		if(this.currentPhase === "Draw") {
			this.activePlayer.draw();
			// console.log(player1.hand);
			// console.log(player2.hand);
		}
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
			new Land("Mountain","Mountain","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=386610"),
			new Land("Mountain","Mountain","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=386610"),
			new Land("Mountain","Mountain","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=386610"),
			new Land("Mountain","Mountain","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=386610"),
			new Land("Mountain","Mountain","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=386610"),
			new Land("Mountain","Mountain","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=386610"),
			new Land("Mountain","Mountain","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=386610"),
			new Land("Forest","Forest","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=373625"),
			new Land("Forest","Forest","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=373625"),
			new Land("Forest","Forest","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=373625"),
			new Land("Forest","Forest","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=373625"),
			new Land("Forest","Forest","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=373625"),
			new Land("Forest","Forest","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=373625"),
			new Land("Forest","Forest","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=373625"),
			new Creature("Woodland Druid",[0,0,0,0,1,0,0],1,2,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=29772&type=card"),
			new Creature("Woodland Druid",[0,0,0,0,1,0,0],1,2,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=29772&type=card"),
			new Creature("Grizzly Bears",[0,0,0,0,1,1,0],2,2,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129586&type=card"),
			new Creature("Grizzly Bears",[0,0,0,0,1,1,0],2,2,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129586&type=card"),
			new Creature("Grizzly Bears",[0,0,0,0,1,1,0],2,2,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129586&type=card"),
			new Creature("Grizzly Bears",[0,0,0,0,1,1,0],2,2,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129586&type=card"),
			new Creature("Frenzied Raptor",[0,0,0,1,0,2,0],4,2,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=435300&type=card"),
			new Creature("Frenzied Raptor",[0,0,0,1,0,2,0],4,2,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=435300&type=card"),
			new Creature("Lowland Giant",[0,0,0,2,0,2,0],4,3,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=4829&type=card"),
			new Creature("Lowland Giant",[0,0,0,2,0,2,0],4,3,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=4829&type=card"),
			new Creature("Hulking Devil",[0,0,0,1,0,3,0],5,2,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=409919&type=card"),
			new Creature("Hulking Devil",[0,0,0,1,0,3,0],5,2,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=409919&type=card"),
			new Creature("Rhox Brute",[0,0,0,1,1,2,0],4,4,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=189650&type=card"),
			new Creature("Rhox Brute",[0,0,0,1,1,2,0],4,4,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=189650&type=card"),
			new Creature("Ruination Wurm",[0,0,0,1,1,4,0],7,6,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=366235&type=card"),
			new Creature("Ancient Brontodon",[0,0,0,0,2,6,0],9,9,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=435330&type=card")
	],
	hand: [],
	lands: [],
	creatures: [],
	manaPool: [0,0,0,0,0,0],
	graveyard: [],
	draw() {
		console.log("p1 draw");
		this.hand.push(this.library.shift());
		this.showHand();
	},
	showHand() {
		$('#handDisplay').empty();
		for(let i = 0; i < player1.hand.length; i++) {
			const $cardImg = $('<img>');
			$cardImg.attr("src",player1.hand[i].image);
			$cardImg.attr("class","card hand");
			$cardImg.attr("id","hand" + i);
			$('#handDisplay').append($cardImg);
			player1.hand[i].zone = "Hand";			
		}
	}
}

const player2 = {
	life: 20,
	library: [
			new Land("Plains","Plains","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=373582"),
			new Land("Plains","Plains","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=373582"),
			new Land("Plains","Plains","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=373582"),
			new Land("Plains","Plains","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=373582"),
			new Land("Plains","Plains","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=373582"),
			new Land("Plains","Plains","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=373582"),
			new Land("Plains","Plains","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=373582"),
			new Land("Island","Island","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=435426"),
			new Land("Island","Island","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=435426"),
			new Land("Island","Island","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=435426"),
			new Land("Island","Island","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=435426"),
			new Land("Island","Island","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=435426"),
			new Land("Island","Island","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=435426"),
			new Land("Island","Island","Library",false,"http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=435426"),
			new Creature("Savannah lions",[1,0,0,0,0,0,0],2,1,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=442022&type=card"),
			new Creature("Savannah lions",[1,0,0,0,0,0,0],2,1,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=442022&type=card"),
			new Creature("Seagraf Skaab",[0,1,0,0,0,1,0],1,3,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=409827&type=card"),
			new Creature("Knight of New Benalia",[1,0,0,0,0,1,0],3,1,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=442912&type=card"),
			new Creature("Knight of New Benalia",[1,0,0,0,0,1,0],3,1,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=442912&type=card"),
			new Creature("Tolarian Scholar",[0,1,0,0,0,2,0],2,3,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=447216&type=card"),
			new Creature("Tolarian Scholar",[0,1,0,0,0,2,0],2,3,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=447216&type=card"),
			new Creature("Those Who Serve",[1,0,0,0,0,2,0],2,4,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=426734&type=card"),
			new Creature("Those Who Serve",[1,0,0,0,0,2,0],2,4,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=426734&type=card"),
			new Creature("Wishcoin Crab",[0,1,0,0,0,3,0],2,5,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=452810&type=card"),
			new Creature("Wishcoin Crab",[0,1,0,0,0,3,0],2,5,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=452810&type=card"),
			new Creature("Giant Octopus",[0,1,0,0,0,3,0],3,3,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=83104&type=card"),
			new Creature("Giant Octopus",[0,1,0,0,0,3,0],3,3,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=83104&type=card"),
			new Creature("Indomitable Ancients",[2,0,0,0,0,2,0],2,10,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=152967&type=card"),
			new Creature("Thraben Purebloods",[1,0,0,0,0,4,0],3,5,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=230625&type=card"),
			new Creature("Vizzerdrix",[0,1,0,0,0,6,0],7,7,"Library",false,false,false,false,0,"http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=94911&type=card")
	],
	hand: [],
	lands: [],
	creatures: [],
	manaPool: [0,0,0,0,0,0],
	graveyard: [],
	draw() {
		console.log("p2 draw");
		this.hand.push(this.library.shift());
		this.showHand();
	},
	showHand() {
		$('#handDisplay').empty();
		for(let i = 0; i < player2.hand.length; i++) {
			const $cardImg = $('<img>');
			$cardImg.attr("src",player1.hand[i].image);
			$cardImg.attr("class","card hand");
			$cardImg.attr("id","hand" + i);
			$('#handDisplay').append($cardImg);
			player1.hand[i].zone = "Hand";
		}
	}
}

/********************
Listeners	
********************/

$('#nextPhase').on('click', () => {
	game.updatePhase();
})
	
$('#handDisplay').on('click', (e) => {
	const card = game.activePlayer.hand[e.target.id.substring(e.target.id.length-1)];
	if(card.constructor.name === "Land"/*eventually add requirement that phase be main and that a land has not already been played this turn*/) {
		card.zone = "Battlefield";
		const $landImg = $('<img>');
		$('#landsDisplay').append($landImg);
		$landImg.attr("src",card.image);
		$landImg.attr("class","card");
		game.activePlayer.lands.push(card);
		$landImg.attr("id","land" + String(game.activePlayer.lands.length-1));
		e.target.remove();
		game.activePlayer.hand.splice(e.target.id.substring(e.target.id.length-1),1);
		game.activePlayer.showHand();
	}
	console.log(card.zone);
})

$('#landsDisplay').on('click', (e) => {
	const card = game.activePlayer.lands[e.target.id.substring(e.target.id.length-1)];
	if(card.isTapped === false) {
		if(card.subtype === "Plains") {
			game.activePlayer.manaPool[0] += 1;
			$('#wCount').text(": " + game.activePlayer.manaPool[0])
		} else if(card.subtype === "Island") {
			game.activePlayer.manaPool[1] += 1;
			$('#uCount').text(": " + game.activePlayer.manaPool[1])
		} else if(card.subtype === "Swamp") {
			game.activePlayer.manaPool[2] += 1;
			$('#bCount').text(": " + game.activePlayer.manaPool[2])
		} else if(card.subtype === "Mountain") {
			game.activePlayer.manaPool[3] += 1;
			$('#rCount').text(": " + game.activePlayer.manaPool[3])
		} else if(card.subtype === "Forest") {
			game.activePlayer.manaPool[4] += 1;
			$('#gCount').text(": " + game.activePlayer.manaPool[4])
		}
		card.isTapped = true;
		$(e.target).rotate({
		      duration:1000,
		      angle: 0,
		      animateTo:90
	    });//currently can cause land to go partially off the screen--should be addressed eventually
	}
})

game.startGame();










