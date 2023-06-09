import TelegramBot from 'node-telegram-bot-api';
import { SendMessageOptions } from 'chatgpt';
import chatgpt from './chatgpt.js';

const token = process.env.TELEGRAM_BOT_TOKEN as string;
const bot = new TelegramBot(token, { polling: true });
let timeout: ReturnType<typeof setTimeout>;

function sendTypingAction(chatId: number) {
  bot
    .sendChatAction(chatId, 'typing')
    .then(() => {
      timeout = setTimeout(() => {
        sendTypingAction(chatId);
      }, 5000); // set a 5 second delay
    })
    .catch((error) => {
      console.log('Error sending typing action:', error);
    });
}

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

  if (text) {
    sendTypingAction(chatId);

    let option: SendMessageOptions = {
      completionParams: {
        model: 'gpt-3.5-turbo'
      }
    };

    if (parentMessageId) {
      option = { parentMessageId };
    }

    const response = await chatgpt.sendMessage(text, option);
    parentMessageId = response.id;

    if (timeout) {
      clearTimeout(timeout);
    }

    await bot.sendMessage(chatId, response.text, { parse_mode: 'Markdown' });
  } else {
    await bot.sendMessage(chatId, 'Please input text!');
  }
});
