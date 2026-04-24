import os
from html.parser import HTMLParser

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

class MainExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_main = False
        self.div_depth = 0
        self.main_start_pos = -1
        self.main_end_pos = -1

    def handle_starttag(self, tag, attrs):
        if tag == 'div':
            if not self.in_main:
                for attr in attrs:
                    if attr[0] == 'class' and attr[1] == 'main':
                        self.in_main = True
                        self.div_depth = 1
                        self.main_start_pos = self.getpos()
                        break
            else:
                self.div_depth += 1

    def handle_endtag(self, tag):
        if tag == 'div' and self.in_main:
            self.div_depth -= 1
            if self.div_depth == 0:
                self.in_main = False
                self.main_end_pos = self.getpos()

def get_byte_offset(content, line, offset):
    lines = content.split('\n')
    pos = 0
    for i in range(line - 1):
        pos += len(lines[i]) + 1
    return pos + offset

for filename in files:
    filepath = os.path.join('d:/my_git/pxtovw', filename)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    parser = MainExtractor()
    parser.feed(content)
    
    if parser.main_start_pos == -1 or parser.main_end_pos == -1:
        print(f"Failed to parse {filename}")
        continue
        
    # HTMLParser's getpos() returns (line, offset) where line is 1-indexed and offset is 0-indexed
    # Note: handle_starttag gives position of '<'
    # handle_endtag gives position of '<' of closing tag
    
    start_idx = get_byte_offset(content, parser.main_start_pos[0], parser.main_start_pos[1])
    end_idx = get_byte_offset(content, parser.main_end_pos[0], parser.main_end_pos[1]) + 6 # +6 for '</div>'
    
    main_content = content[start_idx:end_idx]
    
    # Now reconstruct the whole file from <div class="main-box"> to </div> </div> before scripts
    main_box_start = content.find('<div class="main-box">')
    
    # Find the end of container/main-box. It's usually right before <!-- Supabase or <script src="https://unpkg.com
    script_start = content.find('<!-- Supabase')
    if script_start == -1:
        script_start = content.find('<script src="https://unpkg.com')
        if script_start == -1:
             script_start = content.find('<!-- 모바일')
    
    # script_start is the start of footer scripts.
    # The new content should be:
    new_main_box = f'''<div class="main-box">
{left_banner}
        {main_content}
{right_banner}
{coupang_text}
      </div>
    </div>
'''
    new_content = content[:main_box_start] + new_main_box + '\n    ' + content[script_start:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("HTMLParser rebuild completed.")
