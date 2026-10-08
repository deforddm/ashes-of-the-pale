/* ============ Through the Deck: visions ============
   When Tuft's turned card has a vision for this chapter, the card screen offers "✦ Look into the card": a short scene, third person
   present, from a canon character's eyes, of what the card is showing her. Choices change words, never outcomes (S.f.v*_ keys; nothing
   else reads them). Seen visions go in S.seenVisions and can be watched again from the journal. The hook is in cardSequence (21_);
   the journal list is visionsHTML()/bindVisions() (35_). DLG is defined later in the build (39_), so the nodes register when played. */
const VISIONS = {
  v1_paran:{ch:1, who:'Paran', where:"Hood's Gate", fig:'paran', bg:'gate', cap:'A grey plain under a white sky. No sun. A gate with no wall.', steps:[
    {go:'Walk to the gate.', txt:
`Paran is dead. He knows it the way he knows cold: not as news, as weather.

There were tent lines in the dark at Pale, and a lamp, and a recruit with a girl's face stepping close as if to ask him the way. There was a knife he never saw, only felt, going in under the ribs as neatly as a key into a lock. Then the mud was against his cheek, and then it wasn't.

Now there is a plain. Flat grey ground to every side, and a sky above it white and hard as a scoured pan. The light comes from everywhere and warms nothing. He is standing, which seems unfair. His hands are his own. There is no blood on his coat.

Ahead, a gate. Not in a wall: there is no wall. Only the gate, and it is made of people. Bodies, packed and wound together into posts and a lintel, and every one of them moving, slowly, the way a sleeper moves who can't wake. Beside it a figure waits with the patience of a thing that has never once been late.`},
    {txt:
`The gatekeeper is tall and grey and has a face the way a hill has one: there if you want it to be. It doesn't look at him so much as account for him. If it is Death's own face, it is a very ordinary one, and some part of Paran that was raised to have opinions about furniture is disappointed.

It wants his name. Not in words. The question is simply in him, the way thirst is.

Paran has stood in front of officers all his life. He knows this posture. He is being *processed*.`,
     ch:[{t:'"Ganoes Paran. Captain. I\'d like to lodge a complaint."', set:['v1_paranSaid','complaint']},
         {t:'"Paran. I wasn\'t finished."', set:['v1_paranSaid','unfinished']},
         {t:'Say nothing. Stand to attention.', set:['v1_paranSaid','silent']}]},
    {txt:()=>`${{complaint:`Something crosses the grey face that might be, in a better light, amusement. It is the only kindness he will be shown here, and it isn't much of one.`,
      unfinished:`*Nobody is*, the gatekeeper does not say, and he hears it anyway.`,
      silent:`The gatekeeper waits. Paran waits longer. It is the only victory on offer, and he takes it.`}[S.f.v1_paranSaid] || ''}

Then the coin.

He hears it before he sees it: a small bright ringing, a coin spun on a tabletop, going and going and refusing to fall. And there are two more at the gate who weren't there a moment ago. A young man and a young woman, alike as a pair of gloves, dressed for a party somewhere warmer. The man is bored already. The woman looks at Paran the way a buyer looks at a horse.

"This one," she says to the gatekeeper. Not to Paran. "We'll have this one back."`},
    {txt:
`They talk over his head, and Paran, who was raised in a noble house, finds he will not stand for it.

"And what does it cost me?" he says. "Whatever you're buying."

The woman looks at him properly for the first time, and likes what she sees about as much as a buyer likes a horse that bites. There is a price, she tells him; the gate gives nothing for nothing. Not his price. Someone else's. Someone close. Sooner than they should. He doesn't hear a name. He isn't meant to. He asks it twice, and is not answered twice, and understands that this is the bargain, and that the only part of it that is his to choose is whether to walk back through that gate or not.

The young man has noticed the sword at Paran's hip. "Nice blade," he says. "What do you call it?"`,
     ch:[{t:'"Chance."', set:['v1_paranSword','mine']},
         {t:'"Who\'s asking?"', set:['v1_paranSword','who']}]},
    {txt:()=>`${S.f.v1_paranSword === 'who' ? `"Oh, you *know* who's asking," says the young man. "And you know what you call it. You named it the day you bought it, years back, on a whim." He grins. "*Chance*. Did you think nobody heard?"` : `"*Chance*," says the young man, delighted, as if Paran had handed him a present. "Named it the day you bought it, on a whim, didn't you? And never once wondered who might hear."`} The woman doesn't smile. That, Paran understands, is why they are here.

The light changes. Not darker: thinner, as if something had been taken out of it. Shapes come across the plain at a lope, big as horses, and sit down at a polite distance, and Paran's hands remember Itko Kan before the rest of him does. The village. The dead in their doorways. The tracks.

Among the Hounds stands a figure made of shadow and bad temper, small and ragged, with a throne's worth of grievance in the set of its shoulders. It hisses at the Twins. It looks at Paran, and giggles.

He is looking at what killed those people. He finds he has bared his teeth, and is slow to notice. Then he tells it so, out loud, on Hood's own doorstep: that the day it comes through this gate, he will be on the far side, waiting for it. Smiling. It is the first thing on this plain that feels like his.

The shadow tilts its head. "Oh, send him back," it says, to nobody. "Let him run about. I want to see who he runs *to*."`},
    {bg:'room', go:'Wake.', txt:
`He wakes because something hurts, which is how he knows it's working.

On his back, in the mud, in the dark between the tents, with a lamp somebody has set down by his head and a surgeon swearing at him in a low, steady, professional voice. There is a hand pressed under his ribs where the knife went in, and something knitting there that is not the surgeon's doing.

He remembers a lane and a knife. Everything after is a word on the tip of his tongue. A gate. A price somebody else will pay. A promise he made, though he can't recall to whom.

The coin he can still hear, very faintly, somewhere in the dark. Spinning. And further off, beyond the tents, toward the cadre row, something begins to howl.`},
    {sp:'Tuft', fig:'tuft', bg:'deck', txt:
`The ringing stops. Tuft has her palm flat on the card, as if to keep it from getting up.

"He was dead," she says, very quietly. "I *watched* him be dead." Then she looks up the tent lines, toward the cadre row, where nothing is howling yet. "That hasn't happened, has it, Sergeant? Not yet." She puts the card away. Her hands are cold.`}]},

  v2_crone:{ch:2, who:'Crone', where:'The Pillar of Fire', fig:'crone', bg:'plainfire', cap:'The Rhivi Plain from very high up, going red at the edges.', steps:[
    {bg:'plainnight', go:'Circle lower.', txt:
`Crone is high, and cold, and pleased with herself, which is how she prefers to be.

The Rhivi Plain goes by beneath her like a hide pegged out to dry: grass, grass, a river like a dropped thread, grass. Her wings are older than most of the gods who'd claim to have made her, and they ache, and she ignores them. There's a chip in her beak she has had for longer than there have been cities. She has opinions about all of it.

Below, two figures on foot. A woman, fat and running, and behind her, following, a man the size of a small barn who would rather be anywhere else. Mages, both: she can taste it, the way you taste rain coming. And far off past them, two more, standing still to watch: a woman with a dry old cold on her that drinks sorcery the way sand drinks water, and beside her a thing that walks like a man and isn't.`},
    {bg:'plainnight', txt:
`She circles lower, because curiosity is the only vice she has never once regretted.

The woman stops running. Crone feels her reach for her warren, and reach, and find it heavy and dull, as if a hand were over its mouth. The big man catches up. He doesn't want to. And then the woman does a very foolish thing, or a very brave one. Crone has lived long enough to know those are usually the same thing.

She turns, and takes hold of him, and opens her warren. All of it.

The plain goes white.`},
    {txt:
`The fire goes up out of the grass like a tree grown in a heartbeat, root to crown, and the sound comes after, one flat *whump* that hits Crone under the wings and throws her up and sideways. She tumbles. She rights herself. She swears, in a language nobody has spoken for a hundred thousand years.

In the fire there are two shapes, and then, for a breath, there is one.

And there is more in it than fire. Crone hangs on the hot updraught and tastes. The woman's own warren, red and tidy. Under it something cold and very old, a sorceress who had been dead some days and had not finished being dead. Tellann's dust. And under all of that, faint as a smell in a closed room, a thing that has no business near a grass plain: the reek of *dragons*. A door that should stay shut, open a crack.`,
     ch:[{t:'Laugh.', set:['v2_croneSaid','laugh']},
         {t:'Count the warrens.', set:['v2_croneSaid','count']}]},
    {txt:()=>`${S.f.v2_croneSaid === 'count' ? `She counts, the way she counts everything. Five. Six. Seven. Seven warrens in one fire, on a grass plain, on an ordinary evening. She will dine out on this for a thousand years, if she can find anyone old enough to dine with.` : `"Ha!" she shouts at the fire, at the plain, at the whole stupid lovely world. Nobody laughs back. That's the trouble with the young: no sense of occasion.`}

Where the fire was, a black ring in the grass, and glass in the middle of it. In the glass, two shapes: the big one on his back, and the woman with her arms round him, holding on.

She'll go down later, on the way back south, and sit on the big one's shoulder while the glass ticks, because somebody always comes to look and she likes to see who. First, the news. She turns north, toward the warlord's fires, with it hot in her beak.`},
    {bg:'camp', txt:
`Brood's camp is hide tents and cookfires over three hills, and Rhivi children chase her shadow across it shrieking, which she allows.

The warlord sits on a log as if the log had been waiting for him all its life. He is enormous, unhurried, and smells of horse. The hammer leans beside him, and the ground under its head has the look of ground that knows what it is holding up. He listens. He doesn't interrupt. That is the thing about Caladan Brood she would never say to his face: he listens the way a mountain does. Slowly, and to everything.

She tells him the fire. She tells him the Twins are at their games again: the coin has a bearer now, somewhere south, a boy or near enough.

He is quiet a long time. Then, in a voice like stones settling: the bearer is to be left breathing. And her lord is not to go to war with an empire over a coin. *Tell him so. With my respect.*`},
    {bg:'camp', go:'Fly south.', txt:
`Behind him a man as grey and narrow as an old blade has been listening with his whole face. Kallor. He was the king of something once. Several somethings. As Crone lifts off he mutters a sentence about her lord that has the word *fool* in it, and also the word *soon*.

Crone hears it. Crone hears everything.

"My lord," she says to the wind on the long flight south, rehearsing. "My *lord*. You will not believe the day I have had."`},
    {sp:'Tuft', fig:'tuft', bg:'deck', txt:
`Tuft lets the card go. Her cheeks are wet and she hasn't noticed. Her hands smell of smoke, though there's no fire near enough to blame.`}]},

  v3_qb:{ch:3, who:'Quick Ben', where:'Shadowkeep', fig:'qb', bg:'shadow', cap:'Grey on grey, and towers that do not agree where they are.', steps:[
    {txt:
`Quick Ben walks into Shadow the way a man walks into a creditor's house: smiling, hands where they can be seen, already counting the exits.

It's grey here. Not dark: grey, the colour of a thing that has forgotten what colour it was. The ground is ash-soft and keeps no footprints, and there are shapes at the edge of seeing that are trees, or men, or neither. Somewhere a long way off, the Hounds are baying. He has heard them before. He makes a point of not listening for which way.

It doesn't help. The baying stops, and a little later there are Hounds pacing beside him in the grey, one on each side, big as horses and close enough to touch, not hurrying him. An escort. He has had worse. He can't, offhand, remember when.`},
    {txt:
`Shadowkeep comes up out of the grey like a bad decision: walls, towers, a gate, none of them agreeing with the others about where they are. The Hounds walk him in through the gate and across a courtyard and up to a door, and lie down outside it, and nobody else stops him. He files that.

The throne room is a great deal of floor and one chair. On the chair sits a smudge in a ragged cloak, all elbows and malice, drumming its fingers on the armrest with a sound like beetles.

"A visitor," says the god of the place. "A visitor, a visitor. Nobody visits. Do you know *why* nobody visits?"

"The furniture," says Quick Ben.`},
    {txt:
`He makes his offer. He has rehearsed it. There is a puppet out in the world with a madman's soul sewn into it, and the madman has learned things he shouldn't and is coming apart at the seams, and Shadow would very much like to have him. Quick Ben can say where. In return, the mark Shadow put on his name a long time ago, the standing order, the knife waiting in every dark, goes away. Clean.

The drumming stops. "Why," says Shadowthrone, "would you sell your own toy?"`,
     ch:[{t:'Push hard: "Because he\'s yours already. I\'m saving you the walk."', set:['v3_qbPush','hard']},
         {t:'Push soft: "Because he frightens me. That ought to interest you."', set:['v3_qbPush','soft']},
         {t:"Don't push. Smile, and wait.", set:['v3_qbPush','wait']}]},
    {txt:()=>`${{hard:`It's cheek. It's meant to be. Gods like cheek about as much as they like anything, which is to say they find it delicious right up until they don't.`,
      soft:`It's true, which is the best kind of bait. The god leans forward to sniff the fear in it, and enjoys it.`,
      wait:`He lets the silence do the talking. Silence is the one language he's sure the god speaks fluently.`}[S.f.v3_qbPush] || ''}

Shadowthrone agrees. Of course he does: it's a good bargain, and a god who sits on a throne made of other people's bad luck can never pass one up. A line is drawn somewhere Quick Ben can't see, and something in him that has been clenched for years lets go, a little.

He should leave now. He knows he should leave now.`},
    {txt:
`He doesn't, quite. He stays one breath too long, enjoying it, which is the oldest mistake there is, and he is ashamed of it even while he makes it.

The god's head comes up. Slowly. Something has occurred to it. It is looking at him the way a man looks at a face in a crowd that he last saw years ago, across a temple floor.

"Wait," says Shadowthrone. "*Wait.* I know you."

The name comes after it like a thrown knife, one of his old names, one he hasn't answered to in a long while, and the grey round the throne begins to fold in toward him like a closing hand.`},
    {bg:'room', go:'Breathe.', txt:
`Quick Ben is already gone.

He had the spell ready before he walked in. He always has the spell ready before he walks in. It opens under his feet like a trapdoor and he drops through into the reek of Chaos (a struck match, a slaughterhouse, a cold sea), and far behind and above him a god is shrieking about the terms of a contract it has just signed in good faith.

He lands on his back on a floor somewhere real. A ceiling. A spider. His own heartbeat, enormous.

"Done," he tells the spider. Then he laughs until his ribs hurt, very quietly, because Kalam is asleep in the next room and would want to know what was funny.`},
    {sp:'Tuft', fig:'tuft', bg:'deck', txt:
`Tuft blinks. "He *laughed*," she says, deeply disapproving, and puts the card away. Her hands are cold.`}]},

  v4_rallick:{ch:4, cards:['assassin'], who:'Rallick Nom', where:"Tarlow's Warehouse", fig:'rallick', bg:'warehouse', cap:'Tar, old rope and river. One lamp, and a great deal of dark above it.', steps:[
    {txt:
`Rallick Nom lies flat on the roof of Tarlow's warehouse with a crossbow under his hand, because he was told to. He does what the Guild tells him, mostly, and has done for years, and has never once enjoyed it.

The place stinks of tar and rope and river, even up here. Below, in the yard, Ocelot stands in the one patch of lamplight with his hands tucked in his sleeves, talking low. Ocelot likes talking. Tonight it's the war on the roofs: who the Guild blames, which is the Malazans, and what the Guild means to do about it, which is spring a trap. Rallick has walked two of them halfway here already. They'll come the rest of the way on their own.

Round the yard and on the roofs about it, a dozen of the clan. Crossbows, knives. Rallick can hear them breathe. He can hear them being pleased with themselves.`},
    {txt:
`He says nothing. He is a tall man in a plain coat and a cap, with a face like a shut door, and people tell him things to fill the silence, and he lets them.

Under his shirt, where nobody in the clan knows, he wears a coat of fine mail he paid too much for. He wears it because he doesn't believe a word Ocelot says about this war, and because people who believed things have been falling off roofs for weeks.`,
     ch:[{t:'"It isn\'t the Malazans."', set:['v4a_rallickSaid','say']},
         {t:'Keep it behind your teeth.', set:['v4a_rallickSaid','keep']}]},
    {txt:()=>`${S.f.v4a_rallickSaid === 'say' ? `He said it once, at the Phoenix, when Ocelot gave him tonight's work. Ocelot looked at him the way a man looks at a fly in his wine. "Then who, Nom?" Rallick had no answer he could prove. So here he is.` : `He keeps it. A man who says what he thinks in the Guild is a man who gets sent to lie on the roof of Tarlow's warehouse.`}

Behind him, something touches the roof.

Not a footstep. Less. The sound a cat would make if a cat weighed what a woman weighs and didn't want to be heard. Rallick's head comes up. Nobody else's does.`},
    {txt:
`They come down out of the sky like ink dropped in water. Tall, dark-skinned, grey-cloaked, falling onto the roofs and into the yard with no ropes and landing with no sound, and the killing starts before the first of them touches the ground. The lamp in the yard goes over. Somebody screams, and stops.

A quarrel takes Rallick between the shoulder blades like a big man's punch. It knocks the wind out of him and his face into the tar, and the mail holds, and he is still alive, which nobody on that roof expected. Least of all him.`},
    {txt:
`He rolls. He doesn't think. Thinking is for afterwards. One of them is coming along the ridge to finish him, a long blade low, moving like poured water, better than he is, much better; and for a quarter of a heartbeat it is surprised that the dead man has turned over. A quarter is enough. The crossbow is still under his hand, and he answers with it.

It falls. And then, while he's still looking at it, it isn't there. No body. No blood. A grey cloak on the tiles, settling, empty, the way a dust-sheet settles when you pull it off a chair.

Rallick does not stop to wonder at that. Wondering is also for afterwards.`},
    {bg:'roofs', go:'Run.', txt:
`Ocelot is at the foot of the yard wall, wrapped in some sorcery that makes him hard to look at, hissing his name. Rallick goes down to him, and they go out together into the alley and the river mist, running, and behind them in the yard the sounds go on for a while, and then don't.

Two streets on, Ocelot stops to be sick against a wall. Rallick stands over him and looks up. Against the glow of the blue lamps, something tall goes from one roofline to the next without troubling to jump.

"Malazans," Ocelot gasps. Rallick says nothing. He's thinking about the mail under his shirt, and how much more he'd have paid for it, had he known.`},
    {sp:'Tuft', fig:'tuft', bg:'deck', txt:
`Tuft lets the card go. "He didn't even look *down*," she says. "At the cloak." Her hands are cold.`}]},

  v4_hunter:{ch:4, cards:['knight'], who:'A Tiste Andii hunter', where:'The Roofs', fig:'andiihunter', bg:'roofs', cap:'Roof tiles and lake mist, and the blue fire of a city that does not look up.', steps:[
    {txt:
`She has been killing this city's assassins for weeks now, and she has stopped counting, which troubles her a little, on the nights she lets it.

She is Tiste Andii, and very old. She stands on a ridge of tiles above the harbour with the mist coming up between the buildings, and the human city glows round her in its absurd blue fire, and she finds it, as she always does, a little beautiful and a little sad. Short lives, lit very brightly.

Her lord has given an order. The Guild is to be ended, so that no one can buy it. She does not ask whether it is just. It is *necessary*. That word is older than *just*, and she has lived by it longer.`},
    {txt:
`Below, a warehouse yard, and the roofs round it. The prey has gathered there like moths round a lantern. Serrat's hand goes down, and they drop.

The work is quick. She has done it so often it has a shape, like a dance she knows too well to enjoy. Lamp, blade, the next one, the next. A man screaming in a language she has learned and never spoken.

One of them doesn't die. A tall one lying on the warehouse roof takes a quarrel between the shoulder blades and doesn't stay down, and her kinsman goes along the ridge to finish him, and the tall one turns over with a crossbow in his hands, and her kinsman is gone. She feels him go: a thread cut somewhere inside her that has been tied for longer than this city has stood.`,
     ch:[{t:'Go after the tall one.', set:['v4b_hunter','chase']},
         {t:'Hold. Count your own.', set:['v4b_hunter','count']}]},
    {txt:()=>`${S.f.v4b_hunter === 'chase' ? `She goes after him and loses him in the alleys, which has not happened to her in a very long time.` : `She holds, and counts her own, because someone must.`}

Back on the roofs she finds other hunters. Not the Guild's. Two men on a flat roof three streets over, watching the warehouse, and she knows at once that they are not of this city. One is big and dark and moves the way she moves: a killer who has been at it long enough to stop being proud of it. The other is slight, and smiling, and *wrong*, the air round him crowded, too many doors standing open in one small man.

Malazans. Further off, a handful more of them, soldiers, standing about on a rooftop as if roofs were a kind of field. Not hers tonight. She doesn't know any of their names. She thinks, without much interest, that she will learn the two men's from their graves.`},
    {txt:
`She is wrong about that.

The big one is fast. Not as fast as she is, but he doesn't need to be: he is never where her blade expects him. The small one does something with his hands, and the roof under her goes soft as wet sand. Two of her kin come out of the dark to help, and one of them stays down.

Then something enormous and pale unfolds itself out of the small one's sorcery, a demon, borrowed and bound and dressed in beautiful manners, and stands between her and them. She does not want to fight it. She does.

And then her lord is there.

She never sees him arrive. No one does. There is simply more dark on the roof than there was, and the long black sword, and a sound in it like chains, if she is careless enough to listen. The demon turns to face him, quite calmly, with something like relief.

When she looks again, the Malazans are gone.`},
    {bg:'spawn', go:'Stand where the loss can be seen.', txt:
`On the mountain, in a hall with no lamps, Serrat reports. The hunter stands at her shoulder, because she was there, and because she lost one, and someone must stand where the loss can be seen.

So many of the Guild. So many of their own. A Claw, perhaps, and a mage the like of which Serrat has not seen among humans. Serrat's voice is level. It costs her.

Their lord listens with his eyes half closed. When she is done he is pleased, and the hunter finds she does not like it: pleased that the Guild and the Empire's knives found each other in the dark, and that it was the humans who bled most. He thanks Serrat. He thanks the hunter, by name. He says the name of the one who did not come back.

That, she thinks, is why they still follow him. He remembers.`},
    {sp:'Tuft', fig:'tuft', bg:'deck', txt:
`Tuft lets the card go. "They're *sad*," she says, as if somebody had told her a secret. Her hands are cold.`}]},

  v4_crokus:{ch:4, cards:['oponn'], who:'Crokus', where:'The Jewels', fig:'crokus', bg:'garden', cap:'A rich man\'s garden on the hill, a vine, and a window left open for the heat.', steps:[
    {txt:
`Crokus Younghand is breaking into a house to give something *back*, which is a first, and he would like it noted that it is a great deal harder than stealing.

The D'Arle estate sits up the hill in its walled garden like a cat on a cushion. He goes over the wall, through the dark garden that smells of wet roses and fresh dung, and up the vine. It's the same vine, and the same balcony, and his heart is going as if he'd never done this before.

In his bag, a little heap of jewellery that isn't his. In his pocket, a coin that isn't either, though he couldn't tell you who he'd give it back to.`},
    {txt:
`Her window is open. Of course it is: it's warm and she's rich, and rich people think the world stops at their walls. He slides in. He has a speech. He worked on it all afternoon.

She's awake.

Challice D'Arle is sitting up in bed with the sheet pulled to her chin, staring at him, and she is going to scream, any moment now she is going to scream, and every word of the speech goes straight out of his head and over the balcony.`,
     ch:[{t:'"I\'ve brought your things back. Please don\'t scream."', set:['v4c_crokusSaid','back']},
         {t:'"I\'m going to court you. Properly. With, with permission and things."', set:['v4c_crokusSaid','court']}]},
    {txt:()=>`${S.f.v4c_crokusSaid === 'court' ? `She doesn't scream. She laughs, which is worse, and then stops laughing and looks at him properly, which is worse again. He puts the jewels on the coverlet, every piece, and says it again, slower. He'll come to the gate next time. In daylight. Properly.` : `She doesn't scream. She looks at the little heap of her own jewels on the coverlet, and at him, and something in her face changes, as if she'd been handed a puzzle and found she liked puzzles. And before he can stop himself he's telling her the rest: he'll come back. By the front gate next time, in daylight. He'll court her properly.`}

"You're a *thief*," she says.

"Retired," says Crokus, who has been retired for about four minutes.`},
    {txt:
`He goes out the way he came, ten feet tall, and halfway down the vine the coin in his pocket turns over.

He feels it: a little flip against his thigh, like a fish. He freezes. And across the garden, on top of the far wall where the shadow is deepest, someone is sitting. Watching him.

A girl. Slight, dark-haired, still as a post. He can't see her face. He can see that she's looking at him the way a heron looks at water, and something in his stomach curls up small.

Then somebody in the house shouts, and somebody else shouts back, and lamps come on in the windows one after another, and when he looks again the wall is empty.`},
    {bg:'roofs', go:'Run.', txt:
`He runs. He's good at running. Over the garden wall, over a shed, up a drainpipe, onto the roofs where the blue lamps lie below him like a second sky. The mist is coming up. He's laughing; he can't help it; he's laughing out loud with his heart going and his bag empty.

He doesn't think about the girl on the wall. He'll think about her later, at three in the morning, quite a lot.

The coin sits in his pocket, warm as a hand. He doesn't think about that either. He never does. That's rather the point of it.`},
    {sp:'Tuft', fig:'tuft', bg:'deck', txt:
`Tuft lets the card go, and finds she's smiling, and stops. "Somebody had a good night," she says. "Somebody in this city." Her hands are cold.`}]},

  v4_sorry:{ch:4, cards:['herald'], who:'Sorry', where:'The Garden Wall', fig:'sorry', bg:'garden', cap:'A wall above a garden. A guard with a lamp. Mist, and the shadows that will hold a body.', steps:[
    {txt:
`Sorry sits on a wall in the dark above a rich man's garden, and somewhere far down inside her a girl is trying to remember the word for *sea*.

The one who wears her doesn't notice the girl. He notices the garden: the one guard walking it with his lamp, the vine, the open window. He notices how the mist lies, and which shadows will hold a body. He has been noticing things like this for a very long time. He is very good at it, and he is tired, though he would not say so.

He is a god. He is using her the way a man uses a glove.`},
    {txt:
`What is left of the girl lives in the gaps. A smell of tar. Her father's hands mending net. A road, and an old woman on it, and something the old woman said that the girl can't hold on to. Each time she reaches for any of it, the one who wears her shifts his weight, and it slides away under him like sand.

She isn't afraid. Being afraid would take more of her than there is.`,
     ch:[{t:'Reach for the word.', set:['v4d_sorry','reach']},
         {t:'Stay still. Stay small.', set:['v4d_sorry','still']}]},
    {txt:()=>`${S.f.v4d_sorry === 'reach' ? `She reaches. For a heartbeat she has it: salt, and the cold green weight of water closing over her head when she was small, and her own voice, laughing. Then the god moves on the wall, and it's gone, and she can't remember what she was reaching for. Only that there was something.` : `She stays still. She has learned that much. Small things last longer, in here.`}

Below, a boy is climbing down a vine.

The god knows him at once. Not his name: his *luck*. It comes off him like heat off a stone, the Twins' coin turning over in his pocket, and the god's attention narrows on him the way a blade narrows on a whetstone.`},
    {txt:
`The guard is walking the wrong way. Toward the wall. Toward her.

The god doesn't hurry. He comes down off the wall into the shadow under it without a sound, and the guard sees a girl, a slip of a thing in a grey shawl, and his face does something kind and puzzled (*are you lost, miss?*), and that is the last thing his face does.

It's quick. It's very quick. The girl inside doesn't see it. She feels her own hands do it, and that is worse. Then the god lays the guard down on the grass as tidily as folded laundry, and steps back up onto the wall.`},
    {go:'Later.', txt:
`Shouting in the house. Lamps. The boy on the vine looks straight at her across the dark garden, and the god looks back, and for one long moment the Twins' luck and the Rope's patience regard each other over a dead man and a rose bed.

*Not here*, the god decides. Not in the city. Later, outside the walls, where things are simpler. And the two Malazans who have begun to watch her with that look, the dark one and the small one: them too. Later.

He has all the time in the world. That's the trouble with gods.

Deep inside, in a gap, the girl is still trying to remember the word for sea.`},
    {sp:'Tuft', fig:'tuft', bg:'deck', txt:
`Tuft turns the card face down, fast, as if it had been looking back at her. She doesn't say anything for a long time. Her hands are cold.`}]},

  v5_paran:{ch:5, who:'Paran', where:'Inside the Sword', fig:'paran', bg:'hills', cap:'Starlight on the Gadrobi Hills, a dead fire, and the next hill over.', steps:[
    {txt:
`Paran stands by a dead fire on a hillside with his sword in his hand and watches a puppet run for its life.

It goes over the crest in the starlight, small and jerking on its strings, toward the next hill. Hairlock. A mage of the Second, once; a soul sewn into painted wood. It has spent weeks trying to kill him, and tonight it threw his friend into a hole in the world.

And it is calling him. Not aloud. Inside his skull, in that warm, reasonable, grown man's voice that forgets it has no knees. *Captain. Captain, please. Help me. Throw me through, anywhere, and I'll give you anything. They're coming. Help me.*`,
     ch:[{t:'"No."', set:['v5_paranSaid','no']},
         {t:'"Ask Toc."', set:['v5_paranSaid','toc']},
         {t:'Say nothing at all.', set:['v5_paranSaid','nothing']}]},
    {txt:()=>`${{no:`"No," Paran says, under his breath, and finds that he means it all the way down.`,
      toc:`"Ask Toc," Paran says, under his breath. "Ask him, wherever you sent him." It isn't mercy. He doesn't pretend it is.`,
      nothing:`He says nothing. He lets the voice beg on into the silence and doesn't answer it, and that is his answer.`}[S.f.v5_paranSaid] || ''}

The strings go slack. Somebody, somewhere, has cut them. And the Hounds catch it on the next hill.

He watches. He makes himself. More of them than he can count in the dark, and one small shape among them, and then the small shape is in pieces. When the sound comes across the fold, wood and a man's voice going up, he doesn't look away, because the people of Itko Kan didn't get to.

Then they turn, and come down off the hill, and they are coming for him.

He doesn't run. There isn't anywhere. He walks out from the fire to meet them, and behind him there are soldiers getting up, too far off, much too far. The first Hound is on him and he is down under it with Chance in it to the hilt, and its jaws are at his shoulder; and then the dark behind it *thickens*, as if someone had poured more of it in. A tall shape inside the thickness. A long sword, black as a well. Two strokes, and two Hounds die, and the rest are simply not there any more.

And under the hill, all round, a sound like chains.`},
    {go:'Close your hand.', txt:
`The tall one stands over him in the starlight. Silver hair. Dark skin. Taller than a doorway. He leans on the black sword the way an old man leans on a stick, and Paran, who was raised among nobles and has stood before an empress, has never in his life been in the presence of anyone so entirely out of his reach.

"You don't learn, do you, mortal," the tall one says, as if remarking on the weather. "The Twins have let go of you, and in some haste. You're not their tool any more. Your sword is. When your luck turns, Captain, break it."

Then he is simply not there.

The dead Hound lies across Paran, huge and still, smaller somehow than it was alive. Its blood is over his chest and his arms and his hands, black in the starlight. He looks at it. He doesn't know why he does what he does next. He closes his hand on it.`},
    {bg:'wagon', fig:'', txt:
`There is a wagon.

It is enormous, a house on wheels, a town, and it groans forward through a grey with no sky in it, and it is pulled by chains, and the chains are fastened to people. Thousands. Bent nearly double, hauling, faces down: the ones who fell under the wheels and the ones still on their feet, all of them pulling. The sound is a whole army breathing and never resting.

A chained man beside him, old, with a face like a cracked plate, looks up long enough to say that the tall one put him here, a very long time ago, as if it were the weather. Then he looks down, and pulls.

At the end of two fresh chains, the Hounds. Alive here, in their way. Shackled. One of them comes at him to the end of its chain, and stops, and looks at him a long moment, and lets him be.`},
    {bg:'wagon', fig:'', go:'Drag.', txt:
`He calls on the Twins. He doesn't know how; he only knows he is owed.

And there's a coin. He can hear it, spinning, somewhere just behind his ear, and the young man's attention is on him like a hand on the back of his neck, sulky, put out, leaning closer to see what the toy will do. *The chains,* it tells him, as if he were very slow, *are held in Darkness. Everything in here is.*

Paran has been the toy long enough.

He turns, and takes hold of that attention the way you'd take a dog by the scruff, and *drags*. And the Hounds smell a god where no god belongs, and come up after it, dragging their chains, in two long strides, and Paran runs with them, holding the Twin out ahead of him like a lantern on a pole, through the grey, into a darkness that isn't this one: an older and deeper night.

He lets go. The Hounds go into it, chains and all, and are gone. The coin stops.`},
    {go:'Walk back to the fire.', txt:
`He is lying on a hillside in the Gadrobi Hills with his hand on the grass.

No Hounds. Nobody saw anyone take them; there is only torn turf where they lay, and a stain the frost won't settle on. The dark has gone off the hill like a tide going out, and there are stars, and a puppet's strings lying in the grass of the next hill like cobweb.

His hand is shaking. It's black to the wrist, and there's something in it now, under the skin, that wasn't there before. It smells of rain on a dog's back. He wipes it on his coat. It doesn't come off.

He gets up. Nobody at the fire asks where he's been. At dawn, he'll ride.`},
    {sp:'Tuft', fig:'tuft', bg:'deck', txt:
`Tuft's thumb is resting on the card, on the grey figure at the door. She takes it away. "Not yet," she says, to nobody. "That's *tonight*. It hasn't happened yet." Her hands are cold.`}]},
  v6_rake:{ch:6, who:'Anomander Rake', where:'The Belfry', fig:'rake', bg:'belfry', cap:'A bell-tower roof over a city of masks, and a black mountain over the lake.', steps:[
    {txt:
`Anomander Rake sits on the roof of K'rul's belfry with his back to the bell-housing and his sword across his knees, and he is tired.

He left Lady Simtal's party a little while ago, before the old priest in the Jaghut mask took it off; his glass is still on her balustrade, untouched. Below him, the city of blue fire on the night of the Fete. Masks and music and the smell of a hundred kitchens, and under it, if he lets himself, the other smell: gas in the deep conduits, and earth turned in a garden where something was buried today that should not have been. He doesn't let himself, yet. He has a few minutes. He has had very few minutes, in a very long life, and he has learned to sit still in them.

Over the lake hangs his fortress, hurt. He can feel the cracks in it the way an old soldier feels rain in his knee.`},
    {txt:
`He isn't alone up here. He hasn't been since he climbed. The other one is very faint, a smell of old incense and dust, an outline made mostly of the wind not blowing: the god whose temple this was, before the city forgot his name.

They talk. Not much. Two old men on a bench. K'rul says he cannot help tonight; he has nothing left to help with. Rake says he knows. Rake says the temple will stand, whatever else falls, and finds that he means it.

"You're weary," says K'rul.`,
     ch:[{t:'"Of everything. Except this."', set:['v6_rakeSaid','except']},
         {t:'"It passes. It always passes. That\'s the worst of it."', set:['v6_rakeSaid','passes']}]},
    {txt:()=>`${S.f.v6_rakeSaid === 'passes' ? `The old god makes a sound that might be a laugh, if dust could laugh. Neither of them says anything for a while after that. It's companionable.` : `He looks down at the lit streets as he says it, and the god who made the warrens doesn't ask what *this* is.`}

Then something comes up into the sky out of the Daru District, down the hill.

He feels it before he sees it, a wrongness in the air like a bad tooth. A demon lord of the Galayn, let off its leash by someone who wants him spent (he can guess who; the Empress keeps an Adjunct for exactly this), and it comes toward his roof with all its considerable patience. As he watches, it stops pretending to be a shape a city would recognise, and spreads, and becomes a dragon.

A courtesy, almost. It wants to meet him on his own ground.`},
    {fig:'', bg:'sky', go:'Step off the roof.', txt:
`Rake stands. The bell-housing creaks behind him.

"Mind the temple," he says to the dust, and steps off the roof.

He doesn't fall. The change takes him on the way down, the way it always does, like a wave taking a swimmer: and then he is wide black wings over a lake of blue lamps, and the air is a road, and the demon is ahead, and every masked face in every street below turns up at once.

They meet over the city. It isn't beautiful. It's two enormous things trying very hard to kill each other a thousand feet above a party: claws and teeth and sorcery coming off them in sheets that light the roofs green and white. The demon is strong. The demon is very strong.

He is older.`},
    {bg:'garden', txt:
`It breaks first. It falls away from him burning and goes down among the great houses of the Estate District like a thrown torch, into a street, through the end of a wall and the wards on it, which scream as they come apart. Baruk's wall. Of course. This city has a habit of putting its best people in the way.

Rake comes down after it, a man again, the sword in his hand. The demon has made itself a man too: huge, scorched, getting up out of the rubble in the street, and talking. Not to him. To a boy standing white-faced at Baruk's gate, a skinny boy, a thief by the look of him, with a coin on him that Rake can smell from here. The demon is offering him a way out of the city, safe, with the Empress's blessing. The boy is nodding.

"Galayn," says Rake, behind it.

The demon turns. It makes him the same offer, very reasonably: the Empress will let him go, too. He has only to leave.`,
     ch:[{t:'"No."', set:['v6_rakeNo','no']},
         {t:'Draw the sword. That is the answer.', set:['v6_rakeNo','draw']}]},
    {bg:'garden', go:'Lean on the sword.', txt:()=>`${S.f.v6_rakeNo === 'draw' ? `He draws. It is the only answer he has ever given that kind of offer.` : `"No," he says, and draws.`}

It has an axe, and it is good with it. He takes the axe on the shoulder, blocking, and feels the bone ache under the cut; and then he is inside its reach, and Dragnipur goes in.

He feels the demon arrive inside the sword: the chain closing, the new weight on the wagon, one more soul pulling in the grey for ever. He feels, as he always feels, that he has done something necessary and something unforgivable, and that they are the same thing, and that he will carry it.

He is bleeding. He notices that after a while.

The boy is staring at him. "Brood asked me to let you live," Rake tells him, leaning on the sword. "I find I can. Baruk is in trouble in there, and I am in no state to help him. Go." And the boy goes, through the broken wall, at a run. The night of the Fete isn't over yet.`},
    {sp:'Tuft', fig:'tuft', bg:'deck', txt:
`Tuft has her hand over the card as if to keep it warm. "Tonight," she says. "It's *tonight*, Sergeant. Over us." She looks up at a sky with nothing in it. Yet. Her hands are cold.`}]},

  v7_lorn:{ch:7, who:'Adjunct Lorn', where:'The Last Walk', fig:'lorn', bg:'garden', cap:'Lady Simtal\'s garden at dusk, earth under her nails, and music behind the hedge.', steps:[
    {txt:
`Adjunct Lorn kneels in Lady Simtal's garden with earth under her fingernails and an acorn in her palm, and for a moment she can't remember how to open her hand.

It's a small thing. Black, and hard, and heavier than an acorn has any right to be. Inside it is the power of a Jaghut tyrant: the thing that will call him to this garden tonight, so that the Lord of Moon's Spawn must come and fight him and be spent, and the city fall into the Empress's lap like ripe fruit. She has carried it across the hills. She has carried it under the earth. She has carried worse.

She opens her hand. She puts it in the hole. She covers it.`},
    {txt:
`Behind the hedge, people are laughing. The Fete. Music and masks. She thinks, very clearly, of a street in Malaz City a long time ago, and of her mother's hands, and of fire; and then she stops thinking it, with the ease of long practice.

Her shoulders are shaking. She notes it, the way she'd note a fault in a subordinate, and waits for it to stop. It takes longer than it should.

When it stops she stands and brushes the earth from her knees, and decides. The boy with the coin. The Twins' boy. She will finish that, at least, herself. One clean thing at the end of all this, done with her own hand.`,
     ch:[{t:'For the Empire.', set:['v7_lornFor','empire']},
         {t:'For no one. It is what is left to do.', set:['v7_lornFor','none']}]},
    {bg:'alley', txt:()=>`${S.f.v7_lornFor === 'none' ? `She doesn't tell herself it's for the Empire. She's too tired to lie to herself as well.` : `*For the Empire*, she tells herself, and the words come out worn smooth as a step.`}

Hours later, in the dark, she feels the tyrant fall.

Somewhere past the garden walls there is a great cold shout in the earth, then a silence, then something old being dragged down into roots. She stands very still in a side street and feels the whole plan go out of the world like a blown lamp. Raest, taken. The city, standing. Whiskeyjack, she has heard, still alive. Everything she has bled for since Pale, gone in a breath.

She has one thing left. The High Mage's gift, carried all the way from Pale: a demon lord of the Galayn, bound small and waiting to be let out.

She lets it out. Over the Daru roofs, something vast unfolds and goes looking for the Lord of Moon's Spawn. She doesn't watch it go.`},
    {bg:'alley', txt:()=>
`The boy is easy to find. Luck leaves a trail, if you know what it smells like.

She finds him in a narrow alley off the Daru District, under the low black weight of the floating mountain, and puts him against the wall with her left hand flat on his chest and her sword in her right. He stops struggling. She sees his face. Young. So young. She lifts the blade.${S.f.c6_key === 'alley' ? (S.f.c6_steppedIn ? `

And between her and him, for far longer than it should have taken, a squad of her own Empress's marines in some lady's blue, shields locked, who will not move, and will not tell her why.` : `

At the alley mouth, a squad of her own Empress's marines in some lady's blue stands aside to let her work, as they should. She does not look at them again.`) : ''}

Another blade meets hers.

A squat, dark man in a faded crimson cloak, out of a doorway that was empty, with a plain sword in each hand: quick, quiet, and better than she is, and she has not met many of those. Steel rings on steel. Her sword, that kills sorcery, is only a sword against a man who isn't using any, and he knows it. Two blades against her one. One of them opens her shoulder.

She breaks off. She goes up the alley past the blue lamp, fast, very nearly running. She has never run from anything in her life. She is not running now. Very nearly.`},
    {bg:'alley', fig:'lorn', txt:
`Another alley, down toward the lake. A rain-barrel. Wet stone, and the smell of the water at the end of it. She stops to breathe, with her hand pressed to her shoulder and the blood coming through her fingers, and leans on the wall.

Two women come into the alley. Not soldiers. A big one in an apron with a cudgel over her shoulder, and a lean one beside her with a kitchen knife held down along her leg. Innkeepers, by the look of them; somebody's aunts. Lorn straightens to tell them to move along.

The cudgel comes before she has finished straightening. The knife follows it. They don't say anything. They don't need to. Then they're gone, and she is lying on her back in the wet without having decided to, and the sky between the walls is very far away.`},
    {bg:'alley', fig:'paran', txt:
`Footsteps. A man kneeling, lifting her head off the stones onto his knee. She knows the face, though it takes her a moment. Paran. Her captain, once. The young officer she took off the road at Itko Kan because he looked as if he might be worth something.

He looks, now, like something that has died and come back. She supposes that's fair.

She tries to tell him something. She isn't sure what. That she was right. That she wasn't. That the Empress… no. He doesn't help her finish, and she is grateful for that.

The last thing she feels is the easing: a small, tired thing, like taking off her boots at the end of a long road.`},
    {sp:'The Deck of Dragons', bg:'alley', fig:'paran', txt:
`Then the card shows only this: a man closing a dead woman's eyes, and taking up her plain sword, and putting it through his belt beside his own empty scabbard; and then carrying her up a dark alley in his arms like a sleeping child. He doesn't look up. He doesn't put her down.`},
    {sp:'Tuft', fig:'tuft', bg:'deck', txt:
`Tuft lets the card go. "She was *afraid*," she says at last. "The whole time. I didn't know she could be." Her hands are cold.`}]},
};
const VISION_IDS = Object.keys(VISIONS);
/* which vision the turned card opens this chapter: Ch4 keys its four by card; every other chapter has one, for any card */
function visionFor(ch, card){
  if (!ch || !card || card === 'blank') return null;
  const vs = VISION_IDS.filter(k => VISIONS[k].ch === ch);
  return vs.find(k => VISIONS[k].cards && VISIONS[k].cards.includes(card)) || vs.find(k => !VISIONS[k].cards) || null;
}
let VIS = null; // the vision playing: {id, done, ret, resume, bg, fig}
/* watched again from the journal: the closing beat is Tuft in the present, so it changes; without her, the card just goes dark */
const visAgain = st => !!(VIS && VIS.replay && st.sp === 'Tuft');
const visTuftHere = () => !!(S && S.squad && S.squad.includes('tuft') && !(S.dead && S.dead.tuft));
function visNodes(id){
  const V = VISIONS[id], n = V.steps.length;
  V.steps.forEach((st, i) => { DLG[`vis_${id}_${i}`] = () => { const last = i === n - 1, nx = last ? () => visEnd() : `vis_${id}_${i + 1}`;
    if (visAgain(st)) return {sp:visTuftHere() ? 'Tuft' : 'The Deck of Dragons', onshow:() => visStep(id, i), ch:[{t:'Put the cards away.', go:nx}],
      txt:visTuftHere() ? (VIS.again ? `Tuft lets the card go. She has watched this one before. It doesn't get any easier, and she doesn't say anything. Her hands are cold.` : `Tuft lets the card go. She doesn't say anything for a long time. Her hands are cold.`) : `The card goes still, and dark, and is only paint and wood again.`};
    return {sp:st.sp || V.who, txt:typeof st.txt === 'function' ? st.txt() : st.txt, onshow:() => visStep(id, i),
      ch:st.ch ? st.ch.map(c => ({t:c.t, fx:() => { S.f[c.set[0]] = c.set[1]; }, go:nx})) : [{t:st.go || (last ? 'Put the cards away.' : 'Go on.'), go:nx}]}; }; });
}
/* each step: its backdrop and figure; and the save never points at a vision node, so a reload comes back where the vision began */
function visStep(id, i){
  if (!VIS) return; const V = VISIONS[id], st = V.steps[i];
  VIS.bg = st.bg || V.bg; VIS.fig = st.fig != null ? st.fig : V.fig; VIS.step = i;
  if (visAgain(st) && !visTuftHere()) VIS.fig = '';
  const sh = $('#sheet'); if (sh) sh.classList.add('vsheet');
  S.node = VIS.resume || null; save();
}
function playVision(id, done){
  const V = VISIONS[id]; if (!V || typeof DLG === 'undefined') return done && done();
  visNodes(id);
  S.seenVisions = S.seenVisions || []; const again = S.seenVisions.includes(id); if (!again) S.seenVisions.push(id);
  const ret = {view, kind:G.sceneKind, bg:S.bg, node:S.node}, cardNode = 'c' + S.chapter + '_card';
  VIS = {id, ret, replay:!done, again, done:done || (() => { if (ret.node && DLG[ret.node]) talk(ret.node); }), resume:done ? (DLG[cardNode] ? cardNode : ret.node) : ret.node, bg:V.bg, fig:V.fig, t0:performance.now()};
  $('#sheet').hidden = true; $('#modal').hidden = true; routeAnim = null;
  document.body.classList.add('vision');
  view = 'scene'; B = null; G.sceneKind = 'vision'; AUDIO.setScene('dark'); AUDIO.play('reveal');
  toTop(); $('#app').innerHTML = `<header class="hud vhud"><div><div class="kick">Through the Deck</div><div class="loc">${esc(V.who)}</div><div class="sub warren">${esc(V.where)}</div></div></header>
    <div class="scene vscene"><canvas id="vcv" width="560" height="240"></canvas><div class="vtitle"><span>Through the Deck</span><b>${esc(V.who)} · ${esc(V.where)}</b></div><div class="cap">${esc(V.cap)}</div></div>`;
  visPaint();
  talk(`vis_${id}_0`);
}
function visEnd(){
  const v = VIS; VIS = null; document.body.classList.remove('vision'); const sh = $('#sheet'); if (sh) sh.classList.remove('vsheet');
  if (!v) { const n = 'c' + S.chapter + '_card'; if (DLG[n]) talk(n); else startExplore(); return; }
  const r = v.ret; S.bg = r.bg; G.sceneKind = null; S.node = null;
  if (r.view === 'explore') startExplore(); else if (r.view === 'scene' && r.kind && r.kind !== 'vision') sceneShell(r.kind);
  save(); v.done();
}
/* the backdrop: a few strokes per place, a figure, drifting motes, and the violet of the Deck over all of it */
function visPaint(){ const cv = $('#vcv'); if (!cv) return; const f = t => { if (!cv.isConnected || !VIS) return; try { drawVision(cv, VIS, t - VIS.t0); } catch(e) { console.warn('vision', e); return; } requestAnimationFrame(f); }; requestAnimationFrame(f); }
function drawVision(cv, v, t){
  const {ctx, W, H} = sceneFit(cv), k = v.bg, mo = REDUCE() ? 0 : 1, T = t * mo;
  const SK = {gate:['#c9c4d4','#7e7a8c'], plainfire:['#1c1424','#4a2a30'], plainnight:['#0a0912','#1e1a2c'], camp:['#0c0a14','#241c2a'], shadow:['#34323c','#18171c'], room:['#1a1412','#0c0a09'],
    warehouse:['#0c0a0c','#18141a'], roofs:['#0e0c1a','#262040'], spawn:['#050408','#0e0c16'], garden:['#0e0b16','#1e1828'], hills:['#06050c','#16142a'], wagon:['#2a2830','#141318'],
    belfry:['#0a0816','#262044'], sky:['#0c0a1c','#2c2450'], alley:['#07060b','#14121c'], dawn:['#2a2836','#6a6070'], deck:['#050404','#120e10']}[k] || ['#0a0910','#1a1824'];
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, SK[0]); g.addColorStop(1, SK[1]); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const stars = n => { ctx.fillStyle = 'rgba(220,210,255,.6)'; for (let i=0;i<n;i++){ const a = .4 + .6*Math.abs(Math.sin(T/900 + i)); ctx.globalAlpha = a; ctx.fillRect(hash(i,1)*W, hash(i,2)*H*.55, 1.2, 1.2); } ctx.globalAlpha = 1; };
  const ground = (y, c, wob = 6, seed = 0) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, H); for (let x=0;x<=W;x+=W/24) ctx.lineTo(x, y + Math.sin(x/W*6 + seed)*wob + hash(Math.round(x), seed)*wob*.4); ctx.lineTo(W, H); ctx.fill(); };
  const lamps = (y, n) => { for (let i=0;i<n;i++){ const x = hash(i,7)*W, yy = y + hash(i,8)*(H - y)*.8; glow(ctx, x, yy, 18, '#6aa0ff', .35 + Math.sin(T/400 + i)*.05); ctx.fillStyle = '#bcd6ff'; ctx.fillRect(x - .8, yy - .8, 1.6, 1.6); } };
  const spawnRock = (x, y, s) => { poly(ctx, [[x - s, y],[x - s*.6, y - s*.25],[x, y - s*.32],[x + s*.7, y - s*.2],[x + s, y],[x + s*.4, y + s*.45],[x - s*.2, y + s*.6],[x - s*.6, y + s*.3]], '#050408'); };
  let fx = W*.32, fy = H*.86, fs = 2.4, air = false;
  if (k === 'gate') { ground(H*.7, '#5e5a6a', 2); ctx.fillStyle = '#ece8f2'; ctx.fillRect(W*.6, H*.3, 7, H*.42); ctx.fillRect(W*.74, H*.3, 7, H*.42); ctx.fillRect(W*.59, H*.27, W*.16, 6);
    drawFigure(ctx, 'stone', W*.82, H*.74, 2.6, t, {still:true, dir:-1, alpha:.55}); }
  else if (k === 'plainfire' || k === 'plainnight' || k === 'camp') { stars(40); ground(H*.72, '#120e14', 3, 1);
    if (k === 'plainfire') { const fl = .8 + Math.sin(T/70)*.1 + Math.sin(T/23)*.05; glow(ctx, W*.64, H*.6, W*.5, '#ff7a30', .35*fl); const pg = ctx.createLinearGradient(0, 0, 0, H*.72); pg.addColorStop(0, 'rgba(255,220,150,0)'); pg.addColorStop(.3, `rgba(255,180,90,${.7*fl})`); pg.addColorStop(1, 'rgba(255,240,200,.95)'); ctx.fillStyle = pg; ctx.fillRect(W*.64 - 9 - Math.sin(T/90)*2, 0, 18 + Math.sin(T/90)*4, H*.72); }
    if (k === 'camp') { for (let i=0;i<6;i++){ const x = W*(.15 + i*.14), y = H*(.76 + hash(i,3)*.12); poly(ctx, [[x - 14, y],[x, y - 18],[x + 14, y]], '#1e1820'); glow(ctx, x + 18, y, 16, '#e8923a', .3 + Math.sin(T/120 + i)*.05); } }
    if (k !== 'camp') { air = true; fx = W*(.3 + Math.sin(T/2400)*.12); fy = H*(.32 + Math.cos(T/1800)*.06); fs = 1.8; } else { fx = W*.5; fy = H*.62; air = true; } }
  else if (k === 'shadow') { for (let i=0;i<5;i++) poly(ctx, [[W*(.45 + i*.08), H*.7],[W*(.45 + i*.08), H*(.22 + hash(i,4)*.2)],[W*(.47 + i*.08), H*(.16 + hash(i,4)*.2)],[W*(.49 + i*.08), H*(.22 + hash(i,4)*.2)],[W*(.49 + i*.08), H*.7]], '#121116');
    ctx.fillStyle = '#16151a'; ctx.fillRect(W*.4, H*.5, W*.5, H*.25); ground(H*.75, '#26252c', 3, 2);
    for (let i=0;i<9;i++){ const x = ((hash(i,5)*W + T*.01*(1 + hash(i,6))) % (W + 80)) - 40; ell(ctx, x, H*(.55 + hash(i,7)*.4), 40 + hash(i,8)*40, 7, 'rgba(120,115,135,.12)'); } }
  else if (k === 'room' || k === 'deck') { const fl = .85 + Math.sin(T/110)*.08 + Math.sin(T/41)*.05; glow(ctx, W*.62, H*.6, W*.4, '#e8a050', .3*fl); ctx.fillStyle = '#0a0806'; ctx.fillRect(0, H*.82, W, H);
    ctx.fillStyle = '#ffd890'; ctx.fillRect(W*.62 - 1.5, H*.6, 3, 7); if (k === 'deck') { ctx.save(); ctx.translate(W*.5, H*.55); ctx.rotate(-.06); ctx.fillStyle = '#d8ccb0'; ctx.fillRect(-16, -24, 32, 48); ctx.fillStyle = 'rgba(150,120,220,.5)'; ctx.fillRect(-13, -21, 26, 42); ctx.restore(); fx = W*.34; fy = H*.9; } else { fx = W*.3; fy = H*.92; } }
  else if (k === 'warehouse') { glow(ctx, W*.5, H*.72, W*.35, '#e8923a', .28 + Math.sin(T/90)*.03); ctx.fillStyle = '#060506'; for (let i=0;i<5;i++) ctx.fillRect(0, H*(.08 + i*.05), W, 3); for (let i=0;i<4;i++) ctx.fillRect(W*(.1 + i*.27), 0, 5, H); ctx.fillStyle = '#100c0a'; ctx.fillRect(0, H*.84, W, H);
    for (let i=0;i<3;i++){ const y = ((T*.05 + i*90) % (H*.9)) - 20; if (v.step >= 3) drawFigure(ctx, 'andiihunter', W*(.6 + i*.12), y, 2, t, {still:true, air:true, alpha:.7}); } fx = W*.38; }
  else if (k === 'roofs' || k === 'spawn') { stars(30); spawnRock(W*.72, H*.18, W*.18); if (k === 'roofs') { ctx.fillStyle = '#0a0812'; for (let i=0;i<9;i++){ const x = i*W/8 - 10, h = H*(.28 + hash(i,9)*.18); ctx.fillRect(x, H - h, W/8 + 2, h); poly(ctx, [[x, H - h],[x + W/16, H - h - 12],[x + W/8, H - h]], '#0a0812'); } lamps(H*.78, 10); fy = H*.7; fx = W*.4; }
    else { ctx.fillStyle = '#020203'; ctx.fillRect(0, H*.62, W, H); for (let i=0;i<5;i++) glow(ctx, W*(.2 + i*.15), H*.55, 20, '#9a86e0', .08); fx = W*.5; fy = H*.9; } }
  else if (k === 'garden') { stars(20); const lit = .7 + Math.sin(T/600)*.05; ctx.fillStyle = '#100c14'; ctx.fillRect(W*.55, H*.18, W*.4, H*.6); ctx.fillStyle = `rgba(255,200,120,${lit*.7})`; ctx.fillRect(W*.7, H*.32, 14, 20); glow(ctx, W*.7 + 7, H*.32 + 10, 40, '#ffb060', .2);
    ctx.fillStyle = '#16121c'; ctx.fillRect(0, H*.6, W, 8); for (let i=0;i<7;i++) ell(ctx, W*(.05 + i*.15), H*(.84 + hash(i,2)*.06), 26, 14, '#0c0e10'); ground(H*.9, '#0a0b0c', 2, 3); if (v.id === 'v4_sorry') { fx = W*.3; fy = H*.58; } }
  else if (k === 'hills') { stars(70); ground(H*.62, '#0c0b14', 14, 4); ground(H*.78, '#08070c', 10, 5); if (v.step <= 1) { ctx.save(); ctx.translate(W*.72, H*.6); ctx.scale(.5, .5); drawHound(ctx, {gait:Math.sin(T/200)}); ctx.translate(-70, 4); drawHound(ctx, {gait:Math.cos(T/200)}); ctx.restore(); }
    if (v.step === 1 || v.step === 2) { ell(ctx, W*.74, H*.55, W*.16, H*.2, 'rgba(0,0,0,.65)'); if (v.step === 2) drawFigure(ctx, 'rake', W*.78, H*.62, 2.2, t, {still:true, dir:-1}); } glow(ctx, W*.18, H*.92, 30, '#e8923a', .08); }
  else if (k === 'wagon') { ctx.strokeStyle = 'rgba(30,28,34,.9)'; ctx.lineWidth = 1.2; for (let i=0;i<14;i++){ const x0 = hash(i,1)*W, y0 = H*.95; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(W*.5, H*(.5 + hash(i,2)*.2), W*.92, H*.35); ctx.stroke(); }
    poly(ctx, [[W*.8, H*.1],[W*1.05, H*.1],[W*1.05, H*.55],[W*.8, H*.55]], '#121116'); for (let i=0;i<18;i++){ const x = (hash(i,3)*W + T*.006) % W; ell(ctx, x, H*(.8 + hash(i,4)*.15), 4, 7, 'rgba(10,10,12,.85)'); }
    ctx.save(); ctx.translate(W*.42, H*.84); ctx.scale(.55, .55); drawHound(ctx, {gait:Math.sin(T/160), rim:'#c9bbff'}); ctx.restore(); fx = W*.22; fy = H*.9; drawFigure(ctx, 'paran', fx, fy, 2.3, t, {phase:1}); }
  else if (k === 'belfry' || k === 'sky') { stars(50); spawnRock(W*.2, H*.16, W*.13); lamps(H*.82, 14);
    if (k === 'belfry') { ctx.fillStyle = '#08070e'; ctx.fillRect(W*.55, H*.38, W*.18, H*.62); poly(ctx, [[W*.53, H*.38],[W*.64, H*.2],[W*.75, H*.38]], '#08070e'); fx = W*.6; fy = H*.4; fs = 2; glow(ctx, W*.68, H*.36, 22, '#d8c8a0', .1 + Math.sin(T/700)*.04); }
    else { const wing = (x, y, s, c, ph) => { const fl = Math.sin(T/160 + ph)*.5; poly(ctx, [[x - s, y - s*fl*.6],[x - s*.2, y],[x, y - s*.12],[x + s*.2, y],[x + s, y - s*fl*.6],[x + s*.25, y + s*.18],[x, y + s*.35],[x - s*.25, y + s*.18]], c); };
      wing(W*(.42 + Math.sin(T/1300)*.05), H*.38, 34, '#020204', 0); wing(W*(.66 + Math.cos(T/1100)*.05), H*.46, 28, '#2a4030', 1.5); glow(ctx, W*.55, H*.42, 60, '#7aff9a', .07 + Math.abs(Math.sin(T/300))*.05); } }
  else if (k === 'alley' || k === 'dawn') { ctx.fillStyle = k === 'dawn' ? '#2a2630' : '#0a090e'; ctx.fillRect(0, 0, W*.2, H); ctx.fillRect(W*.8, 0, W*.2, H); ground(H*.86, k === 'dawn' ? '#3a3640' : '#121018', 1, 6);
    if (k === 'alley') { glow(ctx, W*.62, H*.3, 60, '#6aa0ff', .3); ctx.fillStyle = '#bcd6ff'; ctx.fillRect(W*.62 - 2, H*.3, 4, 6); ell(ctx, W*.62, H*.9, 30, 4, 'rgba(106,160,255,.15)'); } else { glow(ctx, W*.5, H*.2, W*.4, '#e8d0c0', .15); } fx = W*.42; }
  if (v.fig && k !== 'wagon') { if (v.id === 'v7_lorn' && v.step === 6) { drawFigure(ctx, 'paran', fx, fy, fs, t, {phase:1}); drawFigure(ctx, 'lorn', fx + 4, fy - 14, fs*.9, t, {still:true, air:true, alpha:.9}); }
    else drawFigure(ctx, v.fig, fx, fy, fs, t, {still:v.fig === 'rake' || v.fig === 'sorry', air, phase:2, dir:1}); if (v.id === 'v7_lorn' && v.step === 5) drawFigure(ctx, 'lorn', fx + 34, fy, fs, t, {still:true, dir:-1, alpha:.8}); }
  ctx.fillStyle = 'rgba(200,190,255,.35)'; for (let i=0;i<18;i++){ const y = (hash(i,10)*H - T*.01*(1 + hash(i,11)) % H + H) % H; ctx.fillRect(hash(i,9)*W + Math.sin(T/1400 + i)*6, y, 1.3, 1.3); }
  const tint = ctx.createLinearGradient(0, 0, W, H); tint.addColorStop(0, 'rgba(90,60,160,.18)'); tint.addColorStop(1, 'rgba(30,20,60,.24)'); ctx.fillStyle = tint; ctx.fillRect(0, 0, W, H);
  vign(ctx, W, H, .85, .5);
}
/* the journal's Visions list: the ones this sergeant has seen, to watch again */
function visionsHTML(){
  /* every vision of every chapter the squad has reached; unseen ones are marked and can be watched for the first time */
  const ch = S ? S.chapter || 0 : 0, seen = (S && S.seenVisions) || [];
  const ids = VISION_IDS.filter(k => VISIONS[k].ch <= ch); if (!ids.length) return '';
  const can = (view === 'explore' || view === 'scene') && !VIS && !document.body.classList.contains('vision');
  return `<h4 class="jh">Visions</h4><p class="fine">What the Deck can show Tuft when she looks into the card: a glimpse through someone else's eyes. Look into the card when she reads for you, or watch them here.${can ? '' : ' (Watch from the map, or a conversation.)'}</p><ul class="jl vlist">${ids.map(k => { const V = VISIONS[k], s = seen.includes(k);
    return `<li><span class="vnm"><em>Chapter ${V.ch}</em> · ${esc(V.who)} · ${esc(V.where)}${s ? '' : ' <b class="vnew">unseen</b>'}</span>${can ? ` <button class="btn sm vis" data-vision="${k}">✦ ${s ? 'Watch again' : 'Watch'}</button>` : ''}</li>`; }).join('')}</ul>`;
}
function bindVisions(m){ m.querySelectorAll('[data-vision]').forEach(b => b.onclick = () => { AUDIO.play('click'); m.hidden = true; playVision(b.dataset.vision, null); }); }
