# Personal Trading Bot

This folder contains selected excerpts from a fully functional Steam trading automation bot developed using Node.js.

## 🤖 What It Does

- Logs into Steam with secure credentials.
- Listens for friend requests, trade offers, and chat messages.
- Responds to commands and performs predefined trade actions.
- Can auto-confirm mobile trades using session cookies (omitted here for security).

---

## 🧩 Included Modules

### `trade_bot.js`
- Core entry point for logging into Steam and handling session events.
- Sets online status and initializes the trade interface.
- Skeleton logic included for managing session and user authentication.

### `chat_commands.js`
- Responds to chat input with command-based routing.
- Handles messages like `!status`, `!inventory`, and `!craft`.
- Modular structure makes it easy to expand with more commands.

---

## ⚠️ Disclaimer

This is a **sanitized version** of the bot architecture for portfolio purposes only.  
It does not include trade confirmation logic, authentication credentials, or the full trade handling stack.
