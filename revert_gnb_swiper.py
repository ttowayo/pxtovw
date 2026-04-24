import os
import re

def revert_swiper(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove Swiper CSS
    content = re.sub(r'\s*<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />', '', content)
    
    # 2. Remove Swiper JS
    content = re.sub(r'\s*<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>', '', content)
    
    # 3. Remove Swiper Initialization Script (Improved regex)
    # This regex looks for the script block starting with gnbSwiper initialization
    content = re.sub(r'\s*<script>\s*document\.addEventListener\([\'\"]DOMContentLoaded[\'\"][\s\S]*?const gnbSwiper = new Swiper\([\'\"].gnb-menu[\'\"][\s\S]*?</script>', '', content)

    # 4. Revert GNB Classes
    content = content.replace('class="gnb-menu swiper"', 'class="gnb-menu"')
    content = content.replace('class="gnb-menu-inner swiper-wrapper"', 'class="gnb-menu-inner"')
    content = content.replace('swiper-slide', '')
    
    # Clean up excess whitespace in class attributes
    content = re.sub(r'class="gnb-item\s+active"', 'class="gnb-item active"', content)
    content = re.sub(r'class="gnb-item\s+"', 'class="gnb-item"', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
for file in html_files:
    revert_swiper(file)
    print(f"Reverted {file}")
