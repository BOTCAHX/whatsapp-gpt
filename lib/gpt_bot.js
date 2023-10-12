const fetch = require('node-fetch');

async function askGPT(text) {
  try { 
  const baseUrl = 'https://aemt.me/openai';
  const query = `text=${text}`;
  const url = `${baseUrl}?${query}`;

  const chatgpt = await fetch(url).then(res => res.json());
  return chatgpt;
  } catch (e) {
  throw `Internal server error!`
  } 
}
async function GptGo(text) {
  try {
  const baseUrl = 'https://aemt.me/gptgo';
  const query = `text=${text}`;
  const url = `${baseUrl}?${query}`;

  const gptgo = await fetch(url).then(res => res.json());
  return gptgo;
   } catch (e) {
  throw `Internal server error!`
  } 
}

module.exports = {
  askGPT,
  GptGo
}
