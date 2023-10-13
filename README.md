# WhatsApp GPT Bot
WhatsApp GPT Bot is a chatbot script designed for use on the WhatsApp platform. It is built using Node.js and whatsapp-web.js library.
# Menu
- .menu
- .ai 
- .gptgo
- dalle
- text2img 
- .sticker 
## Prerequisites
Before you start, ensure that you have the following installed on your system:
- Node.js
- Puppeteer
- Chrome
- Npm (Node Package Manager)

## Installation
1. Clone or download the repository from [here](https://github.com/BOTCAHX/whatsapp-gpt).
2. Open your terminal and navigate to the project directory.
3. Run the following command to install the required dependencies:
   ```
   npm install
   ```

## Usage
To start the WhatsApp GPT Bot, run the following command in your terminal:
```
node bot.js
```

## How it Works
WhatsApp GPT Bot utilizes the WhatsApp Web API to connect to a WhatsApp account. It sends and receives messages using the WhatsApp account, allowing it to provide chatbot functionalities.

When a new message is received, the bot uses the message content as an input to the GPT-3 model. The generated response from the model is then sent back as a reply to the sender.


## Contributing
Contributions are welcome! If you find any bugs or want to enhance the features of the bot, feel free to submit a pull request or open an issue.

## License
This project is licensed under the [MIT License](https://github.com/BOTCAHX/whatsapp-gpt).
