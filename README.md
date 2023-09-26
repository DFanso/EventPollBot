# EventPollBot

EventPollBot is a Discord bot designed to help server admins and users create interactive polls using both modals and slash commands. With this bot, users can quickly gather feedback, run surveys, or make decisions based on community votes.

## Features

- **Interactive Poll Creation**: Use `/poll` to create a poll using a modal for detailed input.
- **Quick Poll Creation**: Use `/poll2` with command arguments for faster poll setups.
- **Real-time Vote Tally**: As users vote, the bot updates to reflect the current votes.
- **Customizable Polls**: Define your own poll options and descriptions.

## Setup & Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/DFanso/EventPollBot.git
   cd EventPollBot
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Rename `.env.example` to `.env` and fill in your Discord bot token and other required configurations.
   Rename `.config.example.json` to `.config.json` and fill in your Discord bot token and other required configurations.

4. **Start the Bot**:
   ```bash
   npm start
   ```

## Usage

- **Creating a Poll Using Modals**:
   Type `/poll` and follow the interactive modal to set up your poll.

- **Creating a Poll Using Command Arguments**:
   Type `/poll2 Name:YourPollName Desc:YourDescription choices:Choice1,Choice2,Choice3`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
