import urllib.request
import re
import urllib.parse

def get_images(query):
    req = urllib.request.Request(f'https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}', headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        urls = re.findall(r'img.*?src=\"(//external-content[^\"]+)\"', html)
        if urls:
            print(f"{query}: https:{urls[0]}")
    except Exception as e:
        print(f"Error for {query}: {e}")

get_images('cnh do batman meme')
get_images('harvard diploma diploma')
get_images('placa de pare brasil')
get_images('mars planet')
