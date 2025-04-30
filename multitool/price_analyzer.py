import json
import time
import math
import requests
from item_parser import (
    load_environment_config,
    load_item_list,
    parse_backpack_listings,
    process_scm_price
)

def trading_algorithm():
    counter = 0
    version = select_file_version()

    folder_path = r'C:\Users\...\Trading Multitool\Market Analysis'
    if version == "original":
        market_hash_names_file = "market_hash_names.txt"
        profitable_trades_file = "profitable_trades.txt"
    else:
        market_hash_names_file = "market_hash_names_1.txt"
        profitable_trades_file = "profitable_trades_1.txt"

    config = load_environment_config(rf'{folder_path}\environment.json')
    market_hash_names = load_item_list(rf'{folder_path}\{market_hash_names_file}')

    profitable_trades_path = rf'{folder_path}\{profitable_trades_file}'
    spreadsheet_file = rf'{folder_path}\spreadsheet.csv'

    with open(profitable_trades_path, 'w') as f:
        f.write("Profitable Trades:\n\n")
    with open(spreadsheet_file, 'w') as f:
        f.write("Name,Sell Price,Margin in Ref,Margin %,Amount\n")

    for market_hash_name in market_hash_names:
        params_scm = {"appid": 440, "market_hash_name": market_hash_name, "currency": 20}
        params_bptf = {"appid": 440, "sku": market_hash_name, "quality": 6, "token": token}

        try:
            response_bptf = requests.get(url_bptf, params=params_bptf)
            data_bptf = response_bptf.json()
            listings = parse_backpack_listings(data_bptf)

            response_scm = requests.get(url_scm, params=params_scm)
            data_scm = process_scm_price(response_scm.json(), key_ref_ratio)

            if data_scm is None:
                continue

            profitable_listings = []
            for entry in listings:
                if entry['intent'] == 'sell' and entry['metal'] is not None:
                    metal = entry['metal']
                    if entry['keys'] is not None:
                        metal += key_metal_value * entry['keys']
                    metal = round(metal, 2)

                    margin = data_scm['processed_lowest_ref_price'] - metal
                    percentage = (data_scm['processed_lowest_ref_price'] / metal - 1) * 100
                    if percentage > 10:
                        profitable_listings.append({
                            "market_hash_name": market_hash_name,
                            "sell_metal_value": metal,
                            "margin": round(margin, 2),
                            "percentage": round(percentage, 2),
                            "link": create_tradelink(entry),
                            "processed_price": data_scm['processed_lowest_ref_price']
                        })

            if len(profitable_listings) > 2:
                with open(profitable_trades_path, 'a') as f:
                    for listing in profitable_listings:
                        f.write(f"{listing['market_hash_name']}\tPrice: {listing['sell_metal_value']:.2f} ref\t"
                                f"Margin {listing['margin']:.2f} and {listing['percentage']:.2f}%\t"
                                f"Processed price: {listing['processed_price']:.2f} ref\t"
                                f"link: {listing['link']}\n")
                    f.write("\n")

                middle = len(profitable_listings) // 2
                if len(profitable_listings) % 2 == 0:
                    middle_listing = profitable_listings[middle - 1]
                else:
                    middle_listing = profitable_listings[middle]

                with open(spreadsheet_file, 'a') as f:
                    f.write(f"{middle_listing['market_hash_name']},{middle_listing['sell_metal_value']},"
                            f"{middle_listing['margin']},{middle_listing['percentage']}%,"
                            f"{len(profitable_listings)}\n")

        except requests.exceptions.RequestException as e:
            print(f"Request failed for {market_hash_name}: {e}")

        finally:
            proxy_counter += 1
            proxy_counter = proxy_counter % len(proxies)

        time.sleep(3.5)
        counter += 1
        if counter > 500:
            break

    print("Completed")
