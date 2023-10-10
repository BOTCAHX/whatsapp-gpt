const fetch = require('node-fetch');

async function askGPT(text) {
  const baseUrl = 'https://aemt.me/openai';
  const query = `text=${text}`;
  const url = `${baseUrl}?${query}`;

  const chatgpt = await fetch(url).then(res => res.json());
  return chatgpt;
}
async function GptGo(text) {
  const baseUrl = 'https://aemt.me/gptgo';
  const query = `text=${text}`;
  const url = `${baseUrl}?${query}`;

  const gptgo = await fetch(url).then(res => res.json());
  return gptgo;
}

module.exports = {
  askGPT,
  GptGo
}
