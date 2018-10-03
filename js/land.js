class Land extends Card {
	constructor(name,subtype,zone,isTapped,image) {
		super(image,zone);
		this.name = name;
		this.subtype = subtype;
		this.isTapped = isTapped;
	}
}