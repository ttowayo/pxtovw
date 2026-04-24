import os
import re

files = [
    'px-to-rem.html', 'clamp-generator.html', 'css-generator.html', 
    'color-converter.html', 'gradient-generator.html', 'flexbox-visualizer.html',
    'grid-generator.html', 'animation-generator.html', 'divider-generator.html',
    'aspect-ratio.html', 'contrast-checker.html', 'css-tools.html'
]

left_banner = '''<div class="ad-banner left">
          <div class="pc">
            <script src="https://ads-partners.coupang.com/g.js"></script>
            <script>
              new PartnersCoupang.G({
                id: 666605,
                template: "carousel",
                trackingCode: "AF6310726",
                width: "160",
                height: "860",
                tsource: "",
              });
            </script>
          </div>
          <div class="mo">
            <script src="https://ads-partners.coupang.com/g.js"></script>
            <script>
              new PartnersCoupang.G({
                id: 666606,
                template: "carousel",
                trackingCode: "AF6310726",
                width: "100%",
                height: "90",
                tsource: "",
              });
            </script>
          </div>
          <span
            >이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
            수수료를 제공받습니다.</span
          >
        </div>'''

for filename in files:
    filepath = os.path.join('d:/my_git/pxtovw', filename)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Left Banner Cleansing: <div class="main-box"> 와 <div class="main"> 사이 모든 텍스트 교체
    pattern_left = r'(<div class="main-box">).*?(<div class="main">)'
    replacement_left = r'\1\n        ' + left_banner.replace('\\', '\\\\') + r'\n        \2'
    content = re.sub(pattern_left, replacement_left, content, flags=re.DOTALL)

    # 2. Right Banner Cleansing: 
    # 아까 발생한 "        </div>\n          <div class="mo"> ... </div>\n          <span ... </span>\n        </div>" 같은 찌꺼기를 지움.
    # 특정 패턴(mo, 쿠팡 스크립트, span 등)을 찾아서 완전히 제거
    
    # 찌꺼기 덩어리 정규식 (여러 번 나타날 수 있음)
    trash_pattern1 = r'</div>\s*<div class="mo">\s*<script[^>]*></script>\s*<script>[\s\S]*?PartnersCoupang[\s\S]*?</script>\s*</div>'
    trash_pattern2 = r'<span[^>]*>이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의\s*수수료를 제공받습니다\.</span>\s*</div>'
    trash_pattern3 = r'</div>\s*</div>\s*<div class="mo">\s*<script.*?PartnersCoupang.*?</div>\s*</div>'
    
    # 지저분한 것들을 다 지움
    content = re.sub(trash_pattern1, '', content)
    content = re.sub(trash_pattern2, '', content)
    content = re.sub(trash_pattern3, '', content)
    
    # 혹시 남은 빈 </div> 나 줄바꿈 정리
    content = re.sub(r'</div>\s*</div>\s*<div class="ad-banner right">', '</div>\n        <div class="ad-banner right">', content)
    content = re.sub(r'\n\s*\n', '\n', content) # 중복 빈 줄 제거
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Cleansing completed.")
