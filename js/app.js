console.log("Magic: The Gathering");

/********************
Game Object	
********************/

const game = {
	turnCounter: 0,
	turnPlayer: null,
	activePlayer: null,
	inactivePlayer: null,
	activeLands: [],
	activeCreatures: [],
	inactiveLands: [],
	inactiveCreatures: [],
	attackers: [],
	availableBlockers: [],
	unblockedAttackers: [],
	blockingManager: [],
	damageManager: [],
	currentLifeLost: 0,
	phases: ["Untap","Draw","Main 1","Attack","Block","Damage","Main 2","End"],
	currentPhaseIndex: -1,
	currentPhase: null,
	landsPlayed: 0,
	payingMana: false,
	castingCard: null,
	manaIndex: ["w","u","b","r","g","a","c"],
	manaReq: [0,0,0,0,0,0,0],
	handHidden: false,
	startGame() {
		player1.life = 20;
		player2.life = 20;
		this.updateTurn();
		this.updateTurnPlayer();
		this.updateActivePlayer();
		this.updatePhase();
		this.updateLife();
		this.shuffleLibrary(player1.library);
		this.shuffleLibrary(player2.library);
		this.dealHands();
		$('#inactiveCreaturesDisplay').html("<h2>Welcome to Magic: The Gathering! If you don't know how to play, you should probably visit <a href='https://magic.wizards.com/en/gameplay/how-to-play'>this site</a> (focus on the parts about creatures and lands). Otherwise, click the 'Next Phase' button to start!");
		this.message("Press the button to move to the next phase.");
	},
	shuffleLibrary(library) {
		//fisher-yates shuffle
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
	displayLands() {
		$('#activeLandsDisplay').empty();
		$('#inactiveLandsDisplay').empty();
		//DRY
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
	},
	displayCreatures() {
		$('#activeCreaturesDisplay').empty();
		$('#inactiveCreaturesDisplay').empty();
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
	assignBlockingDamage() {
		console.log("Assign blocking damage");
		//iterate through damageManager, assigning blocker damage to attacker
		for(let i = 0; i < this.damageManager.length; i++) {
			for(let j = 0; j < this.damageManager[i].blockers.length; j++) {
				this.damageManager[i].attacker.currentDamage += this.damageManager[i].blockers[j].power;
			}
		}
		//assign attacker damage to blockers in order
		for(let i = 0; i < this.damageManager.length; i++) {
			let damageToDeal = this.damageManager[i].attacker.power;
			for(let j = 0; j < this.damageManager[i].blockers.length; j++) {
				//if dTD <= toughness or only one blocker, deal dTD and set dTD to 0
				if(damageToDeal <= this.damageManager[i].blockers[j].toughness || this.damageManager[i].blockers.length === 1) {
					this.damageManager[i].blockers[j].currentDamage += damageToDeal;
					damageToDeal = 0;
				//else deal toughness
				} else if(damageToDeal > this.damageManager[i].blockers[j].toughness) {
					this.damageManager[i].blockers[j].currentDamage += this.damageManager[i].blockers[j].toughness;
					damageToDeal -= this.damageManager[i].blockers[j].toughness;
				}
			}
		}
	},
	assignUnblockedDamage() {
		console.log("Assign unblocked damage");
		//populate array of unblocked attackers
		for(let i = 0; i < this.attackers.length; i++) {
			if(this.attackers[i].isBlocked === false) {
				this.unblockedAttackers.push(this.attackers[i]);
			}
		}
		//subtract power from defender's life
		for(let i = 0; i < this.unblockedAttackers.length; i++) {
			this.currentLifeLost += this.unblockedAttackers[i].power;
		}
		this.inactivePlayer.life -= this.currentLifeLost;
		this.updateLife();
		this.unblockedAttackers = [];
		if(this.inactivePlayer.life <= 0) {
			this.message(this.activePlayer.name + " wins!");
		}
	},
	checkLethalDamage() {
		//for each creature array, remove all creatures with damage >= toughness
		for(let i = this.activeCreatures.length-1; i >= 0; i--) {
			if(this.activeCreatures[i].currentDamage >= this.activeCreatures[i].toughness) {
				this.activeCreatures.splice(i,1);
			}
		}
		for(let i = this.inactiveCreatures.length-1; i >= 0; i--) {
			if(this.inactiveCreatures[i].currentDamage >= this.inactiveCreatures[i].toughness) {
				this.inactiveCreatures.splice(i,1);
			}
		}
		//update divs; probably split into lands and creatures so lands don't twitch
		this.displayCreatures();
	},
	updateTurn() {
		this.turnCounter++;
		$('#turn').text("Turn " + this.turnCounter + ":");
	},
	updateTurnPlayer() {
		if(this.turnPlayer === player1) {
			this.turnPlayer = player2;
			this.turnPlayer.name = "Player 2"
		} else {
			this.turnPlayer = player1;
			this.turnPlayer.name = "Player 1"
		}
		$('#turnP').text(this.turnPlayer.name);
		this.landsPlayed = 0;
	},
	updateActivePlayer() {
		if(this.activePlayer === player1) {
			this.activePlayer = player2;
			this.activePlayer.name = "Player 2"
			this.inactivePlayer = player1;
			this.inactivePlayer.name = "Player 1";
		} else {
			this.activePlayer = player1;
			this.activePlayer.name = "Player 1"
			this.inactivePlayer = player2;
			this.inactivePlayer.name = "Player 2";
		}
		$('#actP').text("Active Player: " + this.activePlayer.name);
		this.activePlayer.showHand();
		this.activeLands = this.activePlayer.lands;
		this.activeCreatures = this.activePlayer.creatures;
		this.inactiveLands = this.inactivePlayer.lands;
		this.inactiveCreatures = this.inactivePlayer.creatures;
		this.displayLands();
		this.displayCreatures();
	},
	updatePhase() {
		//advance currentPhaseIndex
		if(this.currentPhaseIndex < this.phases.length - 1) {
			this.currentPhaseIndex++;
		} else {
			this.currentPhaseIndex = 0;
			if(this.turnCounter > 0) {
				if(this.turnPlayer === player2) {
					this.updateTurn();
				}
				this.activePlayer = this.turnPlayer;
				this.updateTurnPlayer();
				this.updateActivePlayer();
			}
		}
		//update currentPhase
		this.currentPhase = this.phases[this.currentPhaseIndex];
		if(this.currentPhase === "Untap") {
			//untap turnPlayer's lands
			for(let i = 0; i < this.turnPlayer.lands.length; i++) {
				if(this.turnPlayer.lands[i].isTapped) {
					this.turnPlayer.lands[i].isTapped = false;
					$('#activeLand' + i).rotate({
					      duration:1,
					      angle: 0,
					      animateTo: 0
				    });
				}
			}
			//untap turnPlayer's creatures
			for(let i = 0; i < this.turnPlayer.creatures.length; i++) {
				if(this.turnPlayer.creatures[i].isTapped) {
					this.turnPlayer.creatures[i].isTapped = false;
					$('#activeCreature' + i).rotate({
					      duration:1,
					      angle: 0,
					      animateTo: 0
				    });
				}
			}
			//reset creature damage
			for(let i = 0; i < this.activeCreatures.length; i++) {
				this.activeCreatures[i].currentDamage = 0;
			}
			for(let i = 0; i < this.inactiveCreatures.length; i++) {
				this.inactiveCreatures[i].currentDamage = 0;
			}
			this.message("Press the button to move to the next phase.");
			$('#end').css("border", "none");
			$('#untap').css("border", "3px solid steelblue");
		}
		if(this.currentPhase === "Draw") {
			$('h2').remove();
			this.turnPlayer.draw();
			this.message("Press the button to move to the next phase.");
			$('#untap').css("border", "none");
			$('#draw').css("border", "3px solid steelblue");
		}
		if(this.currentPhase === "Main 1") {
			$('#draw').css("border", "none");
			$('#main1').css("border", "3px solid steelblue");
		}
		if(this.currentPhase === "Main 1" || this.currentPhase === "Main 2") {
			this.message("If you haven't played a land this turn, click a land in your hand to play it.");
		}
		if(this.currentPhase === "Attack") {
			this.message("Click creatures you control to attack.");
			$('#main1').css("border", "none");
			$('#attack').css("border", "3px solid steelblue");
		}
		if(this.currentPhase === "Block") {
			for(let i = 0; i < this.inactiveCreatures.length; i++) {
				this.availableBlockers.push(this.inactiveCreatures[i]);
			}
			$('#attack').css("border", "none");
			$('#block').css("border", "3px solid steelblue");
		}
		if(this.currentPhase === "Block" && this.attackers.length > 0 && this.availableBlockers.length > 0) {
			this.message("Click an attacking creature to select it for blocking, then click your creatures to block.");
			this.updateActivePlayer();
			$('#battlefield').prepend('<button id="endBlocks">Done Blocking</button>');
			$('#endBlocks').on('click', () => {
				this.updateActivePlayer();
				this.message("Determine order of blockers by clicking your blocked creature, then its blockers in the order you wish to deal them damage.")
				$('#endBlocks').remove();
			})
		} else if (this.currentPhase === "Block") {
			this.message("Press the button to move to the next phase.");
		}
		if(this.currentPhase === "Damage") {
			this.assignBlockingDamage();
			this.assignUnblockedDamage();
			this.checkLethalDamage();
			if(this.inactivePlayer.life > 0) {
				this.message(this.inactivePlayer + " lost " + this.currentLifeLost + ". Press the button to move to the next phase.");
			}
			$('#block').css("border", "none");
			$('#damage').css("border", "3px solid steelblue");
		}
		if(this.currentPhase === "Main 2") {
			this.attackers = [];
			this.blockingManager = [];
			for(let i = 0; i < this.activeCreatures.length; i++) {
				this.activeCreatures[i].isAttacking = false;
				this.activeCreatures[i].isBlocking = false;
				this.activeCreatures[i].isBlocked = false;
			}
			for(let i = 0; i < this.inactiveCreatures.length; i++) {
				this.inactiveCreatures[i].isAttacking = false;
				this.inactiveCreatures[i].isBlocking = false;
				this.inactiveCreatures[i].isBlocked = false;
			}
			$('#damage').css("border", "none");
			$('#main2').css("border", "3px solid steelblue");
		}
		if(this.currentPhase === "End") {
			this.message("Press the button to move to the next phase.");
			$('#main2').css("border", "none");
			$('#end').css("border", "3px solid steelblue");
		}
		$('#phase').text("Current Phase: " + this.currentPhase);
	},
	updateLife() {
		$('#p1lt').text("P1 Life: " + player1.life);
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
	name: "Player 1",
	life: 20,
	library: rgInit,
	hand: [],
	lands: [],
	creatures: [],
	manaPool: [0,0,0,0,0,0],
	graveyard: [],
	draw() {
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
			$cardImg.on('mouseenter', (e) => {
				$cardImg.css('width', '160');
				$cardImg.css('height', '224');
			});
			$cardImg.on('mouseleave', (e) => {
				$cardImg.css('width', '80');
				$cardImg.css('height', '112');
			});
		}
	}
}

const player2 = {
	name: "Player 2",
	life: 20,
	library: uwInit,
	hand: [],
	lands: [],
	creatures: [],
	manaPool: [0,0,0,0,0,0],
	graveyard: [],
	draw() {
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
			$cardImg.on('mouseenter', (e) => {
				$cardImg.css('width', '160');
				$cardImg.css('height', '224');
			});
			$cardImg.on('mouseleave', (e) => {
				$cardImg.css('width', '80');
				$cardImg.css('height', '112');
			});
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
	if(card.constructor.name === "Land" && game.landsPlayed === 0 && (game.currentPhase === "Main 1" || game.currentPhase === "Main 2") && game.turnPlayer.name === game.activePlayer.name) {
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
		game.message("If you have enough lands in play, tap them to cast a creature.")
	} else if(card.constructor.name === "Creature") {
		game.message("Click the mana symbols to cast a creature.");
		game.castingCard = card;
		game.manaReq = Array.from(card.manaCost);
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
	    });
	    game.message("If you have enough mana, click a creature in your hand to cast it.")
	}
})

/********************
Spend Mana	
********************/
//clicking mana symbols will trigger spell cast once all manaReqs are 0
$('.mana').on('click', (e) => {
	const color = e.target.id.substring(0,1);
	const index = game.manaIndex.indexOf(color);
	if(game.activePlayer.manaPool[index] > 0) {
		const spendMana = () => {
			//if required mana of clicked color > 0, reduce mana pool and mana req of that color
			if(game.manaReq[index] > 0) {
				game.manaReq[index]--;
				game.activePlayer.manaPool[index]--;
			//otherwise, reduce generic mana pool and mana req
			} else if(game.manaReq[5] > 0) {
				game.manaReq[5]--;
				game.activePlayer.manaPool[index]--;
			}
		}
		spendMana();
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
			game.payingMana = false;
			game.activeCreatures = game.activePlayer.creatures;
		}
	}
})

/********************
Attack/Block
********************/
$('#activeCreaturesDisplay').on('click', (e) => {
	//tap creature, set to attacking (give red border to indicate attacking)
	//if not blocked, inactive player loses life
	//later add in summoning sickness
	//declare card
	const card = game.activePlayer.creatures[e.target.id.substring(e.target.id.length-1)];
	//attack
	if(game.currentPhase === "Attack") {
		if(card.isTapped === false) {
			card.isAttacking = true;
			card.isTapped = true;
			game.attackers.push(card);
			$(e.target).rotate({
			      duration:1000,
			      angle: 0,
			      animateTo:90
		    });
		}
	}
	//block
	if(game.currentPhase === "Block" && game.activePlayer.name !== game.turnPlayer.name) {
		console.log("Blocker trigger");
		if(card.isTapped === false && card.isBlocking === false) {
			card.isBlocking = true;
			game.blockingManager[game.blockingManager.length-1].blockers[game.blockingManager[game.blockingManager.length-1].blockers.length] = card;
			game.blockingManager[game.blockingManager.length-1].attacker.isBlocked = true;
			game.message(game.blockingManager[game.blockingManager.length-1].attacker.name + " is blocked by: " + game.blockingManager[game.blockingManager.length-1].blockers[game.blockingManager[game.blockingManager.length-1].blockers.length-1].name);
		}
	}
	//assign attacker damage
		//click blocked creature, then click its blockers in damage order
	if(game.currentPhase === "Block" && game.activePlayer.name === game.turnPlayer.name) {
		console.log("Begin determining attacker damage");
		const card = game.activePlayer.creatures[e.target.id.substring(e.target.id.length-1)];
		if(card.isAttacking && card.isBlocked) {
			game.damageManager.push({attacker: null,blockers: []});
			game.damageManager[game.damageManager.length-1].attacker = card;
			game.message("Now click this attacker's blockers in the order in which to damage them.")
		}
	}
})

$('#inactiveCreaturesDisplay').on('click', (e) => {
	//select attacker to block
	if(game.currentPhase === "Block" && game.activePlayer.name !== game.turnPlayer.name) {
		console.log("Blocked trigger");
		const card = game.inactivePlayer.creatures[e.target.id.substring(e.target.id.length-1)];
		if(card.isAttacking) {
			game.blockingManager.push({attacker: null,blockers: []});
			game.blockingManager[game.blockingManager.length-1].attacker = card;
			game.message("Choose untapped creatures to block this creature.");
		}
	}
	//determine order of blocker damage
	if(game.currentPhase === "Block" && game.activePlayer.name === game.turnPlayer.name) {
		console.log("Blocker order trigger");
		const card = game.inactivePlayer.creatures[e.target.id.substring(e.target.id.length-1)];
		//eventually add something else in here to guarantee that blocker and attacker are matched
		if(card.isBlocking) {
			game.damageManager[game.damageManager.length-1].blockers[game.damageManager[game.damageManager.length-1].blockers.length] = card;
		}
	}
})

/********************
Change active player
********************/
$('#switchPlayers').on('click', (e) => {
	game.updateActivePlayer();
})

/********************
Hide hand
********************/
$('#hideHand').on('click', () => {
	if(game.handHidden === false) {
		$('.hand').css('opacity', '0');
		game.handHidden = true;
		$('#hideHand').text('Show Hand');
	} else {
		$('.hand').css('opacity', '1');
		game.handHidden = false;
		$('#hideHand').text('Hide Hand');
	}
})

/********************
Hover to expand size of card
********************/

// $('#handDisplay').on('mouseenter', (e) => {
// 	console.log('mouseenter');
// 	const $cardImg = $('#hand' + e.target.id.substring(e.target.id.length-1));
// 	$cardImg.css('width', '160');
// 	$cardImg.css('height', '224');

// });

// $('#handDisplay').on('mouseleave', (e) => {
// 	console.log('mouseleave');
// 	const $cardImg = $('#hand' + e.target.id.substring(e.target.id.length-1));
// 	$cardImg.css('width', '80');
// 	$cardImg.css('height', '112');
// });

game.startGame();

//further steps:
	//Make it obvious to player when a block has happened/generally make message updates more consistent (replace important console logs with messages)

//much later
	//mulligans
	//add: vigilance; lifelink; trample; first strike; flying
	//have creatures go to graveyard when they die
	//cards to represent libraries
	//animation to move cards around






