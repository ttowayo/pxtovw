import os

html_files = [
    'index.html', 'px-to-rem.html', 'clamp-generator.html', 'css-generator.html', 
    'color-converter.html', 'gradient-generator.html', 'flexbox-visualizer.html',
    'grid-generator.html', 'animation-generator.html', 'divider-generator.html',
    'aspect-ratio.html', 'contrast-checker.html', 'css-tools.html'
]

for file in html_files:
    if not os.path.exists(file):
        print(f'File not found: {file}')
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    start_idx = content.find('<div class="version-modal" id="version-modal">')
    if start_idx == -1:
        print(f'No modal: {file}')
        continue
    
    end_idx = content.find('<nav class="gnb-menu">')
    if end_idx == -1:
        print(f'No gnb-menu: {file}')
        continue
