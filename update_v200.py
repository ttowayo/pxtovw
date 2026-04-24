import os
import re

# 업데이트 대상 파일 리스트
files = [
    'index.html', 'px-to-rem.html', 'clamp-generator.html', 
    'flexbox-visualizer.html', 'grid-generator.html', 'animation-generator.html',
    'css-generator.html', 'divider-generator.html', 'gradient-generator.html', 
    'color-converter.html', 'contrast-checker.html', 'css-tools.html'
]

# 공통 메뉴 구조 정의 (v2.0.0)
def get_gnb_html(current_file):
    menu_items = [
        ('index.html', 'PX ↔ VW'),
        ('px-to-rem.html', 'PX ↔ REM'),
        ('clamp-generator.html', 'CSS Clamp'),
        ('flexbox-visualizer.html', 'Flex Layout'),
        ('grid-generator.html', 'Grid Layout'),
        ('animation-generator.html', 'Animation'),
        ('divider-generator.html', 'Section Divider'),
        ('css-generator.html', 'Visual Effects'),
        ('gradient-generator.html', 'Gradient'),
        ('color-converter.html', 'Color Tools'),
        ('contrast-checker.html', 'Contrast Check'),
        ('css-tools.html', 'Code Tools')
    ]
    
    html = '<div class="gnb-menu-inner">\n'
    for file, label in menu_items:
        active_class = ' active' if file == current_file else ''
        html += f'            <a href="{file}" class="gnb-item{active_class}">{label}</a>\n'
    html += '          </div>'
    return html

version_new = 'v2.0.0'

new_note_html = """                  <div class="version-item">
                    <strong>v2.0.0 (2026.04.24) - Major Update</strong>
                    <ul>
                      <li>SVG Section Divider 생성기 신규 추가</li>
                      <li>물결(Wave), 곡선(Curve) 등 모던한 섹션 경계 설계 기능</li>
                      <li>GNB 메뉴 최적화 및 플랫폼 안정성 강화</li>
                    </ul>
                  </div>"""

for filename in files:
    path = os.path.join('d:/my_git/pxtovw', filename)
    if not os.path.exists(path):
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. GNB Menu 일괄 교체
    gnb_pattern = r'<div class="gnb-menu-inner">.*?</div>'
    new_gnb = get_gnb_html(filename)
    content = re.sub(gnb_pattern, new_gnb, content, flags=re.DOTALL)
    
    # 2. 버전 번호 업데이트 (기존 v1.x.x 모두 v2.0.0으로)
    content = re.sub(r'v1\.[0-9]+\.[0-9]+', version_new, content)
    
    # 3. 업데이트 노트 추가
    note_marker = 'id="close-version-btn"\n                    >\n                      &times;\n                    </button>\n                  </h3>'
    if note_marker in content and 'v2.0.0' not in content:
        content = content.replace(note_marker, note_marker + "\n" + new_note_html)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print('All files updated successfully to v2.0.0')
