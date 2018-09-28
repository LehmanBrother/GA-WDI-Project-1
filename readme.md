Game:
	Magic: The Gathering

View:
	Visible to all:
		-Battlefield (incl. lands and creatures)
		-Libraries
	Visible to active player (view will switch based on user input):
		-Hand

Gameplay:
	-On game start, players will be dealt hands of 7 cards from preset libraries of 60 cards in a random order
	-Players will have the choice to mulligan, shuffling their opening hand into their libraries and drawing a new hand of one fewer card (post MVP)
	-On a given player's turn, the following happens:
		-Player untaps any tapped lands or creatures
		-Player draws a card from the top of their library
		-Player may play up to one land
		-Player may tap lands to add mana that can be used to cast creature spells 
		-Player may attack with creatures
		-Opponent may block with their creatures
		-Damage is dealt, reducing life totals and destroying creatures
		-Turn switches
	-The game ends when one player's life is reduced to 0 or their library is empty and they must draw a card

Data:
	-Cards: images with the following attributes:
		Core (i.e. necessary to MVP):
			-Name
			-Type (e.g. land, creature)
			-Mana cost (colored and colorless mana)
			-Power
			-Toughness
		Supplementary:
			-Creature type
			-Abilities (e.g. flying, vigilance, trample, haste)
	-Libraries: arrays of cards
	-Hands: arrays of cards
	-Players: have hands, libraries, life totals, and permanents (lands and creatures on the battlefield)
	-Prompts: Instruct players to take actions
	-Controls: Allow players to take actions

Development Process:
	-Create card class (?)
		-Create land extension
			-Name
			-Type (PISMF)
			-Zone (library, hand, battlefield, graveyard)
			-Play function (move from hand to bf)
			-Tap function (add mana)
		-Create creature extension (use of all card functions is dependent on current player and phase of game)
			-Name
			-Mana cost (array? e.g. [w,u,b,r,g,a,c])
			-Power
			-Toughness
			-Zone (library, hand, battlefield, graveyard)
			-Tapped?
			-Attacking?
			-Blocking?
			-Current damage
			-Play function (move from hand to bf; uses mana)
			-Attack function (tap, become attacking)
			-Block function (become blocking)
			-Deal damage function (damages blockers/defending player; this will require more logic for multiple blockers)
			-Die function (disappear/go to graveyard)
	-Create game object
		-Properties:
			-Turn counter
			-Phase (untap, draw, main1, attack, block, main2, end)
		-Functions:
			-Start game (shuffles libraries, deals hands, issues initial prompt to player1)
			-Switch player (sets currentPlayer to 1 or 2)
	-Create player objects (question as to whether most actions should be functions of player or card or game...leaning towards card)
		-Properties: 
			-Life total
			-Library
			-Hand
			-Permanents (organization here may be tricky...probably array of lands and array of creatures)
			-Graveyard (post MVP?)
		-Functions: 
			-?





