import os
import re

files = [
    'index.html', 'px-to-rem.html', 'clamp-generator.html', 
    'css-generator.html', 'color-converter.html', 'gradient-generator.html', 
    'flexbox-visualizer.html', 'grid-generator.html', 'contrast-checker.html', 'css-tools.html'
]

# Grid 메뉴 다음에 Animation 메뉴 삽입
menu_marker = r'(<a href="grid-generator.html" class="gnb-item[^"]*">CSS Grid</a>)'
menu_insertion = '\n            <a href="animation-generator.html" class="gnb-item">Animation</a>'

version_old = 'v1.7.0'
version_new = 'v1.8.0'

new_note_html = """                  <div class="version-item">
                    <strong>v1.8.0 (2026.04.24)</strong>
                    <ul>
                      <li>CSS Animation Generator 신규 추가</li>
                      <li>비주얼 키프레임 설계 및 Cubic-Bezier 제어 기능</li>
                    </ul>
                  </div>"""

for filename in files:
    path = os.path.join('d:/my_git/pxtovw', filename)
    if not os.path.exists(path):
        print(f"File not found: {path}")
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update Menu (Using RegEx to handle 'active' class)
    if 'animation-generator.html' not in content:
        content = re.sub(menu_marker, r'\1' + menu_insertion, content)
    
    # 2. Update Version Label
    content = content.replace(version_old, version_new)
    
    # 3. Update Note (Insert at the top of version modal)
    note_marker = 'id="close-version-btn"\n                    >\n                      &times;\n                    </button>\n                  </h3>'
    if note_marker in content and 'v1.8.0' not in content:
        content = content.replace(note_marker, note_marker + "\n" + new_note_html)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print('All files updated successfully to v1.8.0')
