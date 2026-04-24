import os
import re

# 업데이트 대상 파일 리스트 (파일명: 메뉴 텍스트 매칭용)
files_info = {
    'index.html': 'PX ↔ VW',
    'px-to-rem.html': 'PX ↔ REM',
    'clamp-generator.html': 'CSS Clamp',
    'flexbox-visualizer.html': 'Flex Layout',
    'grid-generator.html': 'Grid Layout',
    'animation-generator.html': 'Animation',
    'css-generator.html': 'Visual Effects',
    'gradient-generator.html': 'Gradient',
    'color-converter.html': 'Color Tools',
    'contrast-checker.html': 'Contrast Check',
    'css-tools.html': 'Code Tools'
}

# 공통 메뉴 구조 정의 (v1.9.0)
def get_gnb_html(current_file):
    menu_items = [
        ('index.html', 'PX ↔ VW'),
        ('px-to-rem.html', 'PX ↔ REM'),
        ('clamp-generator.html', 'CSS Clamp'),
        ('flexbox-visualizer.html', 'Flex Layout'),
        ('grid-generator.html', 'Grid Layout'),
        ('animation-generator.html', 'Animation'),
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

version_old = 'v1.8.0'
version_new = 'v1.9.0'

new_note_html = """                  <div class="version-item">
                    <strong>v1.9.0 (2026.04.24)</strong>
                    <ul>
                      <li>전체 메뉴 네이밍 및 순서 재구성</li>
                      <li>작업 워크플로우 최적화 (Layout > Interaction > Visual)</li>
                    </ul>
                  </div>"""

for filename in files_info.keys():
    path = os.path.join('d:/my_git/pxtovw', filename)
    if not os.path.exists(path):
        print(f"File not found: {path}")
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. GNB Menu 일괄 교체
    # <div class="gnb-menu-inner"> ... </div> 영역을 찾아서 교체
    gnb_pattern = r'<div class="gnb-menu-inner">.*?</div>'
    new_gnb = get_gnb_html(filename)
    content = re.sub(gnb_pattern, new_gnb, content, flags=re.DOTALL)
    
    # 2. 버전 번호 업데이트
    content = content.replace('v1.8.0', version_new)
    content = content.replace('v1.7.0', version_new) # 혹시 누락된 것들 대비
    
    # 3. 업데이트 노트 추가
    note_marker = 'id="close-version-btn"\n                    >\n                      &times;\n                    </button>\n                  </h3>'
    if note_marker in content and 'v1.9.0' not in content:
        content = content.replace(note_marker, note_marker + "\n" + new_note_html)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print('All files updated successfully to v1.9.0 with new menu structure.')
