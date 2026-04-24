import os
import re

files = [
    'px-to-rem.html', 'clamp-generator.html', 'css-generator.html', 
    'color-converter.html', 'gradient-generator.html', 'flexbox-visualizer.html',
    'grid-generator.html', 'animation-generator.html', 'divider-generator.html',
    'aspect-ratio.html', 'contrast-checker.html', 'css-tools.html'
]

left_banner = '''        <div class="ad-banner left">
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

right_banner = '''        <div class="ad-banner right">
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

coupang_text = '''        '''

def get_tag_boundaries(content, start_index):
    # Find all <div...> and </div> after start_index using regex
    pattern = re.compile(r'<\s*div(?=\s|>)|<\s*/\s*div\s*>', re.IGNORECASE)
    
    count = 0
    # The first match should be the start_index tag itself
    for match in pattern.finditer(content, start_index):
        tag = match.group().lower()
        if tag.startswith('</'):
            count -= 1
        else:
            count += 1
            
        if count == 0:
            return match.end() # Return the index right after the closing </div>
            
    return -1

for filename in files:
    filepath = os.path.join('d:/my_git/pxtovw', filename)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find <div class="main">
    main_start = content.find('<div class="main">')
    if main_start == -1:
        print(f"Failed to find <div class='main'> in {filename}")
        continue
        
    main_end = get_tag_boundaries(content, main_start)
    if main_end == -1:
        print(f"Failed to find end of main in {filename}")
        continue
        
    main_content = content[main_start:main_end]

    # Find <div class="main-box">
    main_box_start = content.find('<div class="main-box">')
    if main_box_start == -1:
        print(f"Failed to find <div class='main-box'> in {filename}")
        continue
        
    main_box_end = get_tag_boundaries(content, main_box_start)
    if main_box_end == -1:
        print(f"Failed to find end of main-box in {filename}")
        continue

    # 조립
    new_main_box = f'''<div class="main-box">
{left_banner}
        {main_content}
{right_banner}
{coupang_text}
      </div>'''

    new_content = content[:main_box_start] + new_main_box + content[main_box_end:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Accurate rebuild completed.")
