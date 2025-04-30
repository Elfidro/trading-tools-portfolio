// ========== Imports ==========
const helpCommand = require('../commands/help');
const craftCommand = require('../commands/craft');
const autoAcceptConfirmations = require('../commands/autoAcceptConfirmations');
const tradeCommand = require('../commands/trade');
const tradesCommand = require('../commands/trades');
const sendTradeOfferCommand = require('../commands/sendTradeOffer');
const websocketCommand = require('../commands/websocketCommand');

// ========== Config ==========
const adminId = [insertadmin];

// ========== Chat Command Dispatcher ==========
module.exports = async function(client, manager, community, senderID, message, credentials, tf2) {
    console.log(`💬 Message from ${senderID}: ${message}`);

    if (senderID.getSteamID64() !== adminId || !message.startsWith('!')) return;

    let [command, parameters, state] = message.split(' ');
    parameters = parameters || null;
    state = state || 0;

    switch (command.toLowerCase()) {
        case '!help':
            helpCommand(client, senderID);
            break;
        case '!craft':
            await craftCommand(client, senderID, parameters, state, tf2);
            break;
        case '!confirmations':
            autoAcceptConfirmations(manager, community, client, senderID, credentials);
            break;
        case '!trade':
            tradeCommand(client, senderID, manager, message);
            break;
        case '!trades':
            tradesCommand(client, senderID, manager);
            break;
        case '!sendtradeoffer':
            await sendTradeOfferCommand(client, senderID, manager, community, parameters, state, credentials);
            break;
        case '!websocket':
            websocketCommand(client, senderID, manager, credentials, community);
            break;
        default:
            client.chatMessage(senderID, '❓ Unknown command. Type !help for available commands.');
            break;
    }
};
