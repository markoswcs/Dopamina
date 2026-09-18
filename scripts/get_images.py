import requests
import re
from urllib.parse import quote

def get_wikimedia_image(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=search&gsrsearch={quote(query)}&gsrnamespace=6&gsrlimit=1&iiprop=url"
    res = requests.get(url).json()
    try:
        pages = res['query']['pages']
        first_page = list(pages.values())[0]
        return first_page['imageinfo'][0]['url']
    except Exception as e:
        return "Not found"

print("Air Fryer:", get_wikimedia_image("Air fryer"))
print("Xbox Series S:", get_wikimedia_image("Xbox Series S"))
print("SSD NVMe:", get_wikimedia_image("NVMe SSD"))
