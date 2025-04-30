# Trading Multitool

This folder contains selected modules from a personal project used to analyze virtual item markets and identify profitable trade opportunities.

## 📌 Overview

The multitool is a data-processing suite that collects item data from the Steam Community Market (or other APIs), parses it into structured formats, and runs analysis to highlight undervalued or high-demand items.

---

## 🧩 Included Modules

### `price_analyzer.py`
- Analyzes market prices of items compared to historical or average pricing.
- Identifies underpriced assets based on a configurable threshold (e.g., 75% of average value).
- Outputs a list of candidate items for trade or purchase.

### `item_parser.py`
- Converts raw JSON responses from Steam API or market listings into usable Python dictionaries.
- Extracts key information such as item name, tradability, type, and price.
- Helps standardize data for later use in analysis and automation.

---

## ⚠️ Disclaimer

This is a **sanitized portfolio version** of the multitool and does not contain the full source or logic used in live trading.  
It is intended only for demonstration purposes.
