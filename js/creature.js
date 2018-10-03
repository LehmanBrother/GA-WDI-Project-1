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
}