import os
import re

# 정확한 배너 블록 정의 (index.html 기준)
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

right_banner = '''<div class="ad-banner right">
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

# 업데이트 대상 파일 목록 (index.html 제외)
files = [
    'px-to-rem.html', 'clamp-generator.html', 'css-generator.html', 
    'color-converter.html', 'gradient-generator.html', 'flexbox-visualizer.html',
    'grid-generator.html', 'animation-generator.html', 'divider-generator.html',
    'aspect-ratio.html', 'contrast-checker.html', 'css-tools.html'
]

def replace_banner(content, banner_class, replacement):
    # This regex looks for `<div class="ad-banner left">` or `right` and matches until the corresponding closing `</div>`
    # Because HTML can be deeply nested, regex is tricky. We'll use a simple parser.
    start_tag = f'<div class="{banner_class}">'
    start_idx = content.find(start_tag)
    if start_idx == -1:
        return content # Not found
    
    # We need to find the matching closing div
    open_divs = 0
    end_idx = -1
    i = start_idx
    while i < len(content):
        if content[i:i+4] == '<div':
            open_divs += 1
        elif content[i:i+6] == '</div>':
            open_divs -= 1
            if open_divs == 0:
                end_idx = i + 6
                break
        i += 1
    
    if end_idx != -1:
        return content[:start_idx] + replacement + content[end_idx:]
    return content

for filename in files:
    filepath = os.path.join('d:/my_git/pxtovw', filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filename}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace Left Banner
    content = replace_banner(content, "ad-banner left", left_banner)
    
    # Replace Right Banner
    content = replace_banner(content, "ad-banner right", right_banner)
    
    # Some older files might have a simplified placeholder like `<div class="ad-banner left">...ADVERTISEMENT...</div>`
    # The parser should catch them, but just in case, we can also check for exact string replacements if needed.
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Banners updated across all files.")
