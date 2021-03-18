const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const usersModel = require('../models/users');

app.post('/webhooks', async function (request, response) {
    response.sendStatus(200);
    const authenticationToken = 'cookiesisdabestdevever';
    if (request.headers.authorization === authenticationToken) {
        const webhook = request.body;
        if (webhook.status.toLowerCase() === 'completed') {
            const discordID = webhook.buyer_id;
            const coins = Math.round(webhook.price);
            const user = await usersModel.getForDiscordID(discordID);
            if (user) {
                await usersModel.addRcCoins(user.id, coins);
            }
        }
    }
});

app.listen(5011, function () {
    console.log('donatebot.io webhook running at 5011');
});
