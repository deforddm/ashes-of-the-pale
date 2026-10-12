/* ============ Book Two: Through the Deck, the seven visions of Deadhouse Gates ============
   One per chapter, played when the Book Two reader (visReader(), 36b) turns a card and looks into it. Each is a scene somewhere the
   squad cannot see, at the same point of the story, through the eyes of a canon character the squad never meets. Choices change words,
   never outcomes (S.f.b2v*_ keys; nothing else reads them). The last step of each is the reader, back at the column's fire: its sp, fig
   and txt are getters/functions of visReader(), so visAgain (36b) still matches it on a replay. Canon basis and sources: docs/dg-canon.md,
   "Visions". The backdrops are VISBG entries (36b's drawVision lays the figure, the motes and the Deck's violet over them); the new
   figures are FIGX kinds (18). Loads after Book Two's art (47b..55b). */

/* ---------------- the reader, at the end of each vision ---------------- */
const b2vP = r => r.he ? {S:'He', s:'he', H:'His', h:'his'} : {S:'She', s:'she', H:'Her', h:'her'};
const b2vWho = r => /marrow/i.test(r.id || '') ? 'marrow' : /yedda/i.test(`${r.id || ''} ${r.name || ''}`) ? 'yedda' : /kanese/i.test(r.id || '') ? 'kanese' : 'other';
const b2vFig = () => { const r = visReader(); return FIGX[r.id] || r.id === 'tuft' ? r.id : r.he ? 'hissari_m' : 'hissari_w'; };
/* o = {marrow:(r, p) => text, yedda:..., kanese:..., other:...}: Marrow, Yedda and the old Kanese are 47's readers; other is the fallback */
const b2vEnd = o => ({get sp(){ return visReader().name; }, get fig(){ return b2vFig(); }, bg:'b2deck',
  txt:() => { const r = visReader(), p = b2vP(r); return (o[b2vWho(r)] || o.other)(r, p); }});

Object.assign(VISIONS, {
  /* ---- Chapter 1: Hissar burns. Far to the west, at dawn, the Red Blades kill the prophetess. ---- */
  b2v1:{book:'dg', ch:1, who:'Lostara Yil', where:'The Holy Desert', fig:'lostara', bg:'raraku', cap:'Raraku before dawn: sand, a fold of rock, and a fire that has burned down to nothing.', steps:[
    {go:'Wait for the light.', txt:
`Lostara Yil lies on her belly in a fold of the Holy Desert with sand in her teeth and a loaded crossbow under her cheek, and she has not moved since the stars came out.

Below her, in a hollow among the rocks, a small fire has gone to ash. Three people sit by it. Two are guards, and she has spent the night learning them. A lean man with a scarf wound over a peaked iron helm, two morning stars through his belt and a crossbow of his own, who never once puts his back to the dark. And a giant, seven feet of him, with a tattooed face, who does not seem to need to sit at all.

The third is a small woman, honey-skinned and black-haired, plain, deeply lined, nobody you would look at twice in a market. The prophetess of the Holy Desert. Sha'ik. Across her knees, wrapped in cloth, lies a book.`},
    {txt:
`The Red Blades followed a man here. A big man, dark, desert-born, with a killer's way of being where you weren't looking, and that book in his pack. Halfway across Seven Cities they followed him. At a keep on the coast road Lostara sat in the same common room as him, close enough to touch, while a merchant's wife spilled a Deck of Dragons across a table and told the whole room what he carried, if anyone knew how to read it. She knew. And when he had gone, she and the man with her made sure that nobody in that keep would ever tell anyone anything. She does not think about the keep.

Last night he gave the woman the book, and rode out east with something walking at his stirrup that was not a dog.

Two bodies along, Captain Tene Baralta lies as still as she does. Behind them, down in the rocks, the troop and the horses. Red Blades: Seven Cities born and sworn to the Empire. *Malazan lapdogs*, the markets call them, and spit. Lostara is Pardu, and tattooed, and has been spat at by better.`},
    {txt:
`The sky goes grey, then pale, then a thin clean gold along the eastern rim, and the cold goes out of the sand under her.

Down in the hollow the small woman sits cross-legged between her two guards and unwraps the book. She waits, very still, with her face turned to the east. She is waiting for the sun. The whole country has been waiting with her, for years: the day the Book is opened, the Whirlwind rises.

The first of the light comes over the rocks and touches her. She opens the Book.`,
     ch:[{t:'Breathe out, slowly, and loose.', set:['b2v1_shot','breath']},
         {t:'Say a word to whatever is listening, and loose.', set:['b2v1_shot','word']}]},
    {txt:()=>`${S.f.b2v1_shot === 'word' ? `She says it under her breath. It is not a prayer, exactly. Nobody she knows of is listening at this hour. Then she looses.` : `She lets her breath go, all of it, the way she was taught, and at the bottom of it, where everything is still, she looses.`}

The quarrel takes the prophetess in the head. She goes over sideways, and the Book slides off her knees into the sand, and the light comes on over the desert exactly as it was always going to.

Then the Red Blades are up out of the rocks and running, and it goes wrong faster than Lostara would have believed. The lean man has his flails out before the first of them reaches the hollow, and they sing. The giant simply walks into the troop as if it were weather. Tene Baralta is shouting the recall. She is on her feet, the crossbow empty, her sword half drawn, and the giant is in front of her; and then the world is a hand the size of a shield, and the sand comes up to meet her.`},
    {bg:'canyon', go:'Ride.', txt:
`She wakes face down across a saddle in a small canyon, with blood in her mouth and her ribs on fire, and Tene Baralta crouching by her head.

"Your shot," he says. "Yours, Lostara." He is pleased, in the careful way he is pleased about anything. Then he gives her the next order, because he is that kind of captain: the troop rides for Pan'potsun; she is to go back and pick up the big man's trail, alone, hurt as she is.

She says yes. It is the only word she has ever had for him.

The guards did not follow. The last thing she saw before the hand was the lean man kneeling in the sand by the small body, and the giant standing over them both, looking at nothing. Nobody came after the Red Blades at all. She thinks about that, riding, more than she likes.

Behind her, over the Holy Desert, the wind is getting up. She does not look round.`},
    b2vEnd({
      marrow:() => `Marrow lets the card go and sits back on her heels, the way she sits whenever she can. "Well, child," she says. "Somebody shot the prophetess." She looks back east, where Hissar is still a red smear on the dark. "And the whole country got up anyway. As if it had only been waiting for someone to try and stop it." She puts the cards away. Her hands are cold, in all this heat.`,
      yedda:() => `Yedda lets the card go and wipes her fingers on her skirt, as if it had been greasy. "A girl with a crossbow," she says. "Thirty years my man made rope in Hissar, and I sold it, and never once asked who'd be hanging off the end of it." She looks back at the glow where the city was. Her hands are cold.`,
      kanese:(r) => `${r.name} lets the card go and says something over it in Kanese, a prayer by the sound of it. "Red Blades," he says. "Desert people, the Empress's people. They shoot the holy woman." He shakes his head. "Shoot her, and the country gets up anyway." His hands are cold.`,
      other:(r, p) => `${r.name} lets the card go. "They killed her," ${p.s} says, "and it didn't stop anything. Look." ${p.S} nods back east, at the glow where Hissar was. ${p.H} hands are cold.`})]},

  /* ---- Chapter 2: the Odhan. Out on the otataral island, six days out of Skullcup, a god is pulled down into the world. ---- */
  b2v2:{book:'dg', ch:2, who:'Felisin', where:'The Fouled Spring', fig:'felisin', bg:'otataral', cap:'Red dust under starlight, a green stone finger taller than a temple, and a spring that stinks.', steps:[
    {txt:
`Felisin has been out of Skullcup six days, and the desert has not yet decided whether to kill her.

Everything here is red: the dust, the rocks, the sky at evening, the inside of her eyelids. Otataral, the guards called it in the mines, as if it were a joke. Sorcery dies on it. Bloodflies don't. Her face is a map of their bites, healing ugly. She does not look at it. There is nothing out here to look at it in.

Ahead walks Baudin, big and silent and ugly, carrying everything, whom she has decided to hate. Behind, falling further behind every hour, comes Heboric: an old priest of the Boar with no hands, who was a historian once, and who has not stopped talking since the lake.`},
    {txt:
`Two days back they passed a finger. Green stone, jade, standing up out of the dust taller than a temple, with a knuckle and a nail. Heboric went and laid the stump of one wrist against it, like a man greeting an old friend. Now the stump is swollen and dark and hot to the touch, and he is dying of it, and he knows it, and keeps making jokes.

She thinks about Skullcup as little as she can, which is still often. About a man there called Beneth, and what she bought from him, and what she paid, and the durhang that made the paying easy. She would kill for a pinch of it now. She would kill for a mouthful of water.

At dusk they find a spring. It is fouled: scum on it, something dead in it, a smell like a privy in summer. Baudin kneels and sniffs it and says nothing at all, and that is worse than if he had said it.

That night, Heboric's breath goes short and fast.`,
     ch:[{t:'Sit with the priest.', set:['b2v2_fel','sit']},
         {t:'Turn your back. Let Baudin see to him.', set:['b2v2_fel','back']}]},
    {txt:()=>`${S.f.b2v2_fel === 'back' ? `She lies down with her back to them and pulls her blanket over her head and listens anyway, because there is nothing else in the whole red world to listen to.` : `She sits by him. Nobody else is going to, she tells herself, and Baudin doesn't count. The old man turns his hot face toward her and says something about the First Empire, very politely, as if she had asked.`}

Some time after the moon goes down, Baudin kneels over him in the dark. The priest's chest is bare, and over his heart is the mark of his god, the Boar. Baudin has the swollen wrist in one big hand, and the stump is pressed to the mark, and whether Baudin put it there or the old man did, she will never afterwards be sure.

Then something gives.`},
    {txt:
`It is not a sound. It is the feeling of a sound, in her teeth and in the ground under her hip: a door that has been shut for longer than there have been doors, opened from the wrong side, all at once.

The stars over the dunes slip, the way a reflection slips in water when a stone goes in. For a heartbeat the sky looks torn. She will never be sure she saw that either.

Then nothing. The stars are stars. Baudin is sitting back on his heels, breathing hard, looking at his own hand as if it belonged to someone else.

Somewhere, Felisin thinks, without knowing why she thinks it, something very large has just fallen a very long way, and is lying where it fell, and is not used to the ground.`},
    {go:'Walk.', txt:
`In the morning Heboric is sitting up.

The fever is gone. The stump is only a stump again. He keeps rubbing the ends of his arms together and frowning, and when she asks what is wrong he tells her, quite mildly, that his hands itch. The hands he has not had for years. Then he wonders aloud what last night has done to the Deck of Dragons, as if anyone out here cared.

He lifts his face into the wind and says he can smell water.

Felisin walks behind them both. She has dreamed it every night since the mines: of the three of them, only she comes through. She believes it the way she once believed somebody would come for her.`},
    b2vEnd({
      marrow:() => `Marrow lets the card go and lays her hand flat over it, the way you'd lay a hand on a child with a fever. "Something fell," she says. "Somewhere a long way off. A god, by the weight of it." She takes her hand away and looks at the palm. "Soliel keep that girl. Nobody else is going to." Her hands are cold.`,
      yedda:() => `Yedda lets the card go. "That poor girl," she says, and then, because she is Yedda, "and that poor old man, with no hands to hold his own cup." She looks at her grandsons asleep under the cart. Her hands are cold.`,
      kanese:(r) => `${r.name} lets the card go and touches his forehead, his mouth, his chest. "Something fell," he says. "Big. A god, maybe. I feel it in my knees, like rain coming." He doesn't laugh. His hands are cold.`,
      other:(r, p) => `${r.name} lets the card go. "Something fell," ${p.s} says. "Did you feel it? No." ${p.S} looks at the sky over the Odhan for a long time, as if to see if it has a tear in it. ${p.H} hands are cold.`})]},

  /* ---- Chapter 3: the Ridge. Under Gelor Ridge's sky and no sky at all, Kalam walks Keneb's family across the Imperial Warren to Aren. ---- */
  b2v3:{book:'dg', ch:3, who:'Minala', where:'The Imperial Warren', fig:'minala', bg:'impwarren', cap:'Ash to every horizon, under a sky the colour of old pewter.', steps:[
    {txt:
`Minala has walked across ash for three days, or for one long day that will not end. There is no sun here to tell by.

A plain of it, grey and soft and ankle-deep, under a sky the colour of old pewter. Broken walls stand up out of it here and there like teeth in a burned jaw. Nothing grows. Nothing moves, except them: her sister Selv with the two boys, her sister's husband Keneb with his sword out at nothing, the horses; and out in front, the big dark man who brought them here by breaking a stone against a rock.

Kalam. He gave that name the way other men admit to being tired.

"You're lost," she tells him, for the third time. "Get us out."

"Not yet," says Kalam.`},
    {txt:
`There is something wrong with the way he walks here. He keeps turning his head like a hound that has lost the scent. Something is in the way, he says, and will not say what.

Then: clouds, low on the horizon, where there should be none. Kalam stops and tastes the air, and his face shuts like a door. Wood spice, he says. Company. He has the crossbow off his back before she sees him reach for it.

The company does not come. Instead the ground drops away in front of them into a pit. Its sides are layer on layer: ash, and bone, and broken stone, and ash again, fire after fire after fire, older than she can think about. At the bottom, half buried, the ruin of a machine: rings inside rings, bronze gone green, teeth along their rims like a mill-wheel's.

Keneb goes very quiet. A seer at the garrison in Orbal once read the Deck for him, he says, and put a name out in the Pan'potsun hills, a Jhag's name out of the old stories, a builder of wheels that count the years. He says the name. Nobody wants to stay.`},
    {txt:
`They camp in a sunken road that runs south. Out on the plain things are moving in the dusk, big things and swarming things, all of them going north past the road and none of them toward it, like water toward a drain. Kalam watches them go and says nothing.

By the fire Keneb talks to him, low, the way men talk about a woman who is near enough to hear. About her husband. About the colonel at Orbal, and the garrison healer who was paid to hide what the colonel did to her. The colonel is dead now. Somebody saw to it, the first night of the rising. Keneb has never asked her who.

Minala looks into the fire and lets them talk. She has learned a great deal about letting men talk.`,
     ch:[{t:'Look up. Let Kalam see that you heard.', set:['b2v3_heard','look']},
         {t:'Keep your eyes on the fire.', set:['b2v3_heard','fire']}]},
    {txt:()=>`${S.f.b2v3_heard === 'fire' ? `She keeps her eyes on the fire. She doesn't need to look. She knows where he is, the way you know where the edge of a roof is in the dark.` : `She looks up. Kalam is already looking at her across the fire, and he doesn't look away, which is a thing no man has done in a long time.`}

She knows something about him that Keneb doesn't. He walks like a man with nothing in his hands, and he is never, ever unarmed. Daggers unseen, she thinks. She has watched him reach for them in his sleep.

In the morning there is a dome, copper, green with age, sunk to its shoulders in the ash, with a mark cut over its door: a crown, stylised and cruel. Kalam gets down off his horse and stands in front of it a long time. He was in a war once, he says, half to himself, across the sea, against a warlord and a lord of a black mountain, and there was a man in that war who wore this crown. A High King.

"Of what?" she asks.

"Of nothing, any more," says Kalam. "Kallor."`},
    {bg:'aren', go:'Pack.', txt:
`Then he decides they have been here long enough, and opens a door in the air, and they step through it into a city of tombs at night, with the sea close by and lamps beyond the walls. Aren.

At an inn by the harbour he sits down across the table from a stranger, and gets up again a ship's passenger, bound for Unta. He doesn't say goodbye properly. He tells her a ship is leaving and he is on it, and then he is gone, down to the quay with the ship's captain, and the door of the inn is swinging.

He isn't a subtle man. She finds she does not mind.

When Keneb comes looking for her she is packing. She tells him she is going after him. "And don't talk about him," she says. "Ever. Promise me." Keneb, who is a good man and has never once asked her the question he ought to, promises.`},
    b2vEnd({
      marrow:() => `Marrow lets the card go. "Aren," she says. "It showed me Aren, child. Lamps on the walls, and a woman packing a bag." She thinks about that for a while under her hat. "So there's an Aren at the end of this. That's worth knowing." Her hands are cold.`,
      yedda:() => `Yedda lets the card go. "She'll catch him," she says, with great satisfaction. "That kind always does." Then, more quietly: "Aren. It's still there, then." Her hands are cold.`,
      kanese:(r) => `${r.name} lets the card go. "Aren," he says. "Walls. Lamps. Still there." He nods several times, as if somebody had argued. His hands are cold.`,
      other:(r, p) => `${r.name} lets the card go. "Aren," ${p.s} says. "It's still standing. There were lamps on the walls." ${p.S} says it twice, as if to make sure of it. ${p.H} hands are cold.`})]},

  /* ---- Chapter 4: the Vathar. Far off in the Holy Desert, on the road to Tremorlor, a Trell stops lying to his friend. ---- */
  b2v4:{book:'dg', ch:4, who:'Mappo', where:'The Road to Tremorlor', fig:'mappo', bg:'roots', cap:'A torn piece of some other world: roots to the horizon, and a sky that cannot settle on a colour.', steps:[
    {txt:
`Mappo Runt lies on his back on a plain of roots with his club beside him and his eyes shut, and does not sleep, and listens.

This is not a real place, or not wholly: a torn piece of some old warren, a forest at its edge and then this, roots to every horizon, knotted and humped like the backs of buried animals, under a sky that cannot settle on a colour. Somewhere ahead is the House. Tremorlor. An Azath, which takes what it wants and keeps it.

Mappo is a Trell, and big even for a Trell. His braids are full of small fetishes that click when he turns his head, so he does not turn it. Round the fire the humans sleep: the sapper, the boy, the girl's old father, the little priest of Shadow muttering in his dreams. Two are awake. Icarium sits with his back to Mappo, his long grey hands loose on his knees, and across the fire from him the girl, Apsalar, is talking.`},
    {txt:
`She talks quietly, the way people do at night. About the sea. About her father's nets, on a coast a long way west. About an old woman on a road, a candle witch, who had lost a husband and children to the Empire and who hid a frightened girl somewhere deep inside her while a god wore her. About the god, too, and that is the strangest part: she speaks of him as if she had learned something from him that she would rather not have known, and was not sorry to know.

Icarium listens. Then he says something, very low, about a weight, and how he would carry it gladly.

"Don't tell Mappo," she says. "It would break his heart."

Mappo lies very still. His eyes are wet. Across the fire, he can hear that Icarium's are too.`,
     ch:[{t:'Keep still. Let them think you sleep.', set:['b2v4_mappo','still']},
         {t:'Turn over, heavily, so they know.', set:['b2v4_mappo','turn']}]},
    {txt:()=>`${S.f.b2v4_mappo === 'turn' ? `He turns over, heavily, grunting, the way a sleeping Trell turns. The talking stops. Nobody says anything for a long while, and that is a kindness in both directions.` : `He keeps still. He has kept still for a very long time. He is good at it.`}

He was set to this road by the Nameless Ones, longer ago than most nations have lasted: walk at the Jhag's side; keep him searching, and never finding; and never, ever let him learn what he does when he is angry. Lie to him if you must. Mappo has. Every day, gently, for centuries.

In the morning, on the roots, with the House somewhere ahead, he stops lying.

He tells Icarium about the rage. Not all of it. Enough. That there is something in him that wakes when he is pushed too far; that it has killed more people than anyone has counted; that it will again; and that the House ahead was made for things like that.`},
    {txt:
`Icarium listens the way he listens to everything: as if it were a mechanism he might, with patience, come to understand. When Mappo has finished he is quiet a long while. Then he says that if it is true, the House should have him. That it would be just. He says it gently, as if he were the one breaking bad news.

Mappo finds he has no answer. He had a thousand, and they have all gone.

The boy, Crokus, afraid of what the Jhag might do to the House, or the House to him, makes the little priest call on his master; and his master answers. Out of the shadows among the roots come Hounds: five of them, big as horses, padding in to sit at a polite distance. The boy goes white. The sapper swears.

Ahead, the roots knot themselves into walls, into a maze; and beyond the maze, somewhere, a House waits with its door shut.

Mappo picks up his club and his bag, and goes to stand at Icarium's shoulder, where he has always stood.`},
    b2vEnd({
      marrow:() => `Marrow lets the card go. "He told him," she says. "After all that time." She is quiet under her hat. "Some kindnesses look exactly like lies for a hundred years, child. Then one morning they don't." Her hands are cold.`,
      yedda:() => `Yedda lets the card go and blows her nose, hard. "Big lump," she says. "Lying to his friend all that while. My husband was the same about his chest." She doesn't say what happened to him. Her hands are cold.`,
      kanese:(r) => `${r.name} lets the card go. "The girl," he says. "Kan girl. A fisher's girl, from my coast. I know how they talk about the sea, those girls." He says a prayer for her in Kanese, quietly, to the card. His hands are cold.`,
      other:(r, p) => `${r.name} lets the card go. "He told him the truth," ${p.s} says, "and the truth was worse than the lie." ${p.S} doesn't say anything else. ${p.H} hands are cold.`})]},

  /* ---- Chapter 5: the Dry March. At the Holy Desert's oasis, the prophetess comes back, and calls the tribes to war. ---- */
  b2v5:{book:'dg', ch:5, who:'Leoman', where:"Sha'ik's Camp", fig:'leoman', bg:'oasis', cap:'A ruined city round an oasis, palms and tents and forty thousand riders, and a platform of planks in the middle of it.', steps:[
    {txt:
`Leoman of the Flails walks a step behind a girl in a dead woman's clothes, and keeps his face as still as a well.

He waited weeks for her. He and the Toblakai sat in the desert beside a small body wrapped in a blanket, and a book, and the words the prophetess had said before the quarrel took her: that at dawn she would open the Book, and the Whirlwind would rise, and she would come out of it renewed. They waited until they were as gaunt as old dogs. The Toblakai began to talk of leaving.

Then the dust parted, and a young woman and an old man walked out of it.

"You are reborn," Leoman told her.

"So I am," she said.`},
    {txt:
`Now she wears the robes he gave her, and the rings, and carries the Book. Her face under the hood is young and pitted with old bites, and her eyes are not young at all. On the road she spoke to him once in a voice that was not her own, and he knew that voice: he served it for years.

The old man walks beside her with his arms folded where his hands should be. She calls him her wisdom. He does not look as if he enjoys it. The Toblakai walks ahead, and the desert gets out of his way.

The camp is a ruined city round an oasis, and it has grown since Leoman left it: tents and cookfires and horse lines out past the broken walls, eleven tribes, forty thousand riders, and every one of them waiting for something. At its edge a sentry steps out of the shade: an orphan girl with a spear taller than she is. The Toblakai tells her to kneel. She kneels, looking up at the one in Sha'ik's clothes with her whole face.`,
     ch:[{t:'Believe.', set:['b2v5_leo','believe']},
         {t:'Watch.', set:['b2v5_leo','watch']}]},
    {txt:()=>`${S.f.b2v5_leo === 'watch' ? `He watches. Faith is for the ones who kneel. Somebody has to keep his eyes open, and it has always been him.` : `He lets himself believe it, for the space of a breath. It is easier than he expected, and that frightens him more than doubt ever has.`}

They walk her through the camp to the parade ground before the great tent, and the people come, thousands of them, and she climbs up onto the platform, though he told her not to. She stands there a long moment with her eyes shut, as if listening to someone speaking a long way off, and agreeing to something.

Then the Toblakai roars at the crowd to kneel, and the crowd kneels, wave on wave, out to the palms.

The High Mages come last, as High Mages do. Bidithal, old and dry as a stick. Febryl. L'oric. Leoman watches each of them look up at the girl and weigh her; and each of them, willing or not, goes down on one knee.`},
    {go:'Look up.', txt:
`She speaks. The time of waiting is over, she tells them. War, now, against the Empire. Every Holy City in Seven Cities is the Whirlwind's, she says, but one. She doesn't need to name it. Every rider on that ground knows which one still flies the Empire's colours, and who is marching for it across the Odhan with a column of the half-dead at his back.

Then she lifts her arms, and the sky goes.

It comes up out of the desert all round the oasis: a wall of sand, turning, higher than towers, higher than he can tip his head back to see, with a sound like the whole world drawing breath. At its top, against the last of the blue, the banner of the Apocalypse stands out on the wind.

Leoman stands below the platform with his flails in his belt and looks up at her. She is smiling. It is not a smile he has seen on that face before, and he does not think it is meant for anyone here.`},
    b2vEnd({
      marrow:() => `Marrow lets the card go. "One city left," she says. "One." She doesn't say which. She doesn't need to. After a while she pulls her hat back down over her face. "Well. We were going there anyway, child." Her hands are cold.`,
      yedda:() => `Yedda lets the card go. "She's no older than the girls who sold water in the square at home," she says. She looks at the dark to the west, where Aren is. Her hands are cold.`,
      kanese:(r) => `${r.name} lets the card go. "One city," he says. "Everybody there knows which." He looks west, toward Aren, a long time. His hands are cold.`,
      other:(r, p) => `${r.name} lets the card go. "One city left," ${p.s} says. "Ours." ${p.S} looks west, toward Aren, for a long time. ${p.H} hands are cold.`})]},

  /* ---- Chapter 6: Sanimon. In the Holy Desert, the Azath House will not open; and a carriage the column knows comes calling. ---- */
  b2v6:{book:'dg', ch:6, who:'Fiddler', where:'Tremorlor', fig:'fiddler', bg:'tremorlor', cap:'An Azath House in a yard of roots, its door shut, and something humming in the sky behind.', steps:[
    {txt:
`Fiddler has his shoulder against the door of an Azath House, and the door is not interested.

Behind him is the yard. Not grass: roots, humped and knotted, a lawn of buried shoulders, and every one of them restless. Behind the yard, the maze they have just fought their way through; and above the maze, a cloud. It is coming. It hums. Bloodflies, more than he has ever seen in one place, and every one of them the same mind: a D'ivers, wearing a swarm.

The priest of Shadow has tried the door. The Trell has tried the door. Fiddler has tried it with a knife in the jamb, a sapper's word, and his shoulder, in that order. Tremorlor. It does not open for anyone it has not decided on.`},
    {txt:
`The Hounds come back out of the maze at a run, all five, and put themselves between the humans and the cloud, and for the first time since he met them Fiddler is glad of them.

Then the Jhag wakes up.

Icarium comes up off the roots where the Trell laid him with his face gone somewhere else entirely, and the Trell is on him at once, both arms round him, talking into his ear, low and steady, the way you talk to a horse in a burning stable. And the yard moves. The roots heave up and take hold, of a Hound's leg, of the trailing edge of the swarm, and pull them down, into the ground, into the House's keeping.`,
     ch:[{t:'Try the door again.', set:['b2v6_fid','door']},
         {t:'Put your back to it. Face the yard.', set:['b2v6_fid','yard']}]},
    {txt:()=>`${S.f.b2v6_fid === 'yard' ? `He puts his back to the door and faces the yard with his crossbow up, because if he is going to be eaten he would like to see what by.` : `He tries the door again. It is like trying to push over a cliff.`}

Something climbs down his arm.

Moby. The boy's little bhok'aral, which has come and gone all the way across Seven Cities, and smells of spice when it comes. It goes down Fiddler's sleeve like a squirrel down a tree, and for a moment its outline blurs, the way a thing blurs through heat over a road, and looks a great deal bigger than it ought to. It lays one small hand flat on the door.

The door opens.`},
    {bg:'azath', txt:
`Inside, it is quiet.

Dust, and old wood, and a hallway that goes back further than the House is wide. The Jhag goes still in the Trell's arms the moment he is over the threshold, as if he had walked out of a storm into a library. The Hounds do not come in. Gone, says the priest, slipped off, cowards, and pretends not to be relieved. The yard has the D'ivers. Fiddler can hear it being had, out there, and chooses not to listen.

In a room off the hall they find the last keeper of the House, sitting where it died, dried thin as paper. Something not human, and not anything Fiddler has a name for.`},
    {bg:'azath', go:'Grin.', txt:
`Then somebody rings a bell.

A merchant's bell, brass, at the door of an Azath House in the middle of the Holy Desert. Fiddler opens the door on it, because nobody else will. On the step stands a huge man in silks, sweating, with gold in his teeth and a parcel in his arms, and behind him in the yard something big and scorched stands steaming among the roots.

The parcel is from Quick Ben. It is heavy the way only one thing is heavy: Moranth munitions, packed in straw, enough to put a hole in a small town. The fat man hands it over, bows, and does not stay. Nobody sane would.

Fiddler stands in the doorway with his arms full of a Bridgeburner's idea of a present, and grins until his face hurts.`},
    b2vEnd({
      marrow:() => `Marrow lets the card go, and laughs, which nobody expected, least of all Marrow. "The fat man," she says. "The carriage. He went there too, after us. Child, that man gets about." She wipes her eyes. Her hands are cold.`,
      yedda:() => `Yedda lets the card go. "That fat merchant," she says. "The one with the carriage, who brought the water. Well." She seems to find it a comfort that somebody is still making deliveries. Her hands are cold.`,
      kanese:(r) => `${r.name} lets the card go and laughs with no teeth. "The fat man!" he says. "Carriage man. Water man. He goes everywhere. Good business." His hands are cold.`,
      other:(r, p) => `${r.name} lets the card go. "The carriage," ${p.s} says. "The one that brought the water. It went on, after us. Somewhere stranger." ${p.H} hands are cold.`})]},

  /* ---- Chapter 7: Aren. The other side of the sea, in Malaz City, the assassin keeps his appointment with the Empress. ---- */
  b2v7:{book:'dg', ch:7, who:'Kalam', where:"Mock's Hold", fig:'kalam', bg:'malaz', cap:'Malaz City by night: wet cobbles, a shut town, and an old keep on the cliff above the harbour.', steps:[
    {txt:
`Kalam Mekhar is bleeding in an alley in Malaz City, the Claw are hunting him, and he is enjoying it rather less than he had expected to.

He came home by the wrong road. A ship that went where it pleased; a friend who turned out to be no friend; a knife in the side, and the harbour closing over his head. Now the island where the Empire was born is dark and wet and very quiet, the way a city is quiet when somebody has told everyone to stay indoors, and there are Hands in the dark of it, hunting in threes.

He took two of the first three. The third he lost. He binds the wound, badly, in a doorway that smells of fish, and somewhere close a ratter starts barking at him and will not stop.`},
    {txt:
`That is the end of waiting. He goes for the next Hand before it can come for him, and there is another behind it, and that is one more than he has left in him.

Hooves. A horse comes up the alley at a dead run, and the woman on its back has a marine's crossbow at her shoulder; she shoots the Hand off him, and reaches down her free arm.

Minala. From Aren. He left her in an inn by the harbour at the other end of the world without a proper goodbye. She swam a horse ashore after him, she says, as if it were a reasonable thing to have done. She has known about him, it turns out, all along.`,
     ch:[{t:'"I\'m not a subtle man."', set:['b2v7_kal','subtle']},
         {t:'Say nothing. Climb up behind her.', set:['b2v7_kal','climb']}]},
    {txt:()=>`${S.f.b2v7_kal === 'subtle' ? `"I'm not a subtle man," he says. She laughs at him, which he supposes he has earned, and tells him to get up.` : `He says nothing, because there is nothing he could say that she doesn't know already, and climbs up behind her.`}

The Empress is at Mock's Hold, she says. The old fortress on the cliff over the harbour. He felt something there from the ship, the night they came in: somebody important, waiting.

They ride up the cliff road. Halfway up the night swallows them, a warren, cold and close, and when it lets go they are in the Old Keep, in a passage he has not walked in years. There is a door. Beyond it, a dark room.

Out of the dark, a woman's voice. Level. Unhurried. A voice used to being obeyed.

"Come in, Kalam," says the Empress. "Tell me why you have come to kill me."`},
    {bg:'darkroom', txt:
`He tells her. He has had a long voyage to put the list in order. Onearm outlawed. Whiskeyjack and his people sent to die. Dassem. The old Emperor. The waste of it, the stupidity, the betrayals, one after another, all the way down.

She answers. Not all of it, and never once raising her voice. Some of the answers he has heard before, in other mouths, and does not believe any better for hearing them in hers. Two of them are not what he climbed the cliff expecting, and he will not repeat them to anyone. Not yet.

At the end she asks him a question of her own. Would Dassem Ultor have let a man with a knife come this close, to talk?`,
     ch:[{t:'"No. He wouldn\'t."', set:['b2v7_ans','no']},
         {t:'Don\'t answer. Put the knife away.', set:['b2v7_ans','quiet']}]},
    {bg:'malaz', go:'Ride.', txt:()=>`${S.f.b2v7_ans === 'quiet' ? `He doesn't answer. He puts the knife away instead, which is an answer.` : `"No," he says. "He wouldn't have." And he puts the knife away.`}

She tells him, almost kindly, that she cannot call the Claw off. Not tonight. He tells her he knows: the Claw see to their own. Then he turns his back on the Empress of Malaz, in the dark, and walks out, and nothing stops him.

Minala is waiting in the courtyard with the horse. At the gate, the Claw come for them out of every shadow there is, twenty of them; and out of a darker shadow, with a demon at his heel and a girl beside him, comes a sapper Kalam last saw on the far side of an ocean.

"Well?" says Fiddler.

"Didn't do it," says Kalam.`},
    b2vEnd({
      marrow:() => `Marrow lets the card go. "He didn't kill her," she says. "All that way, and he didn't." She looks out over Aren, at the harbour, at the Way and what is on it. "There's something in that, child. I'm too tired tonight to work out what." Her hands are cold.`,
      yedda:() => `Yedda lets the card go. "Well, I'm glad," she says, quite fiercely. "Somebody in this whole summer went home and didn't kill anybody." She looks at the Way, and then doesn't. Her hands are cold.`,
      kanese:(r) => `${r.name} lets the card go. "Knife out," he says. "Knife away." He puts his palms together. "Hardest walk there is." His hands are cold.`,
      other:(r, p) => `${r.name} lets the card go. "He had the knife out," ${p.s} says, "and he put it away." ${p.S} looks out at the Way, at what is on it, and away again. ${p.H} hands are cold.`})]},
});

/* ---------------- figures ---------------- */
Object.assign(FIGX, {
  /* Lostara Yil: Pardu, tattooed, a Red Blade's red-lacquered scale and slit helm left off; a crossbow */
  lostara(ctx, h, t, o){ h.legs('#2a1a14'); ctx.fillStyle = '#4a2a1c'; ctx.fillRect(-4.5, 9, 3.4, 4); ctx.fillRect(1.1, 9, 3.4, 4);
    h.torso('#9a2a22', '#3a0e0a', 6); ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = .5; ctx.beginPath(); for (let i=0;i<5;i++){ ctx.moveTo(-5.6, -4.6 + i*2.2); ctx.lineTo(5.6, -4.6 + i*2.2); } ctx.stroke(); // red scale
    ctx.fillStyle = '#2a1810'; ctx.fillRect(-6, 3.4, 12, 1.2); poly(ctx, [[-6,-6],[-9.6,4],[-6.6,6]], '#7a1c16'); // belt; a cloak's edge
    h.head('#8a5a3c', 4.3, -11.3); h.look('rgba(16,8,4,.9)', -11.6); ctx.strokeStyle = 'rgba(30,40,60,.6)'; ctx.lineWidth = .45; ctx.beginPath(); ctx.moveTo(-1.6, -9.6); ctx.lineTo(.4, -8.2); ctx.moveTo(3.6, -9.8); ctx.lineTo(2.2, -8); ctx.stroke(); // Pardu tattoos
    B2F.cap(ctx, '#0c0806', 4.6, -12.7); ctx.fillStyle = '#0c0806'; ctx.fillRect(-4.6, -12.7, 1.6, 6); // black hair, tied back
    ctx.strokeStyle = '#4a3220'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(2, -1); ctx.lineTo(12, -3); ctx.stroke(); ctx.strokeStyle = '#8d8a86'; ctx.lineWidth = .9; ctx.beginPath(); ctx.moveTo(9.4, -7.4); ctx.quadraticCurveTo(11, -3, 9.4, 1.4); ctx.stroke(); }, // the crossbow
  /* Felisin: a girl in a convict's rags, thin, the bites on her face */
  felisin(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, .9, .94);
    h.legs('#4a3a30'); B2F.robe(ctx, h, '#7a5e48', '#2e2018', 5.4, 6.6); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-3, 2, 1, 8); ctx.fillRect(2, -2, .8, 9); // rags, torn
    h.head('#c09a80', 4.2, -11.3); h.look('rgba(20,10,8,.85)', -11.6);
    ctx.fillStyle = 'rgba(140,50,40,.55)'; [[-1.8,-9.6],[1.4,-8.8],[3.2,-10.2],[-.6,-12.6],[2.4,-12]].forEach(([x, y]) => ctx.fillRect(x, y, .8, .8)); // the bloodflies' marks
    ctx.fillStyle = '#100a08'; ctx.beginPath(); ctx.arc(0, -12.4, 4.7, Math.PI*.9, Math.PI*2.1); ctx.fill(); ctx.fillRect(-4.8, -12.4, 1.8, 9); ctx.fillRect(3.4, -12.4, 1.4, 6); // black hair, hacked short and grown out wild
    ctx.restore(); },
  /* Heboric: old, bald, no hands; the Boar's mark over his heart */
  heboric(ctx, h, t, o){ h.legs('#3a3028'); h.torso('#7a6a56', '#2a2218', 6.4); ell(ctx, 0, -2.4, 2.2, 1.6, 'rgba(40,30,60,.55)'); // the mark
    ctx.fillStyle = '#9a7a5e'; ctx.fillRect(-8.4, -4, 2.4, 6); ctx.fillRect(6, -4, 2.4, 6); ell(ctx, -7.2, 2.4, 1.4, 1.2, '#7a5a42'); ell(ctx, 7.2, 2.4, 1.4, 1.2, '#7a5a42'); // arms ending at the wrist
    h.head('#a8866a', 4.5, -11); ctx.fillStyle = 'rgba(255,240,220,.18)'; ctx.fillRect(-2, -15, 3, 1); h.look('rgba(30,20,14,.7)', -11.4); ctx.fillStyle = 'rgba(200,196,186,.6)'; ctx.fillRect(-2.6, -8.4, 6.4, 1.6); },
  /* Baudin: big, plain, a sailor's build */
  baudin(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.12, 1.06); h.legs('#2a2420'); h.torso('#5a4a3a', '#1e1810', 7); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-9.4, -4, 4, 8); // a pack
    h.head('#a07e62', 4.8, -11); h.look(); ctx.fillStyle = '#5a3a24'; ctx.beginPath(); ctx.arc(0, -12.6, 4.9, Math.PI*1.05, Math.PI*1.95); ctx.fill(); ctx.restore(); },
  /* Minala: iron-streaked hair, a good rider's coat, a marine's crossbow */
  minala(ctx, h, t, o){ h.legs('#2a2622'); ctx.fillStyle = '#4a3a2a'; ctx.fillRect(-4.5, 8, 3.4, 5); ctx.fillRect(1.1, 8, 3.4, 5); // riding boots
    poly(ctx, [[-6,-6],[6,-6],[7.4,10.4],[-7.4,10.4]], h.armor('#4a5664', '#161c24')); ctx.fillStyle = '#2a2018'; ctx.fillRect(-6, 2.6, 12, 1.2);
    h.head('#c8a488', 4.2, -11.3); ctx.fillStyle = 'rgba(220,230,240,.75)'; ctx.fillRect(-.9, -11.6, 1.2, 1); ctx.fillRect(2, -11.6, 1.2, 1); // grey eyes
    ctx.fillStyle = '#3a3230'; ctx.beginPath(); ctx.arc(0, -12.4, 4.8, Math.PI*.95, Math.PI*2.05); ctx.fill(); ctx.fillRect(-4.8, -12.4, 1.8, 7); ctx.fillStyle = 'rgba(200,200,205,.6)'; ctx.fillRect(-3.4, -16, .7, 3.6); ctx.fillRect(1, -16.6, .6, 3); ctx.fillRect(-4.6, -11, .6, 4); // iron-streaked
    ctx.strokeStyle = '#4a3220'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(1.6, 1); ctx.lineTo(10.6, -.8); ctx.stroke(); ctx.strokeStyle = '#8d8a86'; ctx.lineWidth = .9; ctx.beginPath(); ctx.moveTo(8.6, -4.6); ctx.lineTo(8.6, 3); ctx.stroke(); },
  /* Mappo: a Trell, huge, deep brown, braids full of fetishes, leather over hide, the bag over his shoulder and the bone club */
  mappo(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.3, 1.26);
    h.legs('#3a2a1c'); poly(ctx, [[-7.6,-6.4],[7.6,-6.4],[8,8],[-8,8]], h.armor('#6a5038', '#22160c')); ctx.fillStyle = '#3a2614'; ctx.fillRect(-8, 3.6, 16, 1.4);
    B2F.line(ctx, '#2a1a0e', 1.4, [[-6, -6], [5, 5]], 'butt'); ell(ctx, 6.4, 6.4, 4, 3.4, '#4a321c'); ell(ctx, 6.4, 5.6, 3.6, 1.2, 'rgba(255,220,170,.12)'); // the bag
    h.head('#6a4630', 5, -11); ctx.fillStyle = 'rgba(232,212,160,.8)'; ctx.fillRect(-.8, -11.6, 1.1, 1); ctx.fillRect(2.2, -11.6, 1.1, 1); ctx.fillStyle = '#efe6cc'; ctx.fillRect(-1.4, -7.8, .9, 1.6); ctx.fillRect(2.4, -7.8, .9, 1.6); // sand-coloured eyes; the big canines
    B2F.cap(ctx, '#0e0a08', 5.2, -12.6); B2F.braids(ctx, '#0e0a08', 10, -12.6); ctx.fillStyle = '#c8a24a'; ctx.fillRect(-5.8, -6, 2.2, 1); ctx.fillRect(3.6, -4, 2.2, 1); ctx.fillStyle = '#d8ccb0'; ctx.fillRect(-5.8, -8.4, 2.2, .8); // fetishes in the braids
    ctx.strokeStyle = '#c8a870'; ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-8, 8); ctx.lineTo(-11.6, -6); ctx.stroke(); ctx.lineCap = 'butt'; ell(ctx, -11.8, -7, 2.4, 2.6, '#d8b878'); ctx.fillStyle = '#efe6cc'; for (let i=0;i<4;i++) ctx.fillRect(-14 + i*1.4, -9.6, .7, 1.2); // the bone club
    ctx.restore(); },
  /* Icarium: tall, lean, grey, long grey braid, the antler bow */
  icarium(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.02, 1.24); h.legs('#2a2a2a'); h.torso('#5a5a52', '#1e1e1a', 5.8); ctx.fillStyle = '#3a3226'; ctx.fillRect(-5.8, 3.4, 11.6, 1.2);
    h.head('#8a9088', 4.2, -11.4); h.look('rgba(230,230,200,.6)', -11.6); B2F.cap(ctx, '#9a9a94', 4.4, -12.8); ctx.fillStyle = '#9a9a94'; ctx.fillRect(-4.6, -12.8, 1.4, 14);
    ctx.strokeStyle = '#8a6a44'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-8, -12); ctx.quadraticCurveTo(-11, -2, -8, 8); ctx.stroke(); ctx.restore(); },
  /* Leoman: lean, dark, light-blue eyes, a scarf over a peaked iron helm, two morning stars at his belt */
  leoman(ctx, h, t, o){ h.legs('#2a2218'); B2F.robe(ctx, h, '#8a7a5e', '#2e281c', 6, 7.6); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(-6, 2.6, 12, 1.4);
    h.head('#6a4630', 4.3, -11.2); ctx.fillStyle = 'rgba(170,210,240,.9)'; ctx.fillRect(-.9, -11.5, 1.2, 1); ctx.fillRect(2, -11.5, 1.2, 1); // the pale eyes
    poly(ctx, [[-5.2,-12.6],[0,-19.4],[5.2,-12.6]], h.armor('#8a8680', '#2a2826')); ctx.fillStyle = '#c8bca4'; ctx.fillRect(-5.6, -13.2, 11.2, 1.6); poly(ctx, [[-5.6,-12],[-2.4,-12],[-3.6,-4],[-7,-5]], '#c8bca4'); // the peaked helm, the scarf wound round it
    const sw = o.still ? 0 : Math.sin(t/300 + (o.phase||0))*.8;
    [[-5.6, 4], [5.6, 4]].forEach(([x, y], i) => { B2F.line(ctx, '#4a3220', 1.1, [[x, y], [x + (i ? 1.4 : -1.4), y + 4]]); B2F.line(ctx, '#7a7670', .5, [[x + (i ? 1.4 : -1.4), y + 4], [x + (i ? 2 : -2) + sw, y + 7]]); ell(ctx, x + (i ? 2 : -2) + sw, y + 7.6, 1.3, 1.3, '#5a5650'); }); }, // the morning stars, hung at the belt
  /* the Toblakai: a giant, a tattooed face, a wooden sword */
  toblakai(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, 1.34, 1.42); h.legs('#2a1e16'); h.torso('#6a5a46', '#221a12', 7.2); h.head('#7a6450', 4.8, -11.2); h.look('rgba(20,12,8,.85)', -11.4);
    ctx.strokeStyle = 'rgba(30,40,60,.55)'; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(-3, -13); ctx.lineTo(-.6, -8); ctx.moveTo(1, -14); ctx.lineTo(3.4, -9); ctx.moveTo(-2, -10.4); ctx.lineTo(3, -10); ctx.stroke(); B2F.cap(ctx, '#1a1210', 5, -12.6, 1, 2); ctx.restore(); },
  /* the prophetess, small and seated is how the vision sees her; stood up, a small woman in a dark robe with silver on her hand */
  shaik(ctx, h, t, o){ ctx.save(); B2F.grow(ctx, .86, .86); B2F.robe(ctx, h, '#4a3a3a', '#1a1214', 5.6, 7.6); h.head('#b08a64', 4.2, -11.2); h.look('rgba(20,10,8,.85)', -11.6);
    B2F.cap(ctx, '#0c0808', 4.5, -12.6); ctx.fillStyle = '#0c0808'; ctx.fillRect(-4.6, -12.6, 1.6, 8); ctx.fillStyle = '#c8c8d0'; ctx.fillRect(-7, 1, 1.2, 1.2); ctx.restore(); },
  /* a bhok'aral, small, crouched */
  moby(ctx, h, t, o){ ell(ctx, 0, 8, 4, 4.6, '#5a4a3a'); ell(ctx, 0, 2.6, 3, 2.8, '#6a5a48'); ctx.fillStyle = 'rgba(255,220,150,.8)'; ctx.fillRect(.4, 2, .8, .8); ctx.fillRect(2, 2, .8, .8); poly(ctx, [[-3,6],[-8,1],[-4,8]], '#4a3a2a'); poly(ctx, [[3,6],[8,1],[4,8]], '#4a3a2a'); },
});

/* ---------------- backdrops ---------------- */
const B2VB = {
  sky(ctx, W, H, top, bot, y = H){ ctx.fillStyle = vgrad(ctx, 0, y, [[0, top], [1, bot]]); ctx.fillRect(0, 0, W, y + 1); },
  stars(ctx, W, H, T, n, ymax = .55, a = .7){ for (let i=0;i<n;i++){ ctx.globalAlpha = a*(.4 + .6*Math.abs(Math.sin(T/900 + i))); ctx.fillStyle = '#e8e0ff'; ctx.fillRect(hash(i,1)*W, hash(i,2)*H*ymax, 1.2, 1.2); } ctx.globalAlpha = 1; },
  /* a band of dunes: soft humps, lit from one side */
  dunes(ctx, W, H, y, c, amp, seed, rim){ ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, H); for (let x=0;x<=W + 8;x+=8) ctx.lineTo(x, y - Math.abs(Math.sin(x/W*3.1 + seed))*amp - hash(Math.round(x/8), seed)*amp*.12); ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
    if (rim) { ctx.strokeStyle = rim; ctx.lineWidth = 1; ctx.beginPath(); for (let x=0;x<=W + 8;x+=8){ const yy = y - Math.abs(Math.sin(x/W*3.1 + seed))*amp - hash(Math.round(x/8), seed)*amp*.12; x ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); } },
  rock(ctx, x, y, s, c){ poly(ctx, [[x - s, y],[x - s*.8, y - s*.5],[x - s*.2, y - s*.7],[x + s*.5, y - s*.55],[x + s, y - s*.1],[x + s*.9, y]], c); },
  palm(ctx, x, y, s, c, T){ B2F.line(ctx, c, 1.6*s, [[x, y], [x + 2*s, y - 10*s], [x + 3*s, y - 20*s]]); for (let i=0;i<6;i++){ const a = -Math.PI*.95 + i*Math.PI/5.4 + Math.sin(T/900 + i + x)*.06; B2F.line(ctx, c, 1.2*s, [[x + 3*s, y - 20*s], [x + 3*s + Math.cos(a)*6*s, y - 20*s + Math.sin(a)*3*s - 2*s], [x + 3*s + Math.cos(a)*10*s, y - 20*s + Math.sin(a)*2*s + 3*s]]); } },
  tent(ctx, x, y, s, c){ poly(ctx, [[x - 8*s, y],[x - 2*s, y - 7*s],[x + 1*s, y - 8*s],[x + 8*s, y]], c); },
  roots(ctx, W, H, y0, T, n, c){ ctx.strokeStyle = c; ctx.lineCap = 'round'; for (let i=0;i<n;i++){ const yy = y0 + hash(i, 61)*(H - y0), d = (yy - y0)/(H - y0), x = hash(i, 62)*W, w = 20 + d*90; ctx.lineWidth = 1 + d*4; ctx.beginPath(); ctx.moveTo(x - w, yy); ctx.quadraticCurveTo(x, yy - 4 - d*14 - hash(i, 63)*6, x + w, yy + (hash(i, 64) - .5)*6); ctx.stroke(); } ctx.lineCap = 'butt'; },
  fire(ctx, x, y, T, k = 1){ const f = REDUCE() ? 1 : .86 + Math.sin(T/120)*.07 + Math.sin(T/47)*.05; glow(ctx, x, y - 4*k, 46*k, '#ff8a30', .28*f); poly(ctx, [[x - 5*k, y],[x - 2*k, y - 10*k*f],[x, y - 4*k],[x + 2*k, y - 13*k*f],[x + 5*k, y]], '#e8642a'); poly(ctx, [[x - 2.4*k, y],[x, y - 7*k*f],[x + 2.4*k, y]], '#ffc060'); },
};
Object.assign(VISBG, {
  /* the Holy Desert before dawn; at the shot, dawn; the hollow with the dead fire and the three by it */
  raraku(ctx, W, H, T, v){ const s = v.step || 0, dawn = s >= 2 ? Math.min(1, (s - 1)*.55) : 0;
    B2VB.sky(ctx, W, H, dawn ? '#3a3c5e' : '#090a1a', dawn ? '#e8b878' : '#1c1a34', H*.6); if (dawn < 1) B2VB.stars(ctx, W, H, T, 60, .5, 1 - dawn); if (dawn) glow(ctx, W*.86, H*.58, W*.5, '#ffd890', .3*dawn);
    B2VB.dunes(ctx, W, H, H*.6, dawn ? '#8a6a4a' : '#221a22', 10, 1, dawn ? 'rgba(255,220,160,.35)' : null); B2VB.dunes(ctx, W, H, H*.72, dawn ? '#6a4a32' : '#18121a', 14, 2.4);
    const hx = W*.66, hy = H*.74; ell(ctx, hx, hy + 4, 18, 3, 'rgba(255,120,60,.18)'); ctx.fillStyle = 'rgba(255,140,60,.55)'; ctx.fillRect(hx - 2, hy + 2, 4, 1.2); // the dead fire, a few embers
    if (s <= 2) drawFigure(ctx, 'shaik', hx + 10, hy, 1.4, T, {still:true, dir:-1}); else ell(ctx, hx + 12, hy + 10, 7, 2.2, '#140c0c');
    drawFigure(ctx, 'leoman', hx - 12, hy, 1.4, T, {still:s < 3, dir:1, phase:1}); drawFigure(ctx, 'toblakai', hx + 30, hy, 1.4, T, {still:s < 3, dir:-1, phase:2});
    B2VB.rock(ctx, W*.2, H, W*.24, dawn ? '#3a2418' : '#0c080c'); B2VB.rock(ctx, W*.42, H, W*.1, dawn ? '#2a1a12' : '#0a070a');
    if (s === 3) for (let i=0;i<5;i++) drawFigure(ctx, 'redblade', W*(.36 + i*.05) + Math.sin(T/400 + i)*3, H*.8, 1.5, T, {phase:i, dir:1});
    return {fx:W*.18, fy:H*.8, fs:2.2}; },
  /* the canyon, after: red walls, a strip of morning sky, a horse */
  canyon(ctx, W, H, T){ B2VB.sky(ctx, W, H, '#5a6a8a', '#e8c89a', H*.5); ctx.fillStyle = vgrad(ctx, H*.5, H, [[0, '#8a5a3a'], [1, '#4a2a1a']]); ctx.fillRect(0, H*.5, W, H*.5);
    poly(ctx, [[0,0],[W*.36,0],[W*.3,H*.3],[W*.38,H*.6],[W*.28,H],[0,H]], '#5a2a1a'); poly(ctx, [[W,0],[W*.66,0],[W*.72,H*.34],[W*.62,H*.62],[W*.74,H],[W,H]], '#4a2214');
    ctx.fillStyle = 'rgba(255,200,140,.18)'; ctx.fillRect(W*.3, 0, W*.06, H*.6); ctx.fillStyle = '#6a4a30'; ctx.fillRect(0, H*.88, W, H*.12);
    drawFigure(ctx, 'redblade', W*.58, H*.84, 2, T, {still:true, dir:-1});
    return {fx:W*.42, fy:H*.82, fs:2.3}; },
  /* the otataral desert by night: red dust, the jade finger, the fouled spring; then the tear; then morning */
  otataral(ctx, W, H, T, v){ const s = v.step || 0, morn = s >= 4;
    B2VB.sky(ctx, W, H, morn ? '#4a3a4a' : '#0c0610', morn ? '#e8906a' : '#3a141a', H*.62); if (!morn) B2VB.stars(ctx, W, H, T, 70, .55);
    if (s === 3) { const p = REDUCE() ? 1 : .7 + Math.sin(T/160)*.3; ctx.strokeStyle = `rgba(255,236,210,${.75*p})`; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(W*.18, H*.08); ctx.lineTo(W*.32, H*.16); ctx.lineTo(W*.38, H*.1); ctx.lineTo(W*.52, H*.22); ctx.lineTo(W*.6, H*.14); ctx.lineTo(W*.78, H*.2); ctx.stroke(); glow(ctx, W*.48, H*.16, W*.3, '#ffd0a0', .16*p); }
    const jx = W*.84; poly(ctx, [[jx - 7, H*.66],[jx - 6, H*.2],[jx - 3, H*.14],[jx + 3, H*.14],[jx + 6, H*.2],[jx + 7, H*.66]], b2vGrad(ctx, jx, '#3a8a6a', '#0e2a20', H)); ctx.fillStyle = 'rgba(160,230,200,.35)'; ctx.fillRect(jx - 5, H*.2, 1.4, H*.4); ctx.fillStyle = 'rgba(10,30,20,.5)'; ctx.fillRect(jx - 7, H*.36, 14, 1.4); ell(ctx, jx, H*.15, 4.6, 2.2, 'rgba(200,240,220,.4)'); // the finger: knuckle and nail
    B2VB.dunes(ctx, W, H, H*.66, morn ? '#a0522e' : '#3a1612', 8, 3.2); B2VB.dunes(ctx, W, H, H*.8, morn ? '#7a3a20' : '#2a0e0c', 10, 1.4);
    ell(ctx, W*.56, H*.86, 26, 5, morn ? '#4a5a2a' : '#1e2614'); ell(ctx, W*.56, H*.855, 20, 3, 'rgba(120,150,60,.4)'); // the fouled spring
    if (!morn) { ell(ctx, W*.66, H*.94, 12, 3, '#1a0c0a'); drawFigure(ctx, 'baudin', W*.7, H*.92, 1.7, T, {still:true, dir:-1}); } else { drawFigure(ctx, 'heboric', W*.64, H*.9, 1.8, T, {dir:1, phase:1}); drawFigure(ctx, 'baudin', W*.76, H*.9, 1.8, T, {dir:1, phase:2}); }
    return {fx:W*.3, fy:H*.82, fs:2.2}; },
  /* the Imperial Warren: ash and pewter; the pit and its machine; then Kallor's dome */
  impwarren(ctx, W, H, T, v){ const s = v.step || 0;
    B2VB.sky(ctx, W, H, '#5a5a62', '#8a8884', H*.58); for (let i=0;i<3;i++) cloud(ctx, W*(.2 + i*.3), H*(.16 + i*.05), W*.3, 3, s === 1 ? '#3a3a40' : '#a8a6a2', .14);
    ctx.fillStyle = '#6e6a66'; ctx.fillRect(0, H*.58, W, H); for (let i=0;i<60;i++) ell(ctx, hash(i,21)*W, H*(.6 + hash(i,22)*.4), 6 + hash(i,23)*20, 1.2, 'rgba(40,38,36,.18)');
    for (let i=0;i<5;i++){ const x = W*(.08 + i*.2 + hash(i,24)*.06), h = H*(.06 + hash(i,25)*.1); ctx.fillStyle = '#4a4644'; ctx.fillRect(x, H*.58 - h, 6 + hash(i,26)*10, h); ctx.fillRect(x + 3, H*.58 - h - 4, 3, 4); }
    if (s === 1) { ell(ctx, W*.6, H*.8, W*.2, H*.1, '#3a3634'); for (let k=0;k<4;k++) ell(ctx, W*.6, H*(.8 + k*.012), W*(.18 - k*.03), H*(.08 - k*.014), k%2 ? '#4a4440' : '#2e2a28');
      ctx.strokeStyle = '#4a7a6a'; ctx.lineWidth = 1.4; for (let k=0;k<3;k++){ ctx.beginPath(); ctx.ellipse(W*.6, H*.82, 10 + k*7, 3 + k*2, 0, Math.PI, Math.PI*2); ctx.stroke(); } }
    if (s >= 3) { const dx = W*.66, dy = H*.62; ctx.beginPath(); ctx.arc(dx, dy, 26, Math.PI, 0); ctx.fillStyle = b2vGrad(ctx, dx, '#6a9a7a', '#2a4a3a', H); ctx.fill(); ctx.fillStyle = '#6e6a66'; ctx.fillRect(dx - 30, dy - 2, 60, 6); ctx.fillStyle = '#1a2a22'; ctx.fillRect(dx - 5, dy - 12, 10, 12);
      ctx.strokeStyle = '#d8c070'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(dx - 6, dy - 15); ctx.lineTo(dx - 6, dy - 19); ctx.lineTo(dx - 3, dy - 16); ctx.lineTo(dx, dy - 20); ctx.lineTo(dx + 3, dy - 16); ctx.lineTo(dx + 6, dy - 19); ctx.lineTo(dx + 6, dy - 15); ctx.closePath(); ctx.stroke(); } // the crown over its door
    if (s < 3) { drawFigure(ctx, 'kalam', W*.78, H*.8, 1.7, T, {dir:1, phase:1}); drawFigure(ctx, 'keneb', W*.5, H*.86, 1.8, T, {dir:1, phase:2}); drawFigure(ctx, 'child', W*.56, H*.88, 1.8, T, {dir:1, phase:3}); drawFigure(ctx, 'child', W*.6, H*.88, 1.8, T, {dir:1, phase:4}); drawFigure(ctx, 'hissari_w', W*.64, H*.88, 1.8, T, {dir:1, phase:5}); }
    else drawFigure(ctx, 'kalam', W*.5, H*.82, 1.8, T, {still:true, dir:1});
    if (s === 2) B2VB.fire(ctx, W*.48, H*.9, T, .8);
    return {fx:W*.26, fy:H*.82, fs:2.3}; },
  /* Aren from its city of tombs: night, lamps on the walls, the sea */
  aren(ctx, W, H, T){ B2VB.sky(ctx, W, H, '#0a0c1e', '#2a2a44', H*.6); B2VB.stars(ctx, W, H, T, 40, .45);
    ctx.fillStyle = '#16141e'; ctx.fillRect(0, H*.5, W, H*.1); for (let i=0;i<14;i++){ const x = W*(.3 + i*.05); ctx.fillRect(x, H*(.42 - hash(i,31)*.08), 6 + hash(i,32)*8, H*.12); }
    for (let i=0;i<8;i++){ const x = W*(.32 + i*.08), y = H*(.46 + hash(i,33)*.04); glow(ctx, x, y, 12, '#e8b060', .35 + Math.sin(T/500 + i)*.05); ctx.fillStyle = '#ffd890'; ctx.fillRect(x - .7, y - .7, 1.4, 1.4); }
    ctx.fillStyle = '#121a2a'; ctx.fillRect(0, H*.6, W*.3, H*.06); ctx.fillStyle = 'rgba(160,190,230,.15)'; ctx.fillRect(0, H*.62, W*.3, 1);
    ctx.fillStyle = '#0c0a10'; ctx.fillRect(0, H*.66, W, H); for (let i=0;i<9;i++){ const x = W*(.06 + i*.11), h = H*(.08 + hash(i,34)*.1); ctx.fillStyle = '#1a1820'; ctx.fillRect(x, H*.78 - h, 14, h); poly(ctx, [[x - 2, H*.78 - h],[x + 7, H*.78 - h - 8],[x + 16, H*.78 - h]], '#1a1820'); } // tombs
    return {fx:W*.3, fy:H*.82, fs:2.3}; },
  /* the root plain under a sky that cannot settle on a colour; the fire; the Jhag; the girl; at the end, the Hounds */
  roots(ctx, W, H, T, v){ const s = v.step || 0, hue = REDUCE() ? 0 : Math.sin(T/3000);
    B2VB.sky(ctx, W, H, `rgb(${40 + hue*16|0},${30 + hue*-10|0},${60 + hue*20|0})`, `rgb(${70 + hue*30|0},${80 - hue*20|0},${70 + hue*10|0})`, H*.56);
    ctx.fillStyle = '#1c1a14'; ctx.fillRect(0, H*.56, W, H); B2VB.roots(ctx, W, H, H*.56, T, 46, 'rgba(70,56,38,.85)'); B2VB.roots(ctx, W, H, H*.6, T, 20, 'rgba(110,90,60,.35)');
    if (s >= 3) { poly(ctx, [[W*.62, H*.56],[W*.7, H*.38],[W*.74, H*.46],[W*.8, H*.32],[W*.86, H*.46],[W*.92, H*.36],[W, H*.5],[W, H*.56]], '#14120e'); // the maze, ahead
      for (let i=0;i<5;i++){ ctx.save(); ctx.translate(W*(.34 + i*.11), H*(.72 + (i%2)*.06)); ctx.scale(-.85, .85); drawHound(ctx, {gait:REDUCE() ? 0 : Math.sin(T/260 + i)*.3, rim:'#c9bbff'}); ctx.restore(); } }
    else if (s <= 1) { B2VB.fire(ctx, W*.56, H*.82, T, 1); drawFigure(ctx, 'icarium', W*.48, H*.84, 1.9, T, {still:true, dir:1}); drawFigure(ctx, 'sorry', W*.66, H*.84, 1.8, T, {still:true, dir:-1});
      for (let i=0;i<3;i++) ell(ctx, W*(.72 + i*.08), H*(.92 + hash(i,41)*.03), 9, 2.6, '#0c0a08'); }
    else { ell(ctx, W*.56, H*.84, 8, 2, 'rgba(40,30,20,.8)'); drawFigure(ctx, 'icarium', W*.5, H*.9, 2.1, T, {still:true, dir:-1}); } // morning: the fire out, the Jhag standing, listening
    return {fx:W*.22, fy:H*.82, fs:2.2}; },
  /* the oasis camp: palms, tents, ruins, the platform; the crowd; the whirlwind */
  oasis(ctx, W, H, T, v){ const s = v.step || 0, storm = s >= 3;
    B2VB.sky(ctx, W, H, storm ? '#6a5a4a' : '#5a86b0', storm ? '#c8a070' : '#e8d8b0', H*.56);
    if (storm) { const sw = REDUCE() ? 0 : T/400, cx = W*.6; ctx.fillStyle = 'rgba(150,110,70,.6)'; ctx.beginPath(); ctx.moveTo(cx - W*.08, H*.6); ctx.quadraticCurveTo(cx - W*.14, H*.3, cx - W*.4, 0); ctx.lineTo(cx + W*.4, 0); ctx.quadraticCurveTo(cx + W*.14, H*.3, cx + W*.08, H*.6); ctx.fill();
      for (let i=0;i<14;i++){ const k = i/14, y = H*.6*(1 - k), w = W*(.08 + k*k*.32 + k*.04), wv = Math.sin(sw + i)*W*.012; ctx.strokeStyle = `rgba(230,190,140,${.18 + k*.12})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(cx + wv, y, w, 2 + k*4, 0, 0, Math.PI*2); ctx.stroke(); }
      ctx.fillStyle = '#1a1210'; ctx.fillRect(cx, 4, 1, 18); ctx.fillStyle = '#7a2a1a'; ctx.fillRect(cx + 1, 4, 10 + Math.sin(T/200)*1.5, 6); } // the banner
    ctx.fillStyle = '#b89a70'; ctx.fillRect(0, H*.56, W, H);
    for (let i=0;i<6;i++){ ctx.fillStyle = '#9a7e58'; ctx.fillRect(W*(.04 + i*.17), H*(.48 + hash(i,51)*.04), W*.05, H*.1); } // broken walls
    for (let i=0;i<7;i++) B2VB.palm(ctx, W*(.08 + i*.14 + hash(i,52)*.04), H*.62, .9 + hash(i,53)*.3, '#2e3a1e', T);
    for (let i=0;i<10;i++) B2VB.tent(ctx, W*(.04 + i*.1), H*(.66 + hash(i,54)*.04), .9, hash(i,55) > .5 ? '#d8c8a8' : '#8a6a4a');
    if (s >= 2) { for (let i=0;i<260;i++){ const x = hash(i,56)*W, y = H*(.74 + hash(i,57)*.24), d = (y - H*.74)/(H*.26); ell(ctx, x, y, 1.2 + d*1.6, .8 + d*.8, `rgba(${40 + hash(i,58)*30|0},${28 + hash(i,59)*20|0},20,.8)`); } // the crowd, kneeling
      ctx.fillStyle = '#5a4430'; ctx.fillRect(W*.54, H*.7, W*.12, H*.04); drawFigure(ctx, 'felisin', W*.6, H*.69, 1.3, T, {still:true, dir:-1});
      for (let i=0;i<3;i++) drawFigure(ctx, 'hissari_m', W*(.48 + i*.04), H*.8, 1.3, T, {still:true, dir:1, phase:i + 1}); drawFigure(ctx, 'toblakai', W*.7, H*.82, 1.4, T, {still:true, dir:-1}); }
    else { drawFigure(ctx, 'felisin', W*.5, H*.86, 1.9, T, {dir:1}); drawFigure(ctx, 'heboric', W*.58, H*.86, 1.9, T, {dir:1, phase:1}); drawFigure(ctx, 'toblakai', W*.7, H*.86, 1.9, T, {dir:1, phase:2}); }
    return {fx:W*.26, fy:H*.82, fs:2.3}; },
  /* Tremorlor's yard: roots, the squat House and its door; the swarm; the door opening */
  tremorlor(ctx, W, H, T, v){ const s = v.step || 0, open = s >= 2;
    B2VB.sky(ctx, W, H, '#1e2a24', '#5a6a4a', H*.5); ctx.fillStyle = '#2a2418'; ctx.fillRect(0, H*.5, W, H); B2VB.roots(ctx, W, H, H*.52, T, 40, 'rgba(60,46,30,.9)');
    const hx = W*.6, hw = W*.3, hy = H*.66; ctx.fillStyle = '#1a1612'; ctx.fillRect(hx - hw/2, hy - H*.34, hw, H*.34); poly(ctx, [[hx - hw/2 - 6, hy - H*.34],[hx, hy - H*.5],[hx + hw/2 + 6, hy - H*.34]], '#141008'); ctx.fillRect(hx + hw*.3, hy - H*.56, 12, H*.2); // the House, and its tower
    ctx.fillStyle = open ? '#e8c890' : '#0a0806'; ctx.fillRect(hx - 8, hy - 24, 16, 24); if (open) glow(ctx, hx, hy - 12, 50, '#ffd090', .3); ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 1.4; ctx.strokeRect(hx - 8, hy - 24, 16, 24);
    for (let i=0;i<3;i++){ ctx.fillStyle = 'rgba(200,180,120,.25)'; ctx.fillRect(hx - hw*.4 + i*hw*.3, hy - H*.26, 5, 7); }
    if (s <= 1) { for (let i=0;i<220;i++){ const a = hash(i,71)*6.28 + T/(600 + hash(i,72)*400), r = 10 + hash(i,73)*W*.12; ctx.fillStyle = 'rgba(20,10,10,.85)'; ctx.fillRect(W*.2 + Math.cos(a)*r*1.6, H*.24 + Math.sin(a)*r*.5, 1.4, 1.2); } // the swarm
      for (let i=0;i<5;i++){ ctx.save(); ctx.translate(W*(.12 + i*.07), H*(.82 + (i%2)*.06)); ctx.scale(.6, .6); drawHound(ctx, {gait:REDUCE() ? 0 : Math.sin(T/200 + i)*.4, rim:'#c9bbff'}); ctx.restore(); }
      if (s === 1) { drawFigure(ctx, 'mappo', W*.4, H*.9, 1.7, T, {dir:-1}); drawFigure(ctx, 'icarium', W*.37, H*.9, 1.7, T, {dir:1, phase:1}); } }
    if (s === 2) drawFigure(ctx, 'moby', hx + 2, hy - 4, 1.6, T, {dir:-1});
    return {fx:hx - 22, fy:hy, fs:2.1}; },
  /* inside the House: a long hall, dust in the light; at the door, the bell and the carriage */
  azath(ctx, W, H, T, v){ const s = v.step || 0;
    B2VB.sky(ctx, W, H, '#1a140e', '#3a2a1a', H); ctx.fillStyle = '#2a2016'; ctx.fillRect(0, H*.76, W, H);
    poly(ctx, [[0, 0],[W*.36, H*.3],[W*.36, H*.7],[0, H]], '#22180e'); poly(ctx, [[W, 0],[W*.64, H*.3],[W*.64, H*.7],[W, H]], '#1e160c'); ctx.fillStyle = '#0a0806'; ctx.fillRect(W*.36, H*.3, W*.28, H*.4); // the hall going back too far
    glow(ctx, W*.5, H*.3, W*.3, '#e8c890', .12); for (let i=0;i<22;i++){ ctx.fillStyle = 'rgba(230,210,170,.4)'; ctx.fillRect((hash(i,81)*W + T*.004*(1 + hash(i,82))) % W, H*(.1 + hash(i,83)*.6), 1, 1); }
    if (s === 3) { ctx.fillStyle = '#1a1410'; ctx.fillRect(W*.78, H*.5, 18, 24); drawFigure(ctx, 'mappo', W*.24, H*.92, 1.6, T, {still:true, dir:1}); drawFigure(ctx, 'icarium', W*.18, H*.92, 1.6, T, {still:true, dir:1}); ell(ctx, W*.8 + 9, H*.5, 6, 7, '#5a4a3a'); } // the dead keeper in its chair
    if (s === 4) { ctx.fillStyle = '#4a5a3a'; ctx.fillRect(W*.62, H*.36, W*.34, H*.4); ctx.fillStyle = '#e8d0a0'; ctx.globalAlpha = .25; ctx.fillRect(W*.62, H*.36, W*.34, H*.4); ctx.globalAlpha = 1; // the open door, daylight outside
      ctx.fillStyle = '#2a1a10'; ctx.fillRect(W*.82, H*.46, W*.12, H*.2); ell(ctx, W*.84, H*.68, 5, 5, '#1a120a'); ell(ctx, W*.92, H*.68, 5, 5, '#1a120a'); for (let i=0;i<4;i++) ell(ctx, W*(.82 + i*.03), H*(.42 - (REDUCE() ? 0 : ((T/900 + i*.3) % 1))*.1), 4, 2, 'rgba(220,210,190,.3)'); // the scorched carriage, steaming
      drawFigure(ctx, 'karpolan', W*.72, H*.8, 2.1, T, {dir:-1}); }
    return {fx:W*.44, fy:H*.82, fs:2.2}; },
  /* Malaz City at night: wet cobbles, shut shutters, the keep on the cliff */
  malaz(ctx, W, H, T, v){ const s = v.step || 0;
    B2VB.sky(ctx, W, H, '#06070e', '#1e2030', H*.6); B2VB.stars(ctx, W, H, T, 30, .3, .5);
    poly(ctx, [[W*.56, H*.6],[W*.6, H*.26],[W*.7, H*.2],[W*.84, H*.22],[W*.9, H*.36],[W, H*.4],[W, H*.6]], '#0e0d12'); ctx.fillStyle = '#16141c'; ctx.fillRect(W*.66, H*.1, W*.14, H*.12); ctx.fillRect(W*.68, H*.04, 8, H*.08); ctx.fillRect(W*.76, H*.06, 8, H*.06); // Mock's Hold on its cliff
    glow(ctx, W*.72, H*.16, 14, '#e8b060', .3); ctx.fillStyle = '#ffd890'; ctx.fillRect(W*.72 - 1, H*.16 - 1, 2, 2);
    ctx.fillStyle = '#121a26'; ctx.fillRect(0, H*.56, W*.56, H*.08); ctx.fillStyle = 'rgba(140,170,210,.12)'; for (let i=0;i<6;i++) ctx.fillRect(hash(i,91)*W*.5, H*(.58 + hash(i,92)*.05), 12, 1); // the harbour
    ctx.fillStyle = '#0a090e'; ctx.fillRect(0, 0, W*.16, H); ctx.fillRect(W*.86, H*.4, W*.14, H); ctx.fillStyle = '#16141a'; ctx.fillRect(0, H*.84, W, H); // alley walls; the cobbles
    for (let i=0;i<12;i++) ell(ctx, hash(i,93)*W, H*(.86 + hash(i,94)*.12), 8, 1.2, 'rgba(120,140,180,.12)'); if (s !== 2) { glow(ctx, W*.2, H*.44, 70, '#e8b060', .28); ctx.fillStyle = '#ffd890'; ctx.fillRect(W*.2 - 1.5, H*.44, 3, 5); } // one shuttered lamp left burning
    if (s === 1) drawFigure(ctx, 'minala', W*.6, H*.84, 2, T, {dir:-1}); if (s === 4) { drawFigure(ctx, 'minala', W*.42, H*.84, 2, T, {dir:-1}); drawFigure(ctx, 'fiddler', W*.7, H*.84, 2, T, {dir:-1, phase:1}); drawFigure(ctx, 'sorry', W*.76, H*.84, 1.9, T, {dir:-1, phase:2, still:true}); }
    if (s <= 1) for (let i=0;i<2;i++) drawFigure(ctx, 'clawknife', W*(.78 + i*.08), H*.86, 1.8, T, {dir:-1, phase:i, alpha:.55});
    return {fx:W*.28, fy:H*.82, fs:2.3}; },
  /* the room in the Old Keep: dark, one slit of night, a chair that might hold someone */
  darkroom(ctx, W, H, T){ B2VB.sky(ctx, W, H, '#040406', '#0c0b10', H); ctx.fillStyle = '#16182a'; ctx.fillRect(W*.7, H*.14, 6, H*.24); glow(ctx, W*.7 + 3, H*.26, 30, '#6a7aa0', .12);
    ctx.fillStyle = '#0a090c'; ctx.fillRect(W*.6, H*.5, W*.12, H*.34); ctx.fillRect(W*.6, H*.36, 4, H*.16); ctx.fillRect(W*.6 + W*.12 - 4, H*.36, 4, H*.16); // a chair, or something sitting in one
    return {fx:W*.3, fy:H*.82, fs:2.3}; },
  /* the reader, back at the column's fire: desert stars, a cart, a blanket, the card */
  b2deck(ctx, W, H, T){ B2VB.sky(ctx, W, H, '#050408', '#1a1418', H*.7); B2VB.stars(ctx, W, H, T, 50, .5, .6); ctx.fillStyle = '#120e0c'; ctx.fillRect(0, H*.72, W, H);
    ctx.fillStyle = '#0a0806'; ctx.fillRect(W*.66, H*.56, W*.24, H*.12); ell(ctx, W*.7, H*.7, 7, 7, '#0a0806'); ell(ctx, W*.86, H*.7, 7, 7, '#0a0806'); // a handcart
    B2VB.fire(ctx, W*.64, H*.86, T, 1.8); ctx.fillStyle = '#3a2a22'; ctx.fillRect(W*.4, H*.88, W*.14, H*.06);
    ctx.save(); ctx.translate(W*.47, H*.86); ctx.rotate(-.08); ctx.fillStyle = '#d8ccb0'; ctx.fillRect(-9, -13, 18, 26); ctx.fillStyle = 'rgba(150,120,220,.5)'; ctx.fillRect(-7, -11, 14, 22); ctx.restore();
    return {fx:W*.3, fy:H*.82, fs:2.4}; },
});
/* a vertical gradient helper for the stone and copper (x is unused; kept so calls read like the h.armor ones) */
function b2vGrad(ctx, x, c1, c2, H){ return vgrad(ctx, 0, H*.7, [[0, c1], [1, c2]]); }
