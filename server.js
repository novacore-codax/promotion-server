const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());


const cooldowns = {};

const WEBHOOK = "https://discord.com/api/webhooks/1475594117248585728/8UToEv1UO7ebHt2YYHVVbjjBpIonXMmIpkS1VcsUDviCuS6PjhhJJ7uO29HOo21OEa0a";
const API_KEY = "rblx-7PnYF8/37ESX0Raob3qJ11JGoQF0P34qOo+znEcVZe8tzsJ8ZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkluTnBaeTB5TURJeExUQTNMVEV6VkRFNE9qVXhPalE1V2lJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaGRXUWlPaUpTYjJKc2IzaEpiblJsY201aGJDSXNJbWx6Y3lJNklrTnNiM1ZrUVhWMGFHVnVkR2xqWVhScGIyNVRaWEoyYVdObElpd2lZbUZ6WlVGd2FVdGxlU0k2SWpkUWJsbEdPQzh6TjBWVFdEQlNZVzlpTTNGS01URktSMjlSUmpCUU16UnhUMjhyZW01RlkxWmFaVGgwZW5OS09DSXNJbTkzYm1WeVNXUWlPaUl4TkRNM01EZzBOREF3SWl3aVpYaHdJam94TnpjeU16RXpNRGM0TENKcFlYUWlPakUzTnpJek1EazBOemdzSW01aVppSTZNVGMzTWpNd09UUTNPSDAuREJWUF9hNkxReERkN19adnBRcERKT2Rib0FsZE4tSWZXN2NvbnRNamNnc2FGN1hEckNyQlBiOEVMLWpjR1hzWVRPUjlFVHl6elhlZTlaYjJKdWZkOHBvYmIxaDNoRTdBWTJTUDVWaFNleHZyYzBucTFvMDhncW1uYXpKcVdfanBOdW9tWC1qWE5BR3NRT29UVnVZY1NZTkJTME55WkZ0OXBxTXJrSmJJV1kyZkJkSVVpNUczMmlXdDcxYklKSjR5bXpsbXV2eVdxMTE4Yk9KOEFja3NzLWVRb05jMldUQnNCS21HQjFWRWU4SnpiaTJXWXpRcDNYTkUwYS1hbTBtSkluZTQwLW9oZkNJMnRSaWRBSWUzVW9pQzQxa2RSWGxIUnpWVWc3TUNSTzJ4aFlOcjZtTXlraFp4Y19xTTJWdmJUMFBqU1ROUmdEZXdWZDZSYTl1bTdn";
const GROUP_ID = "15698817";


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
