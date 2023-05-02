import TelegramBot from 'node-telegram-bot-api';
import chatgpt from './chatgpt.js';

const token = process.env.TELEGRAM_BOT_TOKEN as string;

const bot = new TelegramBot(token, { polling: true });

let parentMessageId = '';

bot.on('polling_error', (error) => {
  console.log(error);
});

// Listen for the /start command and send the menu of options
bot.onText(/^\/start$/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Hello!');
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const { text } = msg;

  // send a message to the chat acknowledging receipt of their message
  if (text) {
    bot.sendChatAction(msg.chat.id, 'typing');
    let option;
    console.log(parentMessageId);

    if (parentMessageId) {
      option = { parentMessageId };
    }
    const response = await chatgpt.sendMessage(text, option);
    parentMessageId = response.id;
    console.log(response.text);
    bot.sendMessage(chatId, response.text);
  } else {
    bot.sendMessage(chatId, 'Please input text!');
  }
});
