
import { AITool, Category } from './types';

export const CATEGORIES: Category[] = [
  'Writing & Content',
  'Image & Design',
  'Video & Audio',
  'Chatbots & AI Assistants',
  'Business, SEO & Productivity',
  'Developer / Advanced Tools',
  'Specialized / Miscellaneous'
];

export const CATEGORY_ICONS: Record<Category, string> = {
  'Writing & Content': '✍️',
  'Image & Design': '🎨',
  'Video & Audio': '🎥',
  'Chatbots & AI Assistants': '🤖',
  'Business, SEO & Productivity': '💼',
  'Developer / Advanced Tools': '💻',
  'Specialized / Miscellaneous': '✨'
};

const RAW_TOOLS_DATA: { name: string; url: string; category: Category; desc: string }[] = [
  // Writing & Content
  { name: 'Jasper AI', url: 'https://www.jasper.ai', category: 'Writing & Content', desc: 'AI writing for blogs, ads & marketing.' },
  { name: 'Writesonic', url: 'https://writesonic.com', category: 'Writing & Content', desc: 'Content, ads, and landing pages.' },
  { name: 'Copy.ai', url: 'https://www.copy.ai', category: 'Writing & Content', desc: 'Marketing & social copy generator.' },
  { name: 'Rytr', url: 'https://rytr.me', category: 'Writing & Content', desc: 'Budget-friendly AI writing tool.' },
  { name: 'Grammarly GO', url: 'https://www.grammarly.com', category: 'Writing & Content', desc: 'AI-powered writing assistant.' },
  { name: 'QuillBot', url: 'https://quillbot.com', category: 'Writing & Content', desc: 'AI paraphrasing & summarizing tool.' },
  { name: 'Wordtune', url: 'https://www.wordtune.com', category: 'Writing & Content', desc: 'AI writing assistant for rephrasing.' },
  { name: 'Sudowrite', url: 'https://www.sudowrite.com', category: 'Writing & Content', desc: 'AI writing companion for fiction & stories.' },
  { name: 'Anyword', url: 'https://anyword.com', category: 'Writing & Content', desc: 'Data-driven copywriting AI focused on performance and conversions.' },
  
  // Image & Design
  { name: 'Midjourney', url: 'https://www.midjourney.com', category: 'Image & Design', desc: 'Artist-focused AI for generating hyper-realistic and artistic visuals.' },
  { name: 'DALL·E', url: 'https://openai.com/dall-e', category: 'Image & Design', desc: 'OpenAI\'s creative image generator based on natural language prompts.' },
  { name: 'Leonardo AI', url: 'https://leonardo.ai', category: 'Image & Design', desc: 'Full creative suite for high-quality game assets and art.' },
  { name: 'Canva AI', url: 'https://www.canva.com/ai/', category: 'Image & Design', desc: 'Design platform with integrated Magic Media AI features.' },
  { name: 'Adobe Firefly', url: 'https://www.adobe.com/firefly', category: 'Image & Design', desc: 'Generative AI for creative professional workflows.' },
  { name: 'Stable Diffusion', url: 'https://stability.ai/stablediffusion', category: 'Image & Design', desc: 'Open-source latent text-to-image diffusion model.' },
  { name: 'NightCafe', url: 'https://creator.nightcafe.studio', category: 'Image & Design', desc: 'AI art generator with a vibrant community and various models.' },
  { name: 'Remove.bg', url: 'https://www.remove.bg', category: 'Image & Design', desc: 'One-click AI solution for removing image backgrounds.' },

  // Video & Audio
  { name: 'Synthesia', url: 'https://www.synthesia.io', category: 'Video & Audio', desc: 'AI video generation platform using lifelike digital avatars.' },
  { name: 'HeyGen', url: 'https://www.heygen.com', category: 'Video & Audio', desc: 'AI video platform for creating professional business videos.' },
  { name: 'Descript', url: 'https://www.descript.com', category: 'Video & Audio', desc: 'All-in-one video and podcast editor that works like a doc.' },
  { name: 'ElevenLabs', url: 'https://elevenlabs.io', category: 'Video & Audio', desc: 'Advanced AI speech software for lifelike voice synthesis.' },
  { name: 'Murf AI', url: 'https://murf.ai', category: 'Video & Audio', desc: 'Versatile AI voice generator for high-quality voiceovers.' },
  { name: 'Lumen5', url: 'https://lumen5.com', category: 'Video & Audio', desc: 'AI video maker designed for social media and marketing.' },
  { name: 'Speechify', url: 'https://speechify.com', category: 'Video & Audio', desc: 'Leading text-to-speech reader for productivity and learning.' },

  // Chatbots & AI Assistants
  { name: 'ChatGPT', url: 'https://chat.openai.com', category: 'Chatbots & AI Assistants', desc: 'AI chat & productivity assistant.' },
  { name: 'Claude AI', url: 'https://www.anthropic.com/claude', category: 'Chatbots & AI Assistants', desc: 'AI assistant for writing and reasoning.' },
  { name: 'Gemini AI', url: 'https://gemini.google.com', category: 'Chatbots & AI Assistants', desc: 'AI assistant by Google for conversation and tasks.' },
  { name: 'Poe AI', url: 'https://poe.com', category: 'Chatbots & AI Assistants', desc: 'AI chat platform with multiple bots.' },
  { name: 'Character AI', url: 'https://beta.character.ai', category: 'Chatbots & AI Assistants', desc: 'AI-powered conversational characters.' },
  { name: 'Replika', url: 'https://replika.ai', category: 'Chatbots & AI Assistants', desc: 'AI companion chatbot.' },
  { name: 'YouChat', url: 'https://you.com', category: 'Chatbots & AI Assistants', desc: 'AI search engine & chat assistant.' },
  { name: 'DeepSeek AI', url: 'https://deepseek.ai', category: 'Chatbots & AI Assistants', desc: 'AI content search & recommendations.' },
  { name: 'Grok AI', url: 'https://grok.ai', category: 'Chatbots & AI Assistants', desc: 'AI assistant for coding & tasks.' },
  { name: 'Pi AI', url: 'https://pi.ai', category: 'Chatbots & AI Assistants', desc: 'Personal AI assistant.' },

  // Business, SEO & Productivity
  { name: 'Notion AI', url: 'https://www.notion.so/product/ai', category: 'Business, SEO & Productivity', desc: 'Productivity & smart documentation.' },
  { name: 'Tome AI', url: 'https://tome.app', category: 'Business, SEO & Productivity', desc: 'AI storytelling & presentations.' },
  { name: 'Perplexity', url: 'https://www.perplexity.ai', category: 'Business, SEO & Productivity', desc: 'AI search engine providing direct answers with citations.' },
  { name: 'Zapier AI', url: 'https://zapier.com/ai', category: 'Business, SEO & Productivity', desc: 'Natural language automation for connecting thousands of apps.' },
  { name: 'ChatPDF', url: 'https://www.chatpdf.com', category: 'Business, SEO & Productivity', desc: 'Interact with any PDF to summarize and extract data.' },

  // Developer Tools
  { name: 'Mistral AI', url: 'https://www.mistral.ai', category: 'Developer / Advanced Tools', desc: 'Open-weight AI models for developers.' },
  { name: 'GitHub Copilot', url: 'https://github.com/features/copilot', category: 'Developer / Advanced Tools', desc: 'Industry-standard AI pair programmer for IDEs.' },
  { name: 'Cursor AI', url: 'https://cursor.sh', category: 'Developer / Advanced Tools', desc: 'The first AI-native code editor built for productivity.' },
  { name: 'Replit AI', url: 'https://replit.com', category: 'Developer / Advanced Tools', desc: 'Build, test, and deploy software entirely with AI assistance.' },

  // Specialized
  { name: 'Research Rabbit', url: 'https://www.researchrabbit.ai', category: 'Specialized / Miscellaneous', desc: 'Innovative tool for discovering academic research papers.' },
  { name: 'Elicit', url: 'https://elicit.org', category: 'Specialized / Miscellaneous', desc: 'AI research assistant that automates literature reviews.' },
  { name: 'Wolfram Alpha', url: 'https://www.wolframalpha.com', category: 'Specialized / Miscellaneous', desc: 'Computational knowledge engine for math and science.' }
];

export const INITIAL_TOOLS: AITool[] = RAW_TOOLS_DATA.map((tool, index) => ({
  id: `initial-${index}`,
  name: tool.name,
  url: tool.url,
  category: tool.category,
  description: tool.desc,
  isFeatured: index < 8,
  // Explicitly set ChatGPT and Gemini AI to 'Hot' (Trending Today)
  isHot: tool.name === 'ChatGPT' || tool.name === 'Gemini AI' || index % 5 === 0,
  isVerified: true,
  isSponsored: index === 3 || index === 10,
  trustScore: Number((4.3 + Math.random() * 0.7).toFixed(1)),
  rating: Number((4.1 + Math.random() * 0.9).toFixed(1)),
  clicks: Math.floor(Math.random() * 20000) + 5000,
  createdAt: new Date(2023, Math.floor(index / 10), (index % 28) + 1).toISOString().split('T')[0],
  logo: `https://picsum.photos/seed/${tool.name.toLowerCase().replace(/\s/g, '')}/200/200`
}));
