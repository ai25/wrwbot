# WRW Bot

## Installing

1. Install [Node.js v14.11.0](https://nodejs.org) **or above** on your host server
2. Run in terminal `git clone https://github.com/ai25/wrwbot && cd wrwbot`
3. Run in terminal `npm install` or `yarn install`
4. Copy `.env.example` to `.env`
5. Set `TOKENBOT`, `POSTCHANNEL` and `BOTOWNERS` in your `.env` file (see [How to .env](#how-to-bake-env))
6. To start bot, run in terminal `npm run start` or `yarn start`

## How to bake .env

### Preparations

1. [Setting up a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html)
2. [Adding your bot to servers](https://discordjs.guide/preparations/adding-your-bot-to-servers.html)
3. [Enable Developer Mode](https://discordia.me/en/developer-mode)

### How to take TOKEN for Discord Bot

- [Your bot TOKEN](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token)

### How to take channel ID

- [Get channel ID](https://discordia.me/en/developer-mode#:~:text=To%20get%20the%20unique%20ID%20for%20a%20channel)

### How to take user ID

- [Get user ID](https://discordia.me/en/developer-mode#:~:text=To%20get%20the%20unique%20ID%20for%20a%20user)

### ENV VARIABLES

`TOKENBOT` - Discord Bot TOKEN. <br>
`POSTCHANNEL` - Channel ID. Bot will send all posts to your Guild's Channel with this ID. <br>
`BOTOWNERS` - Your bot admins/sysops, who can run admin commands. <br>
`BOTPREFIX` - (optional variable) Prefix for all commands. Example: `!ping`, where `!` is command prefix. <br>
`POLLING_AUTOSTART` - (optional variable) If `true` then bot will fetch posts automatically after start. <br>
`POLLING_INTERVAL` - (optional variable) Interval in milliseconds. How often bot will check for new posts and re-send them to channel. (Minimal is 1000 == 1 sec) <br>
