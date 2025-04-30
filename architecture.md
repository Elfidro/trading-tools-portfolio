
# Architecture Overview: Trading Tools Portfolio

This document outlines the high-level architecture of two major personal projects: the **Trading Multitool** and the **Personal Trading Bot**.
These tools work independently but can be used together to streamline and automate virtual item trading using real-time market data.

---

## 📦 Components

### 1. Trading Multitool (Python-based)
A data analysis suite for parsing, filtering, and analyzing trading market data from the Steam Web API and other sources.

**Key Modules:**
- `item_parser.py`: Parses raw JSON data from the Steam market and extracts structured item information.
- `price_analyzer.py`: Analyzes price history, identifies underpriced or high-demand items, and flags trade opportunities.

**Workflow:**
1. Fetch JSON data from Steam API or static mock data.
2. Parse into a structured internal format.
3. Run analysis to detect price anomalies or filter by user-defined criteria.
4. Output summary reports or item recommendations.

---

### 2. Personal Trading Bot (Node.js-based)
A bot that interacts with the Steam platform to manage trades, confirmations, and user messages autonomously.

**Key Modules:**
- `trade_bot.js`: Initializes the bot, manages session and trade logic, and handles offer sending/receiving.
- `chat_commands.js`: Responds to incoming messages with command routing (e.g., `!inventory`, `!craft`, `!trade`), acting as the user interface.

**Workflow:**
1. Login to Steam via bot credentials.
2. Listen for friend requests, trade offers, and chat messages.
3. Handle trades using pre-built templates or craft logic.
4. Auto-confirm and notify via log or chat messages.

---

## 🔄 Integration (Optional Use Case)

These tools can be linked by having the multitool generate recommended actions (e.g., which items to craft or trade) and feeding those into the bot for automated execution.

**Example Flow:**
1. Multitool identifies `Item A` as undervalued.
2. Output is saved to a JSON file or in-memory queue.
3. Bot reads recommendation, sends trade offer, logs result.

---

## ⚙️ Hosting / Deployment

- **Environment:** Raspberry Pi used for 24/7 operation of the trading bot.
- **Scheduling:** Cron jobs or bot-specific timers for multitool scans (hourly/daily).
- **Security:** Token-based login for Steam APIs; local secrets storage.

---

## 🧠 Design Philosophy

- **Modular**: Easy to test and maintain individual components.
- **Minimal External Dependencies**: Uses lightweight libraries to ensure compatibility across devices.
- **Portable**: Raspberry Pi-compatible and deployable via basic SSH setup.
- **Private-Core Strategy**: Sensitive logic is kept private; this portfolio contains only safe and illustrative excerpts.

---
