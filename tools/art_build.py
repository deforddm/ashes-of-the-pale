#!/usr/bin/env python3
"""Build src/19c_artwork.js from the artwork canvas boards in docs/art/*.dc.html.

The boards are the "Ashes of the Pale — Artwork" design canvas. Each picture on a board is an
<svg role="img" aria-label="…">. This pulls out every picture the game shows as a standalone SVG it can
inline (ids and classes namespaced per board so pictures never clash), gathers each board's
animation CSS once (namespaced the same way), and keeps the three in-world papers as HTML.
Boards and pictures nothing in the game shows (the squad lineup, the motifs, three insignia, the loose
stamp and seal, the acid phial) stay on the canvas but are not built.

Re-run after the canvas changes:  python3 tools/art_build.py && python3 build.py
"""
import re, os, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, 'docs', 'art')
OUT = os.path.join(ROOT, 'src', '19c_artwork.js')

ITEM = {"Grey cloak's knife": 'clawknife', 'Rhivi horn bow': 'rhivibow', 'Daru duelling knife': 'daruknife', 'Guild blade': 'guildblade',
        'Barrow-flint blade': 'barrowflint', "House guard's halberd": 'simtalhalberd', 'Blacked Guild blade': 'blackedblade',
        'Second Army heater shield': 'heater', "Toc's spare cloak": 'toccloak', 'Gadrobi road-crew leather': 'roadleather',
        'Andii-grey cloak': 'andiicloak', "Malazan scout's cloak": 'scoutcloak',
        "Hound's tooth": 'houndtooth', 'Cadre token': 'cadretoken', 'Barrow torc': 'barrowtorc', 'Second Army badge': 'secondbadge',
        'Blue-glass lamp-chip': 'lampchip', "Coll's old signet": 'collsignet', 'Guild token': 'guildtoken', "Journeyman's rope-and-hook": 'ropehook',
        'Rhivi bone charm': 'rhivicharm', 'Otataral-dusted glove': 'otatglove', 'Fete mask': 'fetemask', "Sapper's satchel strap": 'bbstrap',
        'Moranth chit': 'moranthchit', "Oponn's Own Coin": 'brackcoin', "Hood's Repellent": 'hoodrep', "Genuine Shard of Moon's Spawn": 'spawnshard', "Map to the Tyrant's Hoard": 'tyrantmap', 'Key to a door that does not exist': 'phoenixkey', "A neat hand's pen": 'clawpen'}
BOARDS = {  # board file -> (namespace, game key per aria-label prefix; None = keep under a slug of the label)
  'Main':          ('k',  {}),
  'Deck':          ('dk', {'Hounds of Shadow': 'hounds', 'The Great Raven': 'raven', 'Magi of High House Shadow': 'magi', 'Herald of High House Death': 'herald', 'The Wain': 'chains', 'Crown': 'crown', 'The blank card': 'blank',
                          'Oponn': 'oponn', 'Obelisk': 'obelisk', 'Knight of High House Dark': 'knight', 'Assassin of High House Shadow': 'assassin'}),
  'Patrons':       ('pt', {'Sigil of Hood': 'brisk', 'Sigil of Oponn': 'kettle', 'Sigil of Shadowthrone': 'tuft', 'Sigil of Soliel': 'ohl', 'Sigil of Cotillion': 'ellis', 'Sigil of Fener': 'sgt'}),
  'Chapters':      ('cp', {'Prologue': '0', 'Chapter One': '1', 'Chapter Two': '2', 'Chapter Three': '3', 'Chapter Four': '4', 'Chapter Five': '5', 'Chapter Six': '6', 'Chapter Seven': '7'}),
  'Arms':          ('ar', ITEM),
  'Trinkets':      ('tk', ITEM),
  'Munitions':     ('mu', {'Sharper': 'sharper', 'Burner': 'burner', 'Cusser named Maud': 'cusser', 'Smoker': 'smoker', 'Phial of acid': None, 'Salve': 'salve',
                          'The pay ledger and the whistle': 'keep_sgt', "Tav's sealed letter": 'keep_brisk', 'A spoon': 'keep_kettle', "A grey ribbon and Tuft's deck": 'keep_tuft', "Ohl's list in oilcloth": 'keep_ohl', 'A Claw whistle with its cord cut': 'keep_ellis'}),
  'Papers':        ('pp', {'A clawed stamp': None, 'A wax seal': None}),  # the stamp and seal are drawn inside the papers themselves
  'Insignia':      ('in', {"The Fourth's squad patch": 'patch', 'The Phoenix Inn sign': None, 'Mark of the Guild of Paviors': None, 'A torn armband': None}),
  'Vistas':        ('vs', {'The barrow on the ridge': 'barrow', 'A small boat with one lantern': 'lake', 'A Darujhistan canal': 'canal',
                          'Up out of the dark': 'prologue', 'The cadre row burning': 'pale', 'A rooftop under the moon': 'roof', 'Dawn in Lady Simtal': 'garden', 'Noon on a brown hill': 'hill'}),
  'MapGenabackis': ('mg', {'Map of Genabackis': 'map'}),
  'MapDaru':       ('md', {'Map of Darujhistan': 'map'}),
  'MapPale':       ('mp', {'A sapper’s field sketch': 'map', "A sapper's field sketch": 'map'}),
  'MapGadrobi':    ('mh', {'Field map of the Gadrobi Hills': 'map'}),
  'Cast':          ('cc', None),
  'Originals':     ('oc', None),
  'Roads':         ('rd', {'Quorls rising north': 'outlaw', 'A ship at sea': 'empire', 'The Lakefront at dawn': 'city', 'A lone figure on a brown hill': 'disband'}),
}
FONTS = [("'Cormorant SC'", "'IM Fell English SC'"), ('Cormorant SC', 'IM Fell English SC'), ("'Cormorant Garamond'", "'IM Fell English'"), ('Cormorant Garamond', 'IM Fell English'), ("'Homemade Apple', cursive", "'IM Fell English', cursive")]

def slug(s): return re.sub(r'[^a-z0-9]+', '_', s.lower()).strip('_')[:40]

def balanced(s, start, tag):
    """the end index of the element of `tag` that opens at `start` (nesting-aware)"""
    pat = re.compile(r'<(/?)%s\b[^>]*?(/?)>' % tag)
    depth = 0
    for m in pat.finditer(s, start):
        if m.group(1): depth -= 1
        elif not m.group(2): depth += 1
        if depth == 0: return m.end()
    raise ValueError('unbalanced ' + tag)

def element_by_id(s, i):
    m = re.search(r'<([a-zA-Z]+)\b[^>]*\bid="%s"' % re.escape(i), s)
    if not m: return None
    tag = m.group(1); st = m.start()
    if s[st:s.find('>', st) + 1].endswith('/>'): return s[st:s.find('>', st) + 1]
    return s[st:balanced(s, st, tag)]

def refs(x): return set(re.findall(r'url\(#([\w-]+)\)', x)) | set(re.findall(r'href="#([\w-]+)"', x))
def ids(x): return set(re.findall(r'\bid="([\w-]+)"', x))

def ns_markup(x, p):
    x = re.sub(r'\bid="([\w-]+)"', lambda m: f'id="{p}-{m.group(1)}"', x)
    x = re.sub(r'url\(#([\w-]+)\)', lambda m: f'url(#{p}-{m.group(1)})', x)
    x = re.sub(r'href="#([\w-]+)"', lambda m: f'href="#{p}-{m.group(1)}"', x)
    x = re.sub(r'\bclass="([^"]*)"', lambda m: 'class="%s"' % ' '.join(f'{p}-{c}' for c in m.group(1).split()), x)
    for a, b in FONTS: x = x.replace(a, b)
    return x

def ns_css(css, p):
    css = re.sub(r'(?m)^\s*body\{[^}]*\}\s*$', '', css)
    css = re.sub(r'a\{[^}]*\}a:hover\{[^}]*\}', '', css)
    names = set(re.findall(r'@keyframes\s+([\w-]+)', css))
    css = re.sub(r'@keyframes\s+([\w-]+)', lambda m: f'@keyframes {p}-{m.group(1)}', css)
    css = re.sub(r'(animation(?:-name)?\s*:\s*)([\w-]+)', lambda m: m.group(1) + (f'{p}-{m.group(2)}' if m.group(2) in names else m.group(2)), css)
    # class selectors: a dot followed by a letter, outside of numbers
    css = re.sub(r'(?<![\w.#-])\.([a-zA-Z][\w-]*)', lambda m: f'.{p}-{m.group(1)}', css)
    for a, b in FONTS: css = css.replace(a, b)
    return css.strip()

def root_tag(svg, extra_style=None):
    """normalise the root <svg ...>: xmlns, no fixed width/height (the game sizes it), keep viewBox and aspect"""
    m = re.match(r'<svg\b([^>]*)>', svg); attrs = m.group(1)
    vb = re.search(r'viewBox="([^"]+)"', attrs)
    if not vb:
        w = re.search(r'\bwidth="(\d+)"', attrs).group(1); h = re.search(r'\bheight="(\d+)"', attrs).group(1); vbv = f'0 0 {w} {h}'
    else: vbv = vb.group(1)
    par = re.search(r'preserveAspectRatio="([^"]+)"', attrs)
    lab = re.search(r'aria-label="([^"]*)"', attrs)
    head = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vbv}"' + (f' preserveAspectRatio="{par.group(1)}"' if par else '') + (f' role="img" aria-label="{lab.group(1)}"' if lab else ' aria-hidden="true"') + '>'
    return head + svg[m.end():], [float(v) for v in vbv.split()]

pieces, sizes, css_all, meta = {}, {}, [], {}
for name, (p, keymap) in BOARDS.items():
    src = open(os.path.join(ART, name + '.dc.html'), encoding='utf-8').read()
    body = re.search(r'<x-dc>(.*)</x-dc>', src, re.S).group(1)
    helm = re.search(r'<helmet>(.*?)</helmet>', body, re.S)
    hcss = re.search(r'<style>(.*?)</style>', helm.group(1), re.S).group(1) if helm else ''
    css_all.append(ns_css(hcss, p))
    content = body.replace(helm.group(0), '') if helm else body
    starts = [m.start() for m in re.finditer(r'<svg\b', content)]
    found = 0
    for st in starts:
        tag = content[st:content.find('>', st) + 1]
        is_main = name == 'Main' and 'width="1600"' in tag
        if 'role="img"' not in tag and not is_main: continue
        svg = content[st:balanced(content, st, 'svg')]
        label = re.search(r'aria-label="([^"]*)"', tag)
        label = label.group(1) if label else 'key art'
        if is_main: key = 'key'
        elif keymap is None: key = slug(label)
        else:
            hit = next((k for k in keymap if label.startswith(k)), None)
            if hit is None: raise SystemExit(f'no key for {name}: {label!r}')
            key = keymap[hit]
            if key is None: continue  # on the canvas, not in the game
        # pull in definitions the picture uses from elsewhere on the board
        need = refs(svg) - ids(svg); extra = []
        while need:
            i = need.pop(); el = element_by_id(content, i)
            if el is None: raise SystemExit(f'{name}/{key}: #{i} not found')
            extra.append(el); need |= refs(el) - ids(svg) - set().union(*[ids(e) for e in extra])
        if extra:
            svg = re.sub(r'(<svg\b[^>]*>)', lambda m: m.group(1) + '<defs>' + ''.join(extra) + '</defs>', svg, count=1)
        svg, vb = root_tag(svg)
        svg = re.sub(r'\s*\n\s*', '\n', ns_markup(svg, p)).strip()
        full = f'{name.lower()}/{key}' if name not in ('Arms', 'Trinkets') else f'item/{key}'
        if name.startswith('Map'): full = 'map/' + name[3:].lower()
        if name == 'Main': full = 'title/key'
        pieces[full] = svg; sizes[full] = [vb[2], vb[3]]; found += 1
        if name in ('Cast', 'Originals'):  # the card's words: name, where, and what they say
            end = balanced(content, st, 'svg'); nxt = content.find('<svg', end); seg = content[end: nxt if nxt > 0 else len(content)]
            seg = seg[:seg.find('</div>\n\n')] if '</div>\n\n' in seg else seg
            lines = [re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', l)).strip() for l in re.split(r'</(?:div|p)>', seg)]
            lines = [l.replace('&amp;', '&') for l in lines if l]
            m = re.search(r'Prologue|Ch (\d)', lines[1] if len(lines) > 1 else '')
            meta[full] = {'lines': lines, 'ch': 0 if (m and m.group(0) == 'Prologue') else int(m.group(1)) if m else 0}
    print(f'{name:14} {found:3} pictures')

# the three papers, kept as HTML (they are typeset, not drawn)
src = open(os.path.join(ART, 'Papers.dc.html'), encoding='utf-8').read()
grid = src[src.find('grid-template-columns: repeat(3'):]
grid = grid[grid.find('>') + 1:]
papers, pos = [], 0
for _ in range(3):
    st = grid.find('<div', pos); en = balanced(grid, st, 'div'); papers.append(grid[st:en]); pos = en
for k, h in zip(['rations', 'file', 'proclamation'], papers):
    h = re.sub(r'transform: rotate\([^)]*\);\s*', '', h)
    h = re.sub(r'min-height:\s*\d+px;?\s*', '', h)
    pieces['paper/' + k] = re.sub(r'\s*\n\s*', '\n', ns_markup(h, 'pp')).strip()

js = ['/* ============ the artwork canvas, in the game ============',
      '   GENERATED by tools/art_build.py from docs/art/*.dc.html (the "Ashes of the Pale — Artwork" canvas). Do not edit by hand.',
      '   ART[key] is a standalone SVG (or, for paper/*, HTML); ART_SIZE[key] its viewBox size; ART_CSS the boards\' animation CSS,',
      '   namespaced per board. */',
      'const ART_CSS = ' + json.dumps('\n'.join(c for c in css_all if c), ensure_ascii=False) + ';',
      'const ART_SIZE = ' + json.dumps(sizes, separators=(',', ':')) + ';',
      'const ART_META = ' + json.dumps(meta, ensure_ascii=False, separators=(',', ':')) + ';',
      'const ART = ' + json.dumps(pieces, ensure_ascii=False, indent=0, separators=(',', ':')) + ';',
      '']
open(OUT, 'w', encoding='utf-8').write('\n'.join(js))
print(len(pieces), 'pieces from', len(BOARDS), 'boards ->', os.path.relpath(OUT, ROOT), os.path.getsize(OUT), 'bytes')
