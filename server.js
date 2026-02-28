const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());


const cooldowns = {};

const WEBHOOK = process.env.WEBHOOK;
const API_KEY = process.env.API_KEY;
const GROUP_ID = process.env.GROUP_ID;


app.post("/promote", async (req, res) => {

    const username = req.body.username;
    const admin = req.body.admin;

    if (!username) return res.send("No username");


    if (cooldowns[username] && cooldowns[username] > Date.now())
        return res.send("Cooldown");

    cooldowns[username] = Date.now() + 30000;


    try {

        const user = await axios.post(
            "https://users.roblox.com/v1/usernames/users",
            { usernames: [username] }
        );

        const userId = user.data.data[0].id;


        await axios.post(
            `https://groups.roblox.com/v1/groups/${GROUP_ID}/users/${userId}/promote`,
            {},
            {
                headers: {
                    "x-api-key": API_KEY
                }
            }
        );


        await axios.post(WEBHOOK, {

            content:
            `PROMOTION\nAdmin: ${admin}\nUser: ${username}`

        });


        res.send("OK");


    } catch {

        res.send("ERROR");

    }

});


app.listen(3000);
