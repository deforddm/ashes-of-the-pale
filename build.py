#!/usr/bin/env python3
"""Concatenate src/ into index.html. Order: 00_head.html, 01_style.css, 02_body.html, 1x-9x_*.js (sorted), 99_boot2.js."""
import glob, os, re
root = os.path.dirname(os.path.abspath(__file__)); src = os.path.join(root, 'src')
rd = lambda n: open(os.path.join(src, n), encoding='utf-8').read()
js = [os.path.basename(p) for p in sorted(glob.glob(os.path.join(src, '*.js'))) if not os.path.basename(p).startswith('99_')]
out = rd('00_head.html') + '<style>\n' + rd('01_style.css') + '</style>\n<style>[hidden]{display:none!important}body{margin:0}</style>\n</head><body>\n\n' + rd('02_body.html') + '<script>\n' + ''.join('\n' + rd(n) for n in js).lstrip('\n') + '</script>\n\n<script>\n' + rd('99_boot2.js') + '</script>\n</body></html>\n'
open(os.path.join(root, 'index.html'), 'w', encoding='utf-8').write(out)
print('index.html', len(out), 'bytes from', len(js) + 4, 'files')
