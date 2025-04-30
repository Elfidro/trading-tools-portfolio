// ========== Imports ==========
const fs = require('fs');
const path = require('path');
const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const TeamFortress2 = require('tf2');

// ========== Local Modules ==========
const { sendTradeOffer, confirmTradeOffer } = require('./utils/tradeOfferManager');
const { smeltRefined, smeltReclaimed, combineScrap, combineReclaimed } = require('./functions/craftingTF2');
const friendMessageHandler = require('./handlers/friendMessageHandler');

// ========== Load Credentials ==========
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

// ========== Steam Login Setup ==========
const client = new SteamUser();
const community = new SteamCommunity();
const tf2 = new TeamFortress2(client);

// ========== Admin & Permissions ==========
const adminId = [insertadmin];
const allowedUserIds = [insertallowedids];

// ========== Trade Manager Setup ==========
const manager = new TradeOfferManager({
    steam: client,
    community: community,
    language: 'en',
    pollInterval: 5000,
    pollFullUpdateInterval: 120000,
    pollData: {
        sent: {},
        received: {},
        timestamps: {},
        offersSince: 0,
        offerData: {}
    }
});

// ========== Login ==========
client.logOn({
    accountName: credentials.accountName,
    password: credentials.password,
    twoFactorCode: SteamTotp.generateAuthCode(credentials.sharedSecret)
});

// ========== Steam Events ==========
client.on('loggedOn', () => {
    console.log('✅ Logged into Steam.');
    client.setPersona(SteamUser.EPersonaState.Online);
    client.gamesPlayed(440); // Team Fortress 2
});

client.on('webSession', (sessionID, cookies) => {
    manager.setCookies(cookies, (err) => {
        if (err) return console.log('❌ Error setting cookies:', err);
        console.log('🛒 TradeOfferManager ready.');
    });

    community.setCookies(cookies);
});

client.on('error', (err) => {
    console.error('🚨 Steam client error:', err);
});

// ========== TF2 Events ==========
tf2.on('connectedToGC', () => console.log('🟢 Connected to TF2 Game Coordinator.'));
tf2.on('backpackLoaded', () => console.log('🎒 Backpack loaded.'));
tf2.on('craftingComplete', () => client.chatMessage(adminId, '⚠️ Crafting complete.'));
tf2.on('itemAcquired', () => client.chatMessage(adminId, '📦 Item acquired.'));

// ========== Chat Command Handler ==========
client.on('friendMessage', async (senderID, message) => {
    friendMessageHandler(client, manager, community, senderID, message, credentials, tf2);
});

// ========== New Trade Offers ==========
manager.on('newOffer', (offer) => {
    const partnerID = offer.partner.getSteamID64();
    console.log(`📨 New offer #${offer.id} from ${offer.partner.getSteam3RenderedID()}`);

    if (allowedUserIds.includes(partnerID)) {
        offer.accept((err, status) => {
            if (err) {
                return console.log(`❌ Could not accept offer: ${err.message}`);
            }
            console.log(`✅ Offer accepted: ${status}`);
            community.acceptConfirmationForObject(credentials.identitySecret, offer.id, (err) => {
                if (err) {
                    console.log(`⚠️ Error confirming offer: ${err.message}`);
                } else {
                    console.log(`📦 Offer #${offer.id} confirmed.`);
                }
            });
        });
    } else {
        console.log("⚠️ Unknown sender - manual review recommended.");
    }
});

// ========== Offer Status Updates ==========
manager.on('sentOfferChanged', (offer, oldState) => {
    switch (offer.state) {
        case TradeOfferManager.ETradeOfferState.Accepted:
            console.log(`✅ Trade offer ${offer.id} accepted.`);
            break;
        case TradeOfferManager.ETradeOfferState.Declined:
            console.log(`❌ Trade offer ${offer.id} declined.`);
            break;
        case TradeOfferManager.ETradeOfferState.Canceled:
            console.log(`⚠️ Trade offer ${offer.id} canceled.`);
            break;
        default:
            console.log(`ℹ️ Offer ${offer.id} now in state: ${offer.state}`);
    }
});
