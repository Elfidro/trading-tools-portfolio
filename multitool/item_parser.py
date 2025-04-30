import json
import math

def load_environment_config(path):
    with open(path, 'r') as file:
        return json.load(file)

def load_item_list(path):
    with open(path, 'r', encoding='utf-8') as file:
        return [line.strip() for line in file if line.strip()]

def parse_backpack_listings(data_bptf):
    listings = data_bptf.get("listings", [])
    parsed = []
    for listing in listings:
        item = listing.get("item", {})
        parsed.append({
            "steamid": listing.get("steamid"),
            "intent": listing.get("intent"),
            "id": item.get("id"),
            "quality": item.get("quality"),
            "quantity": item.get("quantity"),
            "metal": listing.get("currencies", {}).get("metal"),
            "keys": listing.get("currencies", {}).get("keys")
        })
    return parsed

def process_scm_price(data_scm, key_ref_ratio):
    if 'lowest_price' not in data_scm or not data_scm['lowest_price']:
        return None

    lowest_price = float(data_scm['lowest_price'].replace('CDN$', '').replace(',', '').strip())
    processed_price = lowest_price / 1.15
    processed_lowest_price = math.ceil(processed_price * 100) / 100
    processed_lowest_ref_price = processed_lowest_price / key_ref_ratio

    data_scm['processed_lowest_price'] = processed_lowest_price
    data_scm['processed_lowest_ref_price'] = round(processed_lowest_ref_price, 2)
    return data_scm
