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
	phase: null,
	
}























