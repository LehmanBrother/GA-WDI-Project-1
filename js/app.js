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

/********************
Game Object	
********************/

const game = {
	turnCounter: 0,
	turnPlayer: null,
	activePlayer: null,
	activePlayerName: null,
	inactivePlayer: null,
	inactivePlayerName: null,
	activeLands: [],
	activeCreatures: [],
	inactiveLands: [],
	inactiveCreatures: [],
	phases: ["Untap","Draw","Main 1","Attack","Block","Damage","Main 2","End"],
	currentPhaseIndex: -1,
	currentPhase: null,
	landsPlayed: 0,
	payingMana: false,
	castingCard: null,
	manaReq: [0,0,0,0,0,0,0],
	startGame() {
		player1.life = 20;
		player2.life = 20;
		this.updateTurn();
		this.updateTurnPlayer();
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
	displayBattlefield() {
		$('#activeLandsDisplay').empty();
		$('#inactiveLandsDisplay').empty();
		$('#activeCreaturesDisplay').empty();
		$('#inactiveCreaturesDisplay').empty();
		//update active lands
		for(let i = 0; i < this.activePlayer.lands.length; i++) {
			const $cardImg = $('<img>');
			$cardImg.attr("src",this.activePlayer.lands[i].image);
			$cardImg.attr("class","card");
			$cardImg.attr("id","activeLand" + i);
			$('#activeLandsDisplay').append($cardImg);
			if(this.activePlayer.lands[i].isTapped === true) {
				$cardImg.rotate({
				      duration:1,
				      angle: 0,
				      animateTo:90
			    });
			}
		}
		//update inactive lands
		for(let i = 0; i < this.inactivePlayer.lands.length; i++) {
			const $cardImg = $('<img>');
			$cardImg.attr("src",this.inactivePlayer.lands[i].image);
			$cardImg.attr("class","card");
			$cardImg.attr("id","inactiveLand" + i);
			$('#inactiveLandsDisplay').append($cardImg);
			if(this.inactivePlayer.lands[i].isTapped === true) {
				$cardImg.rotate({
				      duration:1,
				      angle: 0,
				      animateTo:90
			    });
			}
		}
		//update active creatures
		for(let i = 0; i < this.activePlayer.creatures.length; i++) {
			const $cardImg = $('<img>');
			$cardImg.attr("src",this.activePlayer.creatures[i].image);
			$cardImg.attr("class","card");
			$cardImg.attr("id","activeCreature" + i);
			$('#activeCreaturesDisplay').append($cardImg);
			if(this.activePlayer.creatures[i].isTapped === true) {
				$cardImg.rotate({
				      duration:1,
				      angle: 0,
				      animateTo:90
			    });
			}
		}
		//update inactive creatures
		for(let i = 0; i < this.inactivePlayer.creatures.length; i++) {
			const $cardImg = $('<img>');
			$cardImg.attr("src",this.inactivePlayer.creatures[i].image);
			$cardImg.attr("class","card");
			$cardImg.attr("id","inactiveCreature" + i);
			$('#inactiveCreaturesDisplay').append($cardImg);
			if(this.inactivePlayer.creatures[i].isTapped === true) {
				$cardImg.rotate({
				      duration:1,
				      angle: 0,
				      animateTo:90
			    });
			}
		}
	},
	updateTurn() {
		this.turnCounter++;
		$('#turn').text("Turn " + this.turnCounter + ":");
	},
	updateTurnPlayer() {
		if(this.turnPlayer === player1) {
			this.turnPlayer = player2;
			this.turnPlayerName = "Player 2"
		} else {
			this.turnPlayer = player1;
			this.turnPlayerName = "Player 1"
		}
		$('#turnP').text(this.turnPlayerName);
		this.landsPlayed = 0;
	},
	updateActivePlayer() {
		if(this.activePlayer === player1) {
			this.activePlayer = player2;
			this.activePlayerName = "Player 2"
			this.inactivePlayer = player1;
			this.inactivePlayerName = "Player 1";
		} else {
			this.activePlayer = player1;
			this.activePlayerName = "Player 1"
			this.inactivePlayer = player2;
			this.inactivePlayerName = "Player 2";
		}
		$('#actP').text("Active Player: " + this.activePlayerName);
		this.activePlayer.showHand();
		this.activeLands = this.activePlayer.lands;
		this.activeCreatures = this.activePlayer.creatures;
		this.inactiveLands = this.inactivePlayer.lands;
		this.inactiveCreatures = this.inactivePlayer.creatures;
		this.displayBattlefield();
	},
	updatePhase() {
		if(this.currentPhaseIndex < this.phases.length - 1) {
			this.currentPhaseIndex++;
		} else {
			this.currentPhaseIndex = 0;
			if(this.turnCounter > 0) {
				if(this.turnPlayer === player2) {
					this.updateTurn();
				}
				this.updateTurnPlayer();
			}
		}
		this.currentPhase = this.phases[this.currentPhaseIndex];
		if(this.currentPhase === "Draw") {
			this.turnPlayer.draw();
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
	updateMana() {
		$('#wCount').text(": " + game.activePlayer.manaPool[0]);
		$('#uCount').text(": " + game.activePlayer.manaPool[1]);
		$('#bCount').text(": " + game.activePlayer.manaPool[2]);
		$('#rCount').text(": " + game.activePlayer.manaPool[3]);
		$('#gCount').text(": " + game.activePlayer.manaPool[4]);
		$('#cCount').text(": " + game.activePlayer.manaPool[5]);
		$('#wReq').text(game.manaReq[0]);
		$('#uReq').text(game.manaReq[1]);
		$('#bReq').text(game.manaReq[2]);
		$('#rReq').text(game.manaReq[3]);
		$('#gReq').text(game.manaReq[4]);
		$('#aReq').text(game.manaReq[5]);
		$('#cReq').text(game.manaReq[6]);
	},
	message(content) {
		$('#message').text(content);
	}
}

/********************
Player Objects	
********************/

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
			$cardImg.attr("src",player2.hand[i].image);
			$cardImg.attr("class","card hand");
			$cardImg.attr("id","hand" + i);
			$('#handDisplay').append($cardImg);
			player2.hand[i].zone = "Hand";
		}
	}
}

/********************
Listeners	
********************/

/********************
Move to next phase	
********************/
$('#nextPhase').on('click', () => {
	game.updatePhase();
})
	
/********************
Play lands, initiate casting of creatures
********************/
$('#handDisplay').on('click', (e) => {
	const card = game.activePlayer.hand[e.target.id.substring(e.target.id.length-1)];
	if(card.constructor.name === "Land" && game.landsPlayed === 0 && (game.currentPhase === "Main 1" || game.currentPhase === "Main 2") && game.turnPlayerName === game.activePlayerName) {
		game.landsPlayed ++;
		card.zone = "Battlefield";
		const $landImg = $('<img>');
		$('#activeLandsDisplay').append($landImg);
		$landImg.attr("src",card.image);
		$landImg.attr("class","card");
		game.activePlayer.lands.push(card);
		$landImg.attr("id","activeLand" + String(game.activePlayer.lands.length-1));
		game.activePlayer.hand.splice(e.target.id.substring(e.target.id.length-1),1);
		game.activePlayer.showHand();
		game.activeLands = game.activePlayer.lands;
	} else if(card.constructor.name === "Creature") {
		game.message("Click the mana symbols to cast a spell.");
		game.castingCard = card;
		game.manaReq = card.manaCost;
		game.payingMana = true;
		$('#wReq').text(card.manaCost[0]);
		$('#uReq').text(card.manaCost[1]);
		$('#bReq').text(card.manaCost[2]);
		$('#rReq').text(card.manaCost[3]);
		$('#gReq').text(card.manaCost[4]);
		$('#aReq').text(card.manaCost[5]);
		$('#cReq').text(card.manaCost[6]);
	}
})

/********************
Tap lands for mana
********************/
$('#activeLandsDisplay').on('click', (e) => {
	const card = game.activePlayer.lands[e.target.id.substring(e.target.id.length-1)];
	if(card.isTapped === false) {
		if(card.subtype === "Plains") {
			game.activePlayer.manaPool[0] += 1;
		} else if(card.subtype === "Island") {
			game.activePlayer.manaPool[1] += 1;
		} else if(card.subtype === "Swamp") {
			game.activePlayer.manaPool[2] += 1;
		} else if(card.subtype === "Mountain") {
			game.activePlayer.manaPool[3] += 1;
		} else if(card.subtype === "Forest") {
			game.activePlayer.manaPool[4] += 1;
		}
		game.updateMana();
		card.isTapped = true;
		$(e.target).rotate({
		      duration:1000,
		      angle: 0,
		      animateTo:90
	    });//currently can cause land to go partially off the screen--should be addressed eventually
	}
})

/********************
Spend Mana	
********************/
//clicking mana symbols will trigger spell cast once all manaReqs are 0
$('.mana').on('click', (e) => {
	if(e.target.id.substring(0,1) === "w") {
		if(game.manaReq[0] > 0) {
			game.manaReq[0]--;
			game.activePlayer.manaPool[0]--;
		} else if(game.manaReq[5] > 0) {
			game.manaReq[5]--;
			game.activePlayer.manaPool[0]--;
		}
	} else if(e.target.id.substring(0,1) === "u") {
		if(game.manaReq[1] > 0) {
			game.manaReq[1]--;
			game.activePlayer.manaPool[1]--;
		} else if(game.manaReq[5] > 0) {
			game.manaReq[5]--;
			game.activePlayer.manaPool[1]--;
		}
	} else if(e.target.id.substring(0,1) === "b") {
		if(game.manaReq[2] > 0) {
			game.manaReq[2]--;
			game.activePlayer.manaPool[2]--;
		} else if(game.manaReq[5] > 0) {
			game.manaReq[5]--;
			game.activePlayer.manaPool[2]--;
		}
	} else if(e.target.id.substring(0,1) === "r") {
		if(game.manaReq[3] > 0) {
			game.manaReq[3]--;
			game.activePlayer.manaPool[3]--;
		} else if(game.manaReq[5] > 0) {
			game.manaReq[5]--;
			game.activePlayer.manaPool[3]--;
		}
	} else if(e.target.id.substring(0,1) === "g") {
		if(game.manaReq[4] > 0) {
			game.manaReq[4]--;
			game.activePlayer.manaPool[4]--;
		} else if(game.manaReq[5] > 0) {
			game.manaReq[5]--;
			game.activePlayer.manaPool[4]--;
		}
	} else if(e.target.id.substring(0,1) === "c") {
		if(game.manaReq[6] > 0) {
			game.manaReq[6]--;
			game.activePlayer.manaPool[6]--;
		} else if(game.manaReq[5] > 0) {
			game.manaReq[5]--;
			game.activePlayer.manaPool[6]--;
		}
	}
	game.updateMana();
	if(game.manaReq[0] === 0 && game.manaReq[1] === 0 && game.manaReq[2] === 0 && game.manaReq[3] === 0 && game.manaReq[4] === 0 && game.manaReq[5] === 0 && game. manaReq[6] === 0) {
		game.castingCard.zone = "Battlefield";
		const $creatureImg = $('<img>');
		$('#activeCreaturesDisplay').append($creatureImg);
		$creatureImg.attr("src",game.castingCard.image);
		$creatureImg.attr("class","card");
		game.activePlayer.creatures.push(game.castingCard);
		$creatureImg.attr("id","activeCreature" + String(game.activePlayer.creatures.length-1));
		game.activePlayer.hand.splice(game.activePlayer.hand.indexOf(game.castingCard),1);
		game.activePlayer.showHand();
		game.castingCard = null;
		game.activeCreatures = game.activePlayer.creatures;
	}
})

/********************
Attack	
********************/
$('#activeCreaturesDisplay').on('click', (e) => {
	//tap creature, set to attacking (give red border to indicate attacking)
	//if not blocked, inactive player loses life
	//later add in attack phase req, summoning sickness
	const card = game.activePlayer.creatures[e.target.id.substring(e.target.id.length-1)];
	if(card.isTapped === false) {
		card.isAttacking = true;
		card.isTapped = true;
		$(e.target).rotate({
		      duration:1000,
		      angle: 0,
		      animateTo:90
	    });
	}
})

/********************
Change active player
********************/
$('#switchPlayers').on('click', (e) => {
	game.updateActivePlayer();
})

game.startGame();

//next step--attacking!
//further steps:
	//blocking
	//switching perspective
	//phase conditionals








