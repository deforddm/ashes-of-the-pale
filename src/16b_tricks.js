/* ============ tricks: what a hard check teaches ============
   Ten of them, one or two a chapter from the Prologue to the Fete, each behind an optional hard check (DC 15–17, a ✦ on the choice).
   Whoever makes the roll carries the trick (S.tricks[k] = {who, ch, left}). 'fight' tricks work once a fight; 'chapter' tricks have
   charges that come back at the start of every chapter. The battle half of each lives in 31b. 'elder' tricks draw on an Elder warren
   (Kurald Galain, Omtose Phellack), which otataral does not quell, so they still work in a nomagic fight. */
const TRICKS = {
  fold:{name:'Tattersail\'s Fold', ch:0, use:'chapter', n:1, where:'Tattersail\'s tent',
    lore:'A cadre mage\'s trick with the Deck: fold the turned card back into the spread and let another come up. Tattersail does it without looking. The Deck lets her, mostly.',
    get fx(){ return `${trickTimes('fold')} a chapter: when Tuft turns the chapter's card, draw again and keep either. One more use from level 5.`; }},
  line:{name:'The Line', ch:1, use:'fight', ab:'t_line', where:'the cadre row, the night of the Hounds',
    lore:'Shields locked rim to rim across a tent row, with something out of Shadow on the other side of them. Paran remembered it. So did the shields.',
    get fx(){ return `Once a fight: the bearer and every squadmate beside them take +${3 + lvT()} armour and cannot be flanked until the bearer's next turn. Grows with level.`; }},
  song:{name:'Rhivi Spirit-Song', ch:2, use:'fight', ab:'t_song', where:'the Rhivi outriders on the plain',
    lore:'The words the Rhivi sing over their dead, so the spirits of the grass will carry them. Sung for the living, they carry something else.',
    fx:'Once a fight: every squadmate within 4 heals 1d6+2, and 1 more for each squad level past the first, wakes from any daze, and steps out of any fire under them.'},
  pull:{name:'The Lady\'s Pull', ch:3, use:'chapter', n:2, ab:'t_pull', where:'the Phoenix Inn, watching a boy spin a coin',
    lore:'Oponn are twins, back to back. The Lady pulls and the Lord pushes, and nobody who has felt the one has escaped the other.',
    get fx(){ return `${trickTimes('pull')} a chapter: spin the coin after a failed check and roll it again, or before an attack and roll it twice, keeping the better. The Lord pushes back: the squad's next check is −2. One more use from level 5.`; }},
  bluefire:{name:'Blue Fire', ch:3, use:'chapter', n:2, ab:'t_bluefire', where:'Hedge\'s cellar under the gas mains',
    lore:'A pig\'s bladder of Darujhistan\'s lamp-gas, tied off, with a sapper\'s fuse in the neck. Hedge calls it "the city\'s own sharper." Fiddler calls it something else.',
    get fx(){ return `${trickTimes('bluefire')} a chapter: throw it, range 4. 2d6${lvDmg() ? '+' + lvDmg() : ''} to everything in a 3×3, squad included, and everything caught is dazzled: −3 to hit through the next round. Grows with level.`; }},
  cant:{name:'Claw Hand-Cant', ch:4, use:'fight', ab:'t_cant', where:'Kalam\'s roof',
    lore:'The Claw talks with its fingers: a flick for watch, a curl for here, a cut across the palm that means this one, now. Kalam showed it once and said he hadn\'t.',
    get fx(){ const n = 1 + lvT(); return `Once a fight, and it does not use the bearer's action: sign an enemy within 6. The next ${n > 1 ? ['','','two','three'][n] + ' hits' : 'hit'} on it this round ${n > 1 ? 'are criticals' : 'is a critical'}. Grows with level.`; }},
  rope:{name:'The Rope\'s Way', ch:4, use:'fight', ab:'t_rope', where:'the rope-line across the roofs',
    lore:'The Patron of Assassins is called the Rope. On the roofs of Darujhistan there are lines strung between the chimneys that nobody admits to stringing, and the ones who use them do not fall.',
    get fx(){ return `Once a fight, and it does not use the bearer's action: swap places with any squadmate within ${5 + lvT()}. Nobody gets a free swing. Grows with level.`; }},
  otataral:{name:'Otataral Dust', ch:5, use:'chapter', n:2, ab:'t_otataral', not:['tuft','ohl'], where:'the ward-stone the Adjunct\'s sword cut',
    notWhy:{tuft:'won\'t touch it. Meanas goes quiet near it', ohl:'won\'t touch it. Denul goes thin near it'},
    lore:'Red dust mined at the edge of the Otataral Desert, in Seven Cities. The Adjunct\'s sword is made of it. The cut she left in the ward-stone was still shedding it.',
    get fx(){ return `${trickTimes('otataral')} a chapter: a pinch thrown at an enemy within ${3 + lvT()}. For the rest of the fight its sorcery fails: no lances, no slams, no shadow-bolts, one blow a turn. Grows with level. Tuft and Ohl will not carry it.`; }},
  dark:{name:'A Courtesy of Darkness', ch:6, use:'fight', ab:'t_dark', sorcery:true, elder:true, where:'the terrace at Lady Simtal\'s',
    lore:'A tall guest in a black dragon mask inclined his head, once, the way the Tiste Andii do to someone whose face they know. Something of Kurald Galain came with the nod and has not left.',
    get fx(){ return `Once a fight: a 3×3 of Andii dark within 5, for ${2 + lvAt(5)} rounds. Nothing shoots into it, out of it or through it, and enemies standing in it are −2 to hit. Grows with level. Elder sorcery: otataral does not touch it.`; }},
  rime:{name:'Omtose Rime', ch:6, use:'fight', ab:'t_rime', sorcery:true, elder:true, where:'the Tyrant\'s frost on the garden lawn',
    lore:'Jaghut ice, Omtose Phellack, the warren of the old cold. A ring of it went across the lawn and stopped at the bearer\'s boots, and a little of it stayed.',
    get fx(){ return `Once a fight: an enemy within 4 is rimed. It loses its next turn (a boss shakes that off on ${12 + 2*lvT()}+), and every hit on it does +${2 + lvT()} through the next round. Grows with level. Elder sorcery: otataral does not touch it.`; }},
};
/* who carries trick k, if they are still with the squad */
const trickBy = k => { const t = S && S.tricks && S.tricks[k]; return t && SQUAD().includes(t.who) ? t.who : null; };
/* uses left: a 'fight' trick is 1 while carried (the fight tracks its own use); a 'chapter' trick counts charges */
/* a chapter trick's charges: one more from level 5 */
const trickN = k => (TRICKS[k] && TRICKS[k].n || 0) + lvAt(5);
const trickTimes = k => ['Never','Once','Twice','Three times','Four times'][trickN(k)] || `${trickN(k)} times`;
function trickLeft(k){ const T = TRICKS[k], t = S && S.tricks && S.tricks[k]; if (!T || !t || !trickBy(k)) return 0; return T.use === 'chapter' ? Math.max(0, t.left ?? trickN(k)) : 1; }
function spendTrick(k){ const T = TRICKS[k], t = S.tricks && S.tricks[k]; if (!T || !t) return; if (T.use === 'chapter') t.left = Math.max(0, (t.left ?? trickN(k)) - 1); tally('tricksUsed'); save(); }
function earnTrick(k, who){
  const T = TRICKS[k]; if (!T) return; S.tricks ??= {}; if (S.tricks[k]) return;
  S.tricks[k] = {who, ch:S.chapter || 0, left:T.n != null ? trickN(k) : null}; tally('tricks'); AUDIO.play('up');
  note(`✦ ${NAME(who)} learns a trick: ${T.name}. ${T.fx}`, 'trick');
}
/* a new chapter: every charged trick comes back full */
function refillTricks(){ Object.entries((S && S.tricks) || {}).forEach(([k, t]) => { const T = TRICKS[k]; if (T && T.use === 'chapter') t.left = trickN(k); }); }
/* the battle abilities a squadmate brings from their tricks */
const trickAbs = id => Object.keys((S && S.tricks) || {}).filter(k => S.tricks[k].who === id && TRICKS[k] && TRICKS[k].ab).map(k => TRICKS[k].ab);
/* the tricks a squadmate carries, for the sheet */
const tricksOf = id => Object.keys((S && S.tricks) || {}).filter(k => S.tricks[k].who === id && TRICKS[k]);
/* a chapter's card: drawn from that chapter's pool, which is kept so Tattersail's Fold can draw from it again */
function dealCard(pool){ S.cardPool = pool.slice(); return pool[R(pool.length)]; }
