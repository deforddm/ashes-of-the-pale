/* ============ data ============ */
const TPL = {
  sgt:{name:'',role:'Sergeant',sig:'S',col:'#d6a24a',hp:22,ac:14,atk:4,dmg:[1,8,2],rng:1,mv:4,init:1,st:{might:2,wits:2,guile:1},ab:['rally','shove','salve'],
    epithet:'Fourth Squad, Seventh Company',origin:'Unta, Quon Tali',age:34,service:'Eleven years, marines',height:'Middling. Stands like something taller.',
    weapon:'Malazan longsword, notched twice, and a knife nobody has seen drawn',armour:'Boiled leather over quilting, iron cap, a shield picked up at Nathilog and never put down',
    bio:`Eleven years in the marines, three of them under Dujek. Knows which orders to follow slowly and which to follow at a run, and has never once confused the two in front of an officer.`,
    bio2:`Came up through the Untan garrison, transferred out after a promotion that was offered in place of an apology. Has buried two sergeants and refused to be the third until the company ran out of alternatives. Keeps the squad's pay ledger honest and its munitions count honester.`,
    traits:['Reads every order twice','Never sits with a back to the tent flap','Remembers the names of the dead, all of them','Drinks only after, never during'],
    gear:['Pay ledger, waterproofed','Second Army whistle, no longer used','Field kit: needle, thread, a bone saw Ohl disapproves of'],
    get quest(){ return squadQuest('sgt', `The Fourth came through the siege with all five still breathing. Somewhere in Onearm's Host, somebody has noticed.`); }},
  brisk:{name:'Brisk',role:'Corporal · Heavy infantry',sig:'B',col:'#cfc6b4',hp:26,ac:16,atk:4,dmg:[1,8,2],rng:1,mv:3,init:0,st:{might:3,wits:0,guile:0},ab:['bash','salve'],
    epithet:'"Shields, rations, and very little else."',origin:'Cawn, Quon Tali',age:29,service:'Nine years, six of them heavy infantry',height:'Tall. Wider than the doorway she is standing in.',
    weapon:'Short spear, iron-shod, and a rimmed shield that has stopped more than spears',armour:'Chain hauberk, scale gorget, greaves. Everything is scratched. Nothing is dented',
    bio:`Heavy infantry turned marine, which she considers a demotion in everything but pay. Believes in shields, rations, and very little else. Says fewer words in a week than Kettle does before breakfast.`,
    bio2:`Grew up loading barges on the Cawn docks with her brother Tavrin, called Tav, who joined the Second the year she joined the Third. She has not seen him since the Cawn wharf. She has not stopped looking. Her loyalty is slow to give and does not come back once spent.`,
    traits:['Sleeps standing, or looks like it','Will not throw a munition. Will not stand near Kettle when she does','Counts rations aloud','Prays to no one, salutes Hood anyway'],
    gear:['A letter from Tav, three years old, sealed','Whetstone','Hardtack, an unreasonable quantity'],
    get quest(){ return squadQuest('brisk', `Her brother marched with the Second Army. He isn't on any list yet, living or dead. Brisk checks the pits when nobody is watching.`); },
    banter:[`"Sergeant." That is the entire conversation, and it does not sound like a greeting.`,`"You give the orders. I'll tell you when they're stupid. Deal's held so far."`,`"Nine years I've been waiting for a sergeant worth the shield. Don't get killed. It'd be inconvenient."`],
    rel:{kettle:'Stands upwind of her. Always.',tuft:'Watches her in fights like a shield-wall watches the sky.',ohl:'Lets him talk. He is the only one she lets.',ellis:'Counted her into the rations before she had reached the wagon. Walks on her open side on the march, and has never said why.'}},
  kettle:{name:'Kettle',role:'Sapper · Moranth munitions',sig:'K',col:'#e07a45',hp:16,ac:13,atk:3,dmg:[1,8,0],rng:5,mv:4,init:2,st:{might:1,wits:2,guile:2},ab:['sharper','burner','cusser','salve'],
    epithet:'Soot to the elbows. Counts munitions like prayers.',origin:'Falar, the Strike Isles',age:26,service:'Six years, all of them sapper',height:'Short. Faster than she looks.',
    weapon:'Heavy crossbow for people, with a munitions cradle bolted under the stock. Sharpers, burners and one cusser for everything else',armour:'Leather jerkin, singed. A helmet she wears only when Brisk is looking',
    bio:`Falari, red-haired under the soot, with the sapper's habit of standing a little too close to things that are about to explode. Counts munitions the way priests count prayers, and with the same expression. Crossbow for everything a munition would waste.`,
    bio2:`Ran contraband for a Falari smuggler before the Empire made the arrangement unprofitable and the marines made it a career. Learned Moranth munitions from a sapper called Chub who lost three fingers demonstrating them and considered it a fair trade. Kettle has all her fingers. She mentions this often.`,
    traits:['Talks to munitions. Names the cussers','Bad at lying. Good at making it not matter','Cheats at bones and admits it if asked','Has never dropped anything. Has thrown a great deal'],
    gear:['Munitions ledger, every one accounted for','Trip-cord, a tin of tallow for wax plugs, a stoppered phial of acid she carries upright','A spoon she will not explain'],
    get quest(){ return squadQuest('kettle', `Owes a Moranth quartermaster something she won't name. The Moranth remember debts, and Kettle keeps checking the sky for quorls.`); },
    banter:[`"You want the count, Sergeant, ask Brisk. She's who you trust with numbers, apparently."`,`"Two sharpers, one burner, one cusser. Same as this morning. You can stop asking."`,`"You keep pointing me at things and I'll keep making them stop being things. That's love, in the sapper trade."`],
    rel:{brisk:'Calls her "the wall." Not to her face. Brisk knows.',tuft:'Shares a tent with her. Has stopped asking about the nightmares.',ohl:'He stitched her hand at Nathilog. She owes him and pays in tobacco.',ellis:'Trades her trip-cord for arrows and has never once asked what the cord is for. For Kettle, not asking is a kind of vow.'}},
  tuft:{name:'Tuft',role:'Squad mage · Meanas',sig:'T',col:'#a08de0',hp:14,ac:12,atk:4,dmg:[1,6,1],rng:4,mv:4,init:1,st:{might:0,wits:2,guile:3},ab:['veil','phantom','salve'],magic:true,
    epithet:'Quiet, and too young for her eyes.',origin:'Malaz City, the Mouse Quarter',age:19,service:'Fourteen months. Feels longer to everyone.',height:'Slight. Vanishes into a crowd of two.',
    weapon:'Shadow-lash at range, a Meanas veil up close, and a Deck of Dragons she says is for luck',armour:'A grey cloak that is sometimes not there when you look at it',
    bio:`Shadow-lash at range, illusions up close, and a battered Deck of Dragons in her sleeve that she reads when she thinks no one is watching, which is a thing a Meanas mage should be better at judging.`,
    bio2:`A Mouse Quarter foundling who found her warren the way children in that quarter find most things, by accident and at night. She was ten the night the new mage cadre came through the Quarter, with soldiers at their backs, killing every mage who wasn't on a register, nine years before Pale, and she lived by being small and very quiet, which she has been ever since. Was taken into the cadre at sixteen, spent a season attached to the High Mage's staff, and requested transfer to a marine squad with a letter that said nothing and a face that said the rest. Nobody in the Fourth has asked. Ohl came closest.`,
    traits:['Goes very still when someone says "High Mage"','Never draws a card for herself','Sleeps with a lamp lit','Laughs at exactly one thing: Kettle'],
    gear:['Deck of Dragons, wooden cards, the paint worn from the House of Shadow','A grey ribbon','A cadre badge she does not wear'],
    get quest(){ return squadQuest('tuft', `Something happened on the High Mage's staff that her transfer letter did not mention. Nobody has asked her what. The journal in the tunnels may answer it for them.`); },
    banter:[`She has taken to standing where you can't see her when she casts. It isn't tactical.`,`"The cards say nothing about you, Sergeant. I checked. That's a compliment from the Deck."`,`"When I was cadre, they used us like munitions. You use me like a marine. I'd like to keep it that way."`],
    rel:{brisk:'Stays behind the shield without being told. Brisk noticed.',kettle:'The only one she talks to after dark.',ohl:'He came closest to asking. She said "not yet" before he had finished. He has not tried again.',ellis:'Waits for her to say when to put the cards away. Ellis will not draw, but she watches every reading, and she always knows when.'}},
  ohl:{name:'Ohl',role:'Healer · Denul',sig:'O',col:'#7fb394',hp:16,ac:13,atk:2,dmg:[1,6,0],rng:1,mv:4,init:0,st:{might:1,wits:3,guile:0},ab:['mend','wash','stanch','salve'],magic:true,
    epithet:'Denul is a standing argument with Hood.',origin:'Ehrlitan, Seven Cities',age:58,service:'Twenty-two years, three armies',height:'Stooped. Was tall once and remembers it.',
    weapon:'A cudgel he calls a walking stick, and Denul, which he calls an argument',armour:'A healer\'s robe over an old hauberk. The robe has been washed. The hauberk has not',
    bio:`Old and patient, out of Seven Cities. Says Denul is less a warren than a standing argument with Hood, and that he is losing it one soldier at a time, but slowly. His hands do not shake. His voice does, sometimes, at night.`,
    bio2:`Was a temple healer in Ehrlitan when the Malazans took the city, and chose the conquerors' army over the conquered priesthood because the army had more wounded and fewer sermons. Served the Second under Dujek before Dujek was the whole army. Has patched every member of the Fourth at least once, and Kettle nine times.`,
    traits:['Reads a list at night. It is long','Will not let a soldier die alone, including enemies','Brews a tea that is technically medicine','Argues with Hood aloud, in Ehrlii, when it is going badly'],
    gear:['The list. Oilcloth. Two hundred and eleven names','Needles, gut, a Denul-blessed bone saw','Tea, and the means to make it anywhere'],
    get quest(){ return squadQuest('ohl', `Keeps a list of every soldier he couldn't save. He reads it at night. He has not added a name from the Fourth yet, and intends to die before he does.`); },
    banter:[`"I have served under sergeants who thought soldiers were munitions. They are on my list too, some of them."`,`"Drink the tea, Sergeant. It's not poison. It's just unpleasant, which is how you know."`,`"Twenty-two years and this is the squad I'd have Hood take last. Don't tell them. Brisk would be unbearable."`],
    rel:{brisk:'Calls her "child." She allows it.',kettle:'Nine stitchings. He is fond of her the way one is fond of weather.',tuft:'Worries. Says nothing. Watches the lamp.',ellis:'Toc asked the sergeant to let him look at her hand. He is waiting to be let, and he is better at waiting than she is at refusing.'}},
  ellis:{name:'Ellis',role:'Scout · Claw-trained',sig:'E',col:'#8fb3a0',hp:13,ac:13,atk:4,dmg:[1,6,1],rng:5,mv:6,init:3,st:{might:0,wits:2,guile:3},ab:['mark','salve'],
    epithet:'Cut loose on the plain. Kept the bow.',origin:'Genabaris, the river quarter',age:24,service:'Six years, the Claw\'s scouts. Ended on the Rhivi Plain.',height:'Slight, and stands like a bowstring.',
    weapon:'Rhivi horn bow, a skinning knife, and a glove she took off once, to show you, and put back on',armour:'Plains leathers dyed to grass. Nothing that rings',
    bio:`Quiet, exact, and funnier than she looks, which is not difficult. Reads ground the way Tuft reads cards and trusts it more. Was Toc the Younger's scout until the plain took the captain and Toc told her the Claw was done with her.`,
    bio2:`Recruited off a Genabaris dock at eighteen by a man who never gave his name and taught her to walk without leaving anything behind. Spent six years counting other people's sentries for the Claw. Burned her hand at Pale pulling a courier out of a tent that was already gone, and has worn a glove since. Does not talk about the courier. Does not talk about the Claw either, except once, and then briefly.`,
    traits:['Sleeps at the edge of the light, facing out','Will not draw a card. Will watch you draw one','Counts horses before people, and apologises for it','Laughs without any sound at all'],
    gear:['Forty arrows, fletched grey','A Claw scout\'s whistle, cord cut','Salve for the hand, which she rations'],
    get quest(){ return squadQuest('ellis', `Toc said the Claw was done with her. The Claw has not said so. Somewhere in Darujhistan there is a house with her name in a ledger, and she means to find out which way it is written.`); },
    banter:[`"You took me on because a one-eyed Claw told you to. I'd think about that, Sergeant."`,`"Six years I counted sentries for people who never said thank you. This lot say it. I'm not used to it. Don't stop."`,`"If the Claw come for me, they'll come at night and they'll come quiet. I'll hear them. I'm telling you so you'll know it wasn't your fault."`],
    rel:{brisk:'Brisk watched her walk for a day and then stopped watching. That is a promotion.',kettle:'They trade: arrows for trip-cord, and neither has said what for.',tuft:'Ellis watches her the way she watched sentries. Tuft has noticed and, oddly, does not mind.',ohl:'He asked about the glove. She said "later." He wrote nothing down, and she noticed.'}},
  vell:{name:'Vell',role:'Rope man · Guild journeyman',sig:'V',col:'#b0a0c8',hp:15,ac:13,atk:4,dmg:[1,6,1],rng:1,mv:6,init:4,st:{might:1,wits:1,guile:3},ab:['grapple','salve'],
    epithet:'"I carry rope. That\'s all I do."',origin:'Darujhistan, the Daru District',age:17,service:'Four years carrying rope for Ocelot\'s clan. A week with the Fourth.',height:'Not tall yet. All elbows. Lands like a cat.',
    weapon:'A rope-and-hook, forty feet of tarred line, and a knife he is still learning which end of',armour:'A Guild runner\'s coat the colour of slate at night, and three sets of Ohl\'s stitches',
    bio:`A journeyman of the Assassins' Guild who has never killed anybody, and says so to everyone, as if it were a password. Strings the lines the clans cross the roofs on. Talks when he is frightened, which is often, and climbs when he is more frightened than that.`,
    bio2:`Born in a Daru stairwell, taken onto the roofs at thirteen because he was light and didn't look down. The Fourth stood between him and a Tiste Andii on a roof one night, for no reason anyone could give him, and he has been trying to work out what he owes for it ever since. The Guild keeps its debts longer than anyone. So, it turns out, does Vell.`,
    traits:['Counts the roofs between here and anywhere','Ties knots in whatever is in his hands','Says his own name three times when nervous','Has never once looked down'],
    gear:['Forty feet of tarred line and a three-tined hook','A Guild runner\'s whistle, which he is not supposed to have any more','A Daru copper with a hole in it, for luck, on a string'],
    get quest(){ return squadQuest('vell', `The Guild knows a Malazan squad held a roof for him, and that he walks with it now. Some of the clans call that a debt paid. Some of them call it something else. Vell means to find out which, before one of them finds him.`); },
    banter:[`"You could have stepped aside. Everybody steps aside. I keep asking myself what I'm for, that you didn't."`,`"In the Guild they'd have charged me for the rope. You lot just ask if I've eaten."`,`"I'll get you onto any roof in this city, Sergeant. Off it's harder. Off is the part people forget."`],
    rel:{brisk:'Brisk carried him off the Daru roof. He has decided she is the safest place in the world, and stands behind her shield without being told.',kettle:'She asked how much the hook weighs, and then how far it would carry a sharper. He has been afraid of her ever since, and adores her.',tuft:'She wears the cloak the Andii left on his hook. He doesn\'t ask for it back.',ohl:'Ohl stitched him on the roof and has been checking the stitches ever since, which Vell finds embarrassing and secretly wonderful.',ellis:'He has heard about the scout who went looking for her captain. He keeps her place, he says, and means it.'}},
};
/* "Unfinished business" on the sheets: the opening line (base) until a chapter settles it, so a sheet read in Chapter 7 doesn't contradict Chapter 7 */
function squadQuest(id, base){
  const s = (typeof S !== 'undefined' && S) || null, f = (s && s.f) || {}, ch = (s && s.chapter) || 0;
  if (id === 'sgt' && f.c7_dujek) return `Somewhere in Onearm's Host, somebody noticed. It was Dujek Onearm, and he said so. He also said he notices a great many things, and most of them are latrines.`;
  if (id === 'brisk') {
    if (f.c7_tav) return `Tav, of Cawn. Fourth Regiment. Living. She read it on the Moranth's rolls with her finger, down the columns, not skipping. ${f.c7_letter === 'brisk' ? `Then she opened the letter. He still owes her four coppers.` : `The letter is still sealed.`}`;
    if (ch >= 2) return `Her brother marched with the Second Army. He isn't on any list yet, living or dead. Brisk reads every list she comes near, and the letter stays sealed.`;
  }
  if (id === 'kettle') {
    if (f.c7_debt === 'paid' || f.c7_debt === 'spent') return `Square with the Moranth. A quartermaster called Ch'kess wrote it on a slate, and the chit is on a thong at her throat. The spoon is explained now. She still won't explain it.`;
    if (f.c7_debt === 'owed') return `The Moranth quartermaster has a name now, Ch'kess, and a slate. Kettle told it "not yet," and it wrote that down too. Chub said she'd know the one that matters.`;
  }
  if (id === 'tuft') {
    if (f.c7_tuftCut || f.c6_tuft === 'glove') return `She dropped the High Mage's badge into an otataral glove. Meanas is quiet in her. She is nobody's, and still surprised how light that is.`;
    if (f.c6_tuft === 'shadow') return `A Hound of Shadow bit through the High Mage's thread at the Fete. She says it was polite. Ohl says it was a thumb turning a page.`;
    if (f.c6_tuft === 'dark') return `A tall man in a black dragon mask looked at her badge once, and it went cold. She says the house was polite, the way you say a thing you have decided to believe.`;
    if (f.c6_tuft === 'kept') return `She did what the grey cloak said at the Fete, and something looked out of her eyes. She is still with the Fourth. So is whatever was looking.`;
    if (s && s.ending) return `Something happened on the High Mage's staff that her transfer letter did not mention. Nobody has asked her what.${f.knowTruth ? ` Varrow's journal came close: the cadre moved before the Spawn attacked, on an order relayed through the staff she was on.` : f.partial ? ` Varrow's journal gave up one name before the ink ran, and she stopped moving when she heard it.` : ''}${f.c1_plant ? ` Tattersail wondered what he thinks he still has of hers.` : ''}`;
  }
  if (id === 'ohl' && Object.keys((s && s.dead) || {}).length) return `Keeps a list of every soldier he couldn't save. It has the Fourth on it now, in his own hand. He meant to die before he wrote one of them. He didn't manage it.`;
  if (id === 'ellis' && f.c7_ledgerRead) {
    if (f.c7_ledgerBurnt && f.c7_ledger !== 'lost') return `She found the ledger behind the green door and put her burned hand into the fire for the page. The fire kept the one word that said which way it was written.`;
    if (f.c7_ledger === 'lost') return `She found the ledger behind the green door. It says lost, entry closed: they wrote her dead, in a neat hand. She doesn't feel closed.`;
    if (f.c7_ledger === 'retained') return `She found the ledger behind the green door. It says retained, useful through the Fourth. The Claw was not done with her after all.`;
    return `She found the ledger behind the green door. It says not retained. The Claw let go of her at the Pale, for the hand; Toc only told her what they had already written down.`;
  }
  return base;
}
const PORDER = ['sgt','brisk','kettle','tuft','ohl'];
const VERB = {sgt:'cuts at',brisk:'drives her spear at',kettle:'looses a quarrel at',tuft:'lashes shadow at',ohl:'cracks a cudgel at',ellis:'puts an arrow into',vell:'puts a knife into'};
const FOES = {
  deserter:{name:'Deserter',sig:'D',hp:11,ac:12,atk:3,dmg:[1,6,1],rng:1,mv:4,init:1,verb:'hacks at'},
  xbow:{name:'Deserter crossbow',sig:'X',hp:8,ac:11,atk:3,dmg:[1,8,0],rng:5,mv:3,init:2,verb:'shoots at'},
  stone:{name:'The Stonebound',sig:'Ω',hp:48,ac:14,atk:5,dmg:[2,6,2],rng:1,mv:3,init:0,boss:true,verb:'hammers'},
  shade:{name:'Shade',sig:'s',hp:7,ac:13,atk:3,dmg:[1,6,0],rng:1,mv:5,init:3,verb:'claws at'},
};
const CARDS = { // the Herald, the Crown and the Wain are added by Chapters 5, 7 and 6 (registerChapter, at start)
  oponn:{name:'Oponn, the Twins',house:'Unaligned',hue:'#e8c073',txt:`The jesters of chance, back to back. "The Lady's pulling," Tuft says. "For now."`,fx:'+1 to your squad\'s attacks, throws and skill checks this chapter.'},
  obelisk:{name:'Obelisk',house:'Unaligned',hue:'#bdb3a3',txt:`A standing stone, unaligned and older than anyone's gods. "Something endures," Tuft says, as if that were good news.`,fx:'+4 maximum health for every squadmate this chapter.'},
  knight:{name:'Knight of High House Dark',house:'High House Dark',hue:'#7d7fc9',txt:`A tall figure with a black sword, turned away. Tuft puts the card back fast. "He's watching the city. Not us. Probably."`,fx:'Enemies take −1 to hit this chapter.'},
  assassin:{name:'Assassin of High House Shadow',house:'High House Shadow',hue:'#9a86e0',txt:`A figure half in shadow, rope and knives. Tuft grins for the first time in days.`,fx:'Your squad lands critical hits on 19–20.'},
  /* the Sceptre and the Orb only ever turn up as the cards that refuse her */
  sceptre:{name:'Sceptre',house:'Unaligned',hue:'#bdb3a3',txt:'A rod of office, tilted, with nobody\'s hand on it.',fx:'None. It refuses her.'},
  orb:{name:'Orb',house:'Unaligned',hue:'#bdb3a3',txt:'A grey sphere hanging in the dark, with a point of light in it that isn\'t the lamp\'s.',fx:'None. It refuses her.'},
  blank:{name:'The unpainted card',house:'—',hue:'#d8d0c0',txt:'No house. No figure. Gesso and grain, and nothing on it yet.',fx:'None. It isn\'t anyone\'s yet.'},
};
const LEVELS = [0,100,250,450,700,1000,1400,1900]; // levels 1..8
/* a caster's strain cap grows with the squad: 6, then 7 at level 4 and 8 at level 7 (15: lvT) */
const strMax = () => 6 + (typeof lvT === 'function' ? lvT() : 0);

/* explore map: # rubble  . ground  , ash  R ruin  ~ crater  = tents  T tunnel  P burial pit */
const PALE = [
  "################",
  "#.T..,..RR...,.#",
  "#....,..RR.....#",
  "#.RR...........#",
  "#.RR..,,....R..#",
  "#PP....~~~~..,.#",
  "#PP,...~~~~....#",
  "#......,,,..RR.#",
  "#.R.,.......RR.#",
  "#.R...===......#",
  "#.....===..,...#",
  "################"];
const NPCS = [
  {id:'tat',name:'Tattersail',kind:'tat',col:'#a08de0',x:7,y:8,node:()=>'tat_map',fresh:()=>!S.f.quest},
  {id:'pell',name:'Quartermaster Pell',kind:'pell',col:'#d6a24a',x:12,y:9,node:()=>'pell'},
  {id:'garrow',name:'Garrow',kind:'garrow',col:'#b9ad98',x:3,y:6,node:()=>S.f.garrow?'garrow_again':'garrow',fresh:()=>!S.f.garrow,still:true},
  {id:'claw',name:'Grey cloak',kind:'claw',col:'#8d8a86',x:11,y:5,node:()=>S.f.clawMet?'claw_again':'claw',show:()=>!S.f.clawFooled && !S.f.gotSatchel,fresh:()=>!S.f.clawMet},
  /* coming back up with the satchel, he is waiting at the tunnel mouth instead */
  {id:'claw_mouth',name:'Grey cloak',kind:'claw',col:'#8d8a86',x:3,y:1,node:()=>'claw2',show:()=>!S.f.clawFooled && !!S.f.gotSatchel && !S.ending,still:true},
];
/* explore areas. walk = tile chars you can stand on; triggers = tile char -> dialogue node when stepped on; decor = which drawExplore dressing to use */
const AREAS = {
  pale:{id:'pale', title:'The Pale · north quarter', sub:'', hint:'Tap ground to move · tap a figure to talk · the tunnel mouth is top left', map:PALE, walk:'.,T', triggers:{T:'mouth'}, npcs:NPCS, start:{x:5,y:8}, decor:'pale',
    quest:()=>S.f.gotSatchel ? `Bring Varrow's satchel to Tattersail` : S.f.quest ? `Recover Varrow's satchel from the north tunnels` : ''},
};
const CHAPTERS = {}; // n -> chapter module (CH1, CH2, ...), registered at boot
const ITEMS = {};     // gear items, merged from chapters
/* the Measure each soldier's role grows: +1 to the first at level 4, +1 to the second at level 8 (15: lvStat) */
const STATUP = {sgt:['wits','might'], brisk:['might','wits'], kettle:['wits','might'], tuft:['guile','wits'], ohl:['wits','might'], ellis:['guile','wits'], vell:['guile','might']};
/* ability picks: level 3 = a named talent per squadmate; levels 5 and 7 = veteran picks shared by all */
const PICKS = {
  3:{ sgt:[['discipline','Marine Discipline','Every squadmate wears +1 armour. Eleven years of telling people where to stand.'],['sappers_eye','Sapper\'s Eye','The squad rolls +2 initiative, and the sergeant\'s free swings hit +2.']],
      brisk:[['shieldwall','Shield Wall','Squadmates standing next to Brisk get +2 armour.'],['holdline','Hold the Line','Brisk\'s free swings are unlimited and hit +2.']],
      kettle:[['longfuse','Crossbow Cradle','A munitions cradle on the heavy crossbow: sharpers, burners, smokers and cussers never scatter, and reach one tile further.'],['quorl','Quorl Signal','Once a fight: a Moranth drop. A sharper from the sky, anywhere within 5, not from the satchel.']],
      tuft:[['shadowstep','Shadow Step','Step through Meanas to any open tile within 4. Nobody gets a free swing. Strain 1.'],['mockra','Mockra Whisper','Mockra, the mind: an enemy within 4 turns on its own side for a turn and goes for the nearest of them instead of you. Bosses may resist. Strain 3.']],
      ohl:[['triage','Field Triage','Mend heals +3 and reaches 4 tiles.'],['argument','Argument with Hood','Once a fight: a downed squadmate within 2 stands up at 6 health. Strain 3.']],
      ellis:[['quickshot','Quick Shot','Once a fight: two arrows at one target within reach.'],['ghost','Ghost Step','Enemies take −2 to hit Ellis. Six years of not being where the sentry looked.']],
      vell:[['ropeswing','Rope Swing','Once a turn, without using his action: swing to any open tile within 3 (further as the squad levels). Nobody gets a free swing.'],['snare','Snare','Whatever the hook hauls in is tangled in the line: −2 to hit and −2 armour through its next turn.']] },
  vet:[['iron','Iron','+6 health.'],['keen','Keen','+1 to hit.'],['fleet','Fleet','+1 move.'],['nerve','Nerve','+1 initiative, and +1 to every skill check this soldier rolls.']],
};
function registerChapter(n, CH){
  CHAPTERS[n] = CH;
  if (CH.areas && !CH.area) CH.area = CH.areas[0];
  (CH.areas || (CH.area ? [CH.area] : [])).forEach(a => { AREAS[a.id] = Object.assign({decor:a.decor || 'camp_night'}, a); });
  if (CH.battles) Object.assign(BATTLES, CH.battles);
  if (CH.foes) Object.assign(FOES, CH.foes);
  if (CH.gear) Object.assign(ITEMS, CH.gear);
  if (CH.card) CARDS[CH.card.id] = CH.card;
  if (CH.dlg) Object.assign(DLG, CH.dlg);
  if (CH.scenes) Object.assign(SCENES, CH.scenes);
  if (CH.quests) Object.assign(QUESTS, CH.quests);
  if (CH.end) CHEND[n] = CH.end;
  if (CH.tease) CHTEASE[n] = CH.tease;
}

const BATTLES = {
  deserters:{title:'North sapper tunnel',warrenText:'Warrens steady down here.',warren:{meanas:1,denul:1},music:'battle',
    map:["..#..#..","........",".##....#","........","...##...","........","#.......","..#..##.","........","........"],
    party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
    foes:[['deserter',1,1],['deserter',4,1],['deserter',6,1],['xbow',3,0]],xp:100,after:'deep1',
    /* Kettle's sharper (the approach): it brings down the timber they were prying at, and the dust off every beam with it, for a round;
       and the tunnel carries the bang on past the bend, to Moreau's gallery (he picks his ground) and the junction (S.f.noisy: the Stonebound is awake, +10 health) */
    preText:'The timber they were prying at comes down the rest of the way, and the dust comes off every beam with it: nobody shoots into or out of their end of the tunnel this round. The bang goes on without it, down the tunnel and round the bend, further than anyone meant it to.',
    preFx:B => { preTile(3, 1, '#'); [[3,0],[4,0],[2,1],[4,1],[5,1],[3,2],[4,2]].forEach(([x, y]) => preSmoke(x, y, 1)); },
    /* the second ground: Moreau's gallery, shored lanes between the posts, a crossbow at the far end, and one of them round behind by the old crawl */
    stage2:{title:'The officers\' gallery',
      text:()=>`Past the timber the tunnel bends into a gallery, shored and dry, where a row of officers came down the night the sky fell to watch the mines laid, and stayed. Somebody has laid them out along the wall. Somebody has cut every purse-string.${SQUAD().includes('ohl') ? ` Ohl looks along the faces. He knows two of them. He doesn't say which.` : ''}

${S.f.p_desertHalf ? `The two who backed away into the dark didn't run. They went to fetch their sergeant: a grey man with his badge cut off clean, who puts down the purse he was counting and picks up a sword instead.` :
  S.f.p_garrowCrossed ? `Their sergeant is a grey man with his badge cut off clean. "One of mine's gone up the tunnel with Garrow's name in his mouth," he says. "So nobody's going up after him."` :
  S.f.noisy ? `Your sapper's sharper told the whole gallery you were coming. Their sergeant, a grey man with his badge cut off clean, has had time to pick his ground, and he has picked it well.` :
  `Their sergeant is a grey man with his badge cut off clean, counting a dead captain's purse by a stub of candle. He finishes counting before he stands.`} ${S.f.knowDeserters ? `Garrow gave you his name at the pits. Moreau.` : `Somebody behind him calls him Moreau.`}${S.f.noisy && SQUAD().includes('kettle') ? `

"Tunnels carry," Kettle says, too quietly, to nobody. "First thing they teach you at the Moranth sheds. You throw in a tunnel, you're not throwing at four men. You're throwing at everything the tunnel touches." She knew it when she threw it. You can hear her knowing it.` : ''}`,
      map:["#..##..#","#......#","#.#..#.#","#......#","#.#..#.#","#......#","#.#..#.#","#......#","##....##","#......."],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['moreau',3,1],['deserter',1,3],['xbow',5,0]],
      waves:[{round:2,foes:[['deserter',7,9]],text:'One of them has come round by the old sapper crawl. He is behind you.'}],xp:50}},
  /* the approach first, the Stonebound second: the junction is the prologue's climax and Varrow's satchel has to follow it directly,
     so the extra ground is the last thirty paces of tunnel, where Kurald Galain has pooled and the shades come off the walls */
  stone:{title:'The drowned stretch',warrenText:'Kurald Galain pools here · Meanas stirs · Denul thins',warren:{meanas:1.3,denul:0.8},dark:true,music:'dark',
    map:["##....##","##....##","........","##....##","##.#..##","##....##","........","##....##","##....##","##....##"],
    party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
    foes:[['shade',2,0],['shade',5,1],['shade',3,3]],
    waves:[{round:2,foes:[['shade',0,6],['shade',7,6]],text:'The dark comes out of the side passages, low, on both flanks.'}],xp:50,after:'journal',
    stage2:{title:'Collapsed junction',warrenText:'Kurald Galain seeps in · Meanas surges · Denul falters',warren:{meanas:1.5,denul:0.6},
      text:()=>`The last shade goes back into the dark it came out of, and the dark lets it. The lanterns have gone the colour of weak tea. Ahead, the sapper tunnel opens into the junction, and Varrow is three paces inside it, under his beam, with the strap still wrapped round his hand.

You are halfway to him when the floor in the middle of the junction stands up.${S.f.noisy ? ` It was never asleep. It let you come this far. It has had since your sharper went off to pull itself together out of the junction floor, and it has taken more of the floor than it needed.` : ''}${SQUAD().includes('brisk') ? ` Brisk's shield comes up. "Sergeant."` : ''}`,
      map:["#......#","..#..#..","........","........",".#....#.","........","...##...","........","........","#......#"],
      party:[[3,8],[4,8],[2,9],[5,9],[3,9],[4,9]],
      foes:[['stone',3,2],['shade',1,3],['shade',6,3]],xp:150}},
};

