/*
/*************************
* Kalo mau pake tinggal pake aja 
* jangan hapus sumber nya
* Github : BOTCAHX 
* Source Code : https://github.com/BOTCAHX/whatsapp-gpt
**************************
*/

const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { platform } = require('node:os')
const { askGPT, GptGo } = require('./lib/gpt_bot');
const chalk = require('chalk');
const { puppeteer } = require('puppeteer');
const { fromBuffer } = require('file-type');
const fetch = require('node-fetch');

const BASE_URL = 'https://aemt.me'

const client = new Client({
        authStrategy: new LocalAuth({
        // proxyAuthentication: { username: 'username', password: 'password' },
        clientId: 'whatsapp-web',
        dataPath: './sessions'
    }),
    puppeteer: {
        headless: true,
        // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
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
// jika pemulihan sesi tidak berhasil
    console.error('AUTHENTICATION FAILURE', message);
});

// auto reject jika telpon masuk
client.on("call", async call => {
  await call.reject();
  await client.sendMessage(call.from, `\`\`\`This number can only receive text messages!\`\`\``)
});

client.on('ready', async () => {
    console.log(`${JSON.stringify(client.info)}`)
});

client.initialize();

// message responses
client.on("message", async (message) => {
  console.log(chalk.bgYellow.black(`${message.fromMe ? 'Me' : message.from}`));
  console.log(chalk.bgYellow.black(`> ${message.body}`));

  const text = message.body.toLowerCase();
  // List fitur bot 
  if (text.includes(".ai")) {
    try {      
      const inputText = text.replace(".ai", "");
      if (!inputText) await client.sendMessage(message.from, `Enter a Question!`)
      message.react('⏳');
      const chats = await askGPT(inputText);      
      console.log(chalk.bgGreen.black(`> ${chats.result}`));     
      client.sendMessage(message.from, chats.result);
      message.react('✔️');
    } catch (e) {
      console.log(e);
    }
    } else if (text.includes(".gptgo")) {
    try {
      const inputText2 = text.replace(".gptgo", "");
       if (!inputText2) await client.sendMessage(message.from, `Enter a Question!`)
       message.react('⏳');
      const chats2 = await GptGo(inputText2);     
      console.log(chalk.bgGreen.black(`> ${chats2.result}`));
      client.sendMessage(message.from, chats2.result);
      message.react('✔️');
    } catch (e) {
      console.log(e);
    }
    } else if (text.includes(".dalle")) {
      try {
        const inputText1 = text.replace(".dalle", "");
         if (!inputText1) await client.sendMessage(message.from, `Enter parameter text!`)
        message.react('⏳');
        const res = await fetch(BASE_URL + `/dalle` + `?text=${encodeURIComponent(inputText1)}`).then(response => response.buffer())       
        const response = new MessageMedia((await fromBuffer(res)).mime, res.toString("base64"))
        await client.sendMessage(message.from, response, { caption: `Prompt : ${inputText1}` });
        message.react('✔️');
    } catch (e) {
        console.log(e);
    }
     } else if (text.includes(".text2img")) {
      try {        
        const inputText2 = text.replace(".text2img", "");
        if (!inputText2) await client.sendMessage(message.from, `Enter parameter text!`)
        message.react('⏳');
        const res = await fetch(BASE_URL + `/ai/text2img` + `?text=${encodeURIComponent(inputText2)}`).then(response => response.buffer());      
        const response = new MessageMedia((await fromBuffer(res)).mime, res.toString("base64"))
        await client.sendMessage(message.from, response, { caption: `Prompt : ${inputText2}` });
        message.react('✔️');
    } catch (e) {
        console.log(e);
    }    
    } else if (text.includes(".sticker")) {
    try {
      const quotedMsg = await message.getQuotedMessage();
      if (!quotedMsg) await client.sendMessage(message.from, `Send Images With Caption .sticker!`)                 
      if (quotedMsg && quotedMsg.hasMedia) {
        message.react('⏳');
        const media = await quotedMsg.downloadMedia();
        client.sendMessage(message.from, media, { sendMediaAsSticker: true, stickerAuthor: "BOTCAHX", stickerName: "Bot", stickerCategories: ["🗿", "😆"]});
        message.react('✔️');
      }
    } catch (e) {
      console.log(e);
    }
  } else if (text.includes(".menu")) {  // Help Prompt
    const r_menu = `
┌ *MENU*
│ ◦ ai
│ ◦ gptgo
│ ◦ dalle
│ ◦ text2img
│ ◦ menu
│ ◦ sticker
└ `;
    client.sendMessage(message.from, r_menu);
  }
});

