import os

files = [
    'index.html', 'px-to-rem.html', 'clamp-generator.html', 
    'css-generator.html', 'color-converter.html', 'gradient-generator.html', 
    'flexbox-visualizer.html', 'contrast-checker.html', 'css-tools.html'
]

menu_old = 'flexbox-visualizer.html" class="gnb-item">Flexbox</a>'
menu_new = 'flexbox-visualizer.html" class="gnb-item">Flexbox</a>\n            <a href="grid-generator.html" class="gnb-item">CSS Grid</a>'

version_old = 'v1.6.0'
version_new = 'v1.7.0'

new_note_html = """                  <div class="version-item">
                    <strong>v1.7.0 (2026.04.24)</strong>
                    <ul>
                      <li>CSS Grid Generator 신규 추가</li>
                      <li>시각적 그리드 설계 및 자동 코드 생성 기능</li>
                    </ul>
                  </div>"""

for filename in files:
    path = os.path.join('d:/my_git/pxtovw', filename)
    if not os.path.exists(path):
        print(f"File not found: {path}")
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update Menu
    if menu_old in content:
        content = content.replace(menu_old, menu_new)
    
    # 2. Update Version
    content = content.replace(version_old, version_new)
    
    # 3. Update Note (Insert after the close button of version modal)
    note_marker = 'id="close-version-btn"\n                    >\n                      &times;\n                    </button>\n                  </h3>'
    if note_marker in content and 'v1.7.0' not in content:
        content = content.replace(note_marker, note_marker + "\n" + new_note_html)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print('All files updated successfully to v1.7.0')
