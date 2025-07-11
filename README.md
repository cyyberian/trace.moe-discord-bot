# trace.moe Discord Bot
This discord bot uses the trace.moe api to identify scenes of animes from images. 

## Features
- Search anime by uploading an image.
- Returns anime title, episode number, and timestamp.
- Shows anime cover and links to AniList page.

## Command
### `/trace`
- Only has one command: /trace.
- Requires an image and returns the anime's name (anilist hyperlink), episode number and timestamp.

## Set-up
- Clone the repo (https://github.com/cyyberian/trace.moe-discord-bot.git)
- Install dependencies (npm install)
- Create an .env file with the following information:
  - DISCORD_TOKEN = your-bot-token-here
  - CLIENT_ID = your-application-id-here
  - GUILD_ID = your-server-id-here
- Run the bot using node index

## Credits
- Made possible using trace.moe API and anilist API, as well as Discord.js
