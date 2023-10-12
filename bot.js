const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { platform } = require('node:os')
const { askGPT, GptGo } = require('./lib/gpt_bot');
const chalk = require('chalk');

const client = new Client({
        authStrategy: new LocalAuth({
        clientId: 'whatsapp-web',
        dataPath: './sessions'
    }),
    puppeteer: {
        headless: true,
        args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", 
      "--disable-gpu",
    ],
        authStrategy: new LocalAuth(),
        executablePath: platform() === 'win32' ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' : '/usr/bin/google-chrome-stable'
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36'
});

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

console.log(client)

client.on("qr", (qr) => {
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', message => {
    console.error('AUTHENTICATION FAILURE', message);
});

client.on('ready', async () => {
    console.log(`${JSON.stringify(client.info)}`)
});
client.initialize();

client.on("message", async (message) => {
  console.log(chalk.bgYellow.black(`${message.fromMe ? 'Me' : message.from}`));
  console.log(chalk.bgYellow.black(`> ${message.body}`));

  const text = message.body.toLowerCase();

  if (text.includes(".ai")) {
    try {
      const inputText = text.replace(".ai", "");
      const chats = await askGPT(inputText);      
      console.log(chalk.bgGreen.black(`> ${chats.result}`));     
      client.sendMessage(message.from, chats.result);
    } catch (e) {
      console.log(e);
    }
  } else if (text.includes(".gptgo")) {
    try {
      const inputText2 = text.replace(".gptgo", "");
      const chats2 = await GptGo(inputText2);     
      console.log(chalk.bgGreen.black(`> ${chats2.result}`));
      client.sendMessage(message.from, chats2.result);
    } catch (e) {
      console.log(e);
    }
  } else if (text.includes(".sticker")) {
    try {
      const quotedMsg = await message.getQuotedMessage();      
      
      if (quotedMsg && quotedMsg.hasMedia) {
        const media = await quotedMsg.downloadMedia();
        client.sendMessage(message.from, media, { sendMediaAsSticker: true, stickerAuthor: "BOTCAHX", stickerName: "Bot", stickerCategories: ["bot", "random"]});
      }
    } catch (e) {
      console.log(e);
    }
  } else if (text.includes(".menu")) {
    const r_menu = `
┌ *MENU*
│ ◦ ai
│ ◦ gptgo
│ ◦ sticker
└ `;
    client.sendMessage(message.from, r_menu);
  }
});
