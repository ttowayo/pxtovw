import os

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

# px-to-rem.html 에 있던 안내 텍스트. (오른쪽 배너 밑에 위치)
coupang_text = '''        '''

def extract_main(content):
    start_tag = '<div class="main">'
    start_idx = content.find(start_tag)
    if start_idx == -1:
        return None
    
    # 카운팅을 통해 <div class="main"> 의 닫는 </div> 찾기
    i = start_idx
    div_count = 0
    while i < len(content):
        # <div 로 시작하는지 확인 (클래스 무관)
        if content[i:i+4] == '<div':
            # <div ...> 인지 확실히 하기 위해 (간단히)
            div_count += 1
        elif content[i:i+6] == '</div>':
            div_count -= 1
            if div_count == 0:
                end_idx = i + 6
                return content[start_idx:end_idx]
        i += 1
    return None

for filename in files:
    filepath = os.path.join('d:/my_git/pxtovw', filename)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    main_content = extract_main(content)
    if not main_content:
        print(f"Failed to find main content in {filename}")
        continue
    
    # <div class="main-box"> 가 시작되는 부분 찾기
    main_box_start = content.find('<div class="main-box">')
    if main_box_start == -1:
        print(f"Failed to find main-box start in {filename}")
        continue
    
    # </div>\n    </div>\n 이 나오는 끝부분 (컨테이너 닫힘 등) 앞까지 치환할 거임.
    # 안전하게 <div class="main-box"> 내용 전체를 교체.
    # main_box_start 이후로 <div class="main-box"> 의 짝이 맞는 </div> 찾기
    i = main_box_start
    div_count = 0
    main_box_end = -1
    while i < len(content):
        if content[i:i+4] == '<div':
            div_count += 1
        elif content[i:i+6] == '</div>':
            div_count -= 1
            if div_count == 0:
                main_box_end = i + 6
                break
        i += 1

    if main_box_end == -1:
        print(f"Failed to find main-box end in {filename}")
        continue

    # 새로운 main-box 조립
    new_main_box = f'''<div class="main-box">
{left_banner}
        {main_content}
{right_banner}
{coupang_text}
      </div>'''

    # 교체
    new_content = content[:main_box_start] + new_main_box + content[main_box_end:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Smart rebuild completed.")
