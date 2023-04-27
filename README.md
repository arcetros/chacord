> **Warning** Challonge API V1 will be deprecated sooner or later, and it will be rate-limited and no longer updated

<p align="center"> <img src="https://github.com/arcetros/chacord/blob/main/assets/challonge_icon.png?raw=true" alt="Logo"> 
</p>

<p align="center">
	<strong>Chacord</strong><br>
	<i>A simple Discord bot that allows you to manage challonge tournaments</i>
</p>

## Features

Chacord comes with the following features:

-   Slash commands
-   Tournaments
    -   Show tournament
    -   Create tournament
    -   Destroy tournament
    -   Start/Restart tournament
-   Participants
    -   Add participant
    -   Delete participant
    -   Bulk add participants
    -   Randomize participants seed (all of them)
    -   Clear all participants
-   Some supporting utility commands

The bot uses the Challonge API to manage tournaments, so you'll need a Challonge account and API key to use these commands. We're constantly working on adding new features to the bot, so stay tuned for updates!

## Get Started

To run this application you need Node.js 17.5.0 or higher installed on your computer

```bash
> git clone https://github.com/arcetros/chacord
> cd chacord
> npm install
> npm run build
> npm run start
```

### Configuration

Rename `.env.example` to just `.env` and replace the placeholders inside with your info:

-   A Discord Bot Token (**[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**)
-   Challonge API Token (**[here](https://challonge.com/settings/developer)**)

## Disclaimer

This Discord bot is not an official bot and is not affiliated with Discord or Challonge. It is built for learning purposes and should not be used for production or commercial use.

The bot is provided as-is and we do not guarantee its reliability or accuracy. We are not responsible for any damage or loss caused by the use of this bot.

Use this bot at your own risk. We recommend testing it in a safe environment before using it on a live server.

Please note that using the Challonge API to manage tournaments requires a Challonge account and API key. You are responsible for ensuring that you have the necessary permissions to use the API.

If you have any questions or concerns about the bot, please feel free to contact us.

## Contributors

Contributions are always welcome! Feel free to open a PR.

## Acknowledgements

-   [node-challonge](https://github.com/Tidwell/node-challonge)
