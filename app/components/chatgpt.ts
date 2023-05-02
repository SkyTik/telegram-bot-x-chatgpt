import { ChatGPTAPI } from 'chatgpt';

const chatgpt = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY as string
});
export default chatgpt;
