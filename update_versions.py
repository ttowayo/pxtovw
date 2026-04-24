import os

modal_content = '''                <div class="version-modal" id="version-modal">
                  <h3>
                    업데이트 노트
                    <button type="button" class="close-version-btn" id="close-version-btn">&times;</button>
                  </h3>
                  <div class="version-item">
                    <strong>v2.1.0 (2026.04.24)</strong>
                    <ul>
                      <li>Section Divider Generator 신규 추가</li>
                      <li>Aspect Ratio Calculator 신규 추가</li>
                      <li>CSS Animation Generator 신규 추가</li>
                    </ul>
                  </div>
                  <div class="version-item">
                    <strong>v2.0.0 (2026.04.24)</strong>
                    <ul>
                      <li>CSS Grid Generator 신규 추가</li>
                      <li>시각적 그리드 설계 및 자동 코드 생성 기능</li>
                    </ul>
                  </div>
                  <div class="version-item">
                    <strong>v1.6.0 (2026.04.24)</strong>
                    <ul>
                      <li>WCAG Contrast Checker 신규 추가</li>
                      <li>웹 접근성을 위한 컬러 대비 자동 검사</li>
                    </ul>
                  </div>
                  <div class="version-item">
                    <strong>v1.5.0 (2026.04.24)</strong>
                    <ul>
                      <li>CSS Flexbox Visualizer 신규 추가</li>
                      <li>레이아웃 속성 시각화 및 자동 코드 생성</li>
                    </ul>
                  </div>
                  <div class="version-item">
                    <strong>v1.4.0 (2026.04.24)</strong>
                    <ul>
                      <li>CSS Gradient Generator 신규 추가</li>
                      <li>컬러 변환기 시각적 컬러피커 기능 강화</li>
                      <li>CSS 도구(Minifier) 성능 및 UI 개선</li>
                    </ul>
                  </div>
                  <div class="version-item">
                    <strong>v1.3.0 (2026.04.24)</strong>
                    <ul>
                      <li>색상 변환기 (HEX ↔ RGB ↔ HSL) 추가</li>
                      <li>CSS Minifier / Formatter 도구 추가</li>
                      <li>CSS Clamp 생성기 UI 디자인 전면 개편</li>
                    </ul>
                  </div>
                  <div class="version-item">
                    <strong>v1.2.0 (2026.04.23)</strong>
                    <ul>
                      <li>CSS 스타일 및 시각화 생성기 추가</li>
                      <li>Box Shadow & Text Shadow 생성기</li>
                      <li>Border-Radius 생성기 (Liquid Shape)</li>
                      <li>글래스모피즘 & 뉴모피즘 생성기</li>
                    </ul>
                  </div>
                  <div class="version-item">
                    <strong>v1.1.0 (2026.03.23)</strong>
                    <ul>
                      <li>PX ↔ REM 변환기 및 CSS Clamp 생성기 기능 추가</li>
                      <li>상단 네비게이션(GNB) 추가 및 보조 도구 사용성 개선</li>
                      <li>모바일 환경 UI 최적화(가독성 개편 및 vw 적용 확대)</li>
                    </ul>
                  </div>
                  <div class="version-item">
                    <strong>v1.0.1 (2026.03.23)</strong>
                    <ul>
                      <li>CSS "속성삭제" 체크 시 주석이 포함된 경우 발생하는 변환 오류 수정</li>
                      <li>광고 배너 높이 조정</li>
                    </ul>
                  </div>
                  <div class="version-item">
                    <strong>v1.0.0 (2024.10.01)</strong>
                    <ul>
                      <li>PX ↔ VW 양방향 변환 기본 기능 출시</li>
                      <li>Breakpoints 프리셋 제공 및 CSS 텍스트 일괄 변환 지원</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
'''

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
updated_count = 0

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    start_idx = content.find('<div class="version-modal" id="version-modal">')
    if start_idx == -1:
        continue
    
    end_idx = content.find('<nav class="gnb-menu">')
    if end_idx == -1:
        continue
    
    new_content = content[:start_idx] + modal_content + '        <nav class="gnb-menu">' + content[end_idx+22:]
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    updated_count += 1

print(f"Versions updated in {updated_count} files.")
