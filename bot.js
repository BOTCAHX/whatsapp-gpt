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
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
});

//console.log(client)

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  console.log(chalk.bgYellow.black(`${message.body}`));
});

client.initialize();

client.on("message", async (message) => {
  const text = message.body.toLowerCase(); 

  if (text.includes("!ai")) {
    const chats = await askGPT(text);
    client.sendMessage(message.from, chats.result);
  } else if (text.includes("!gptgo")) {
    const chats2 = await GptGo(text);
    client.sendMessage(message.from, chats2.result);
  } else if (text.includes("!menu")) {
    const dataresponse = `==== LIST COMMAND ====\n*!gptgo*\n*!ai*\n`;
    client.sendMessage(message.from, dataresponse);
  }
});
