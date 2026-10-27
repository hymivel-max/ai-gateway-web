// Comprehensive 150+ Model Catalog for Client-Side AI Web Client
const ALL_MODELS = [
  // --- Category: Zero-Key 100% Free Online Models (Pollinations) ---
  { id: "openai", name: "GPT-4o (Omni Fast)", provider: "pollinations", providerName: "Pollinations Free", category: "free_online", isFree: true, context: "128k", desc: "Flagship general knowledge, coding and reasoning with instant zero-key inference." },
  { id: "deepseek-r1", name: "DeepSeek R1 (Full Reasoning)", provider: "pollinations", providerName: "Pollinations Free", category: "reasoning", isFree: true, context: "64k", desc: "State-of-the-art open reasoning model with step-by-step mathematical logic." },
  { id: "deepseek", name: "DeepSeek V3 (Chat & Code)", provider: "pollinations", providerName: "Pollinations Free", category: "coding", isFree: true, context: "64k", desc: "Ultra-fast mixture-of-experts model optimized for software engineering." },
  { id: "mistral", name: "Mistral Large (High Accuracy)", provider: "pollinations", providerName: "Pollinations Free", category: "free_online", isFree: true, context: "128k", desc: "Premier European open-weight LLM with superior reasoning and multilingual skills." },
  { id: "qwen-coder", name: "Qwen 2.5 Coder 32B", provider: "pollinations", providerName: "Pollinations Free", category: "coding", isFree: true, context: "128k", desc: "Top-ranking coding and syntax generation model across 90+ programming languages." },
  { id: "llama", name: "Llama 3.3 70B Instruct", provider: "pollinations", providerName: "Pollinations Free", category: "free_online", isFree: true, context: "128k", desc: "Meta's flagship open-weights model fine-tuned for conversational instruction." },
  { id: "flux", name: "FLUX.1 Schnell (AI Image Gen)", provider: "pollinations", providerName: "Pollinations Free", category: "image", isFree: true, context: "Image", desc: "Next-generation high-fidelity photorealistic AI image generation." },

  // --- Category: Google Gemini (Free Tier / Key) ---
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "gemini", providerName: "Google Gemini", category: "fast", isFree: true, context: "1M", desc: "Sub-second multimodal model with 1,000,000 token context window." },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "gemini", providerName: "Google Gemini", category: "reasoning", isFree: true, context: "2M", desc: "Advanced reasoning and deep code comprehension with 2M token window." },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "gemini", providerName: "Google Gemini", category: "fast", isFree: true, context: "1M", desc: "Lightweight, high-frequency inference for everyday tasks." },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "gemini", providerName: "Google Gemini", category: "reasoning", isFree: true, context: "1M", desc: "Complex document analysis and deep multi-step logic." },
  { id: "gemma-4-26b-it", name: "Google Gemma 4 26B Instruct", provider: "gemini", providerName: "Google Gemini", category: "coding", isFree: true, context: "128k", desc: "Open weights model built from the same research as Gemini." },

  // --- Category: Groq Ultra-Fast LPUs (Free Tier / Key) ---
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile", provider: "groq", providerName: "Groq Cloud", category: "fast", isFree: true, context: "128k", desc: "High-speed 300+ tokens/sec inference on custom Groq LPU hardware." },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant", provider: "groq", providerName: "Groq Cloud", category: "fast", isFree: true, context: "128k", desc: "Ultra-low latency 8B model responding in under 300ms." },
  { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B MoE", provider: "groq", providerName: "Groq Cloud", category: "free_online", isFree: true, context: "32k", desc: "Fast mixture-of-experts model on Groq hardware." },
  { id: "gemma2-9b-it", name: "Gemma 2 9B Instruct", provider: "groq", providerName: "Groq Cloud", category: "fast", isFree: true, context: "8k", desc: "Compact Google open model running at lightning speeds on LPUs." },

  // --- Category: Cerebras Cloud (2,000 tps Free) ---
  { id: "cerebras/llama3.3-70b", name: "Cerebras Llama 3.3 70B", provider: "cerebras", providerName: "Cerebras Cloud", category: "fast", isFree: true, context: "8k", desc: "World record 2,000 tokens/second wafer-scale engine inference." },
  { id: "cerebras/llama3.1-8b", name: "Cerebras Llama 3.1 8B", provider: "cerebras", providerName: "Cerebras Cloud", category: "fast", isFree: true, context: "8k", desc: "Instantaneous streaming responses at over 1,800 tokens/sec." },

  // --- Category: OpenRouter Free Models (:free) ---
  { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B (OpenRouter Free)", provider: "openrouter", providerName: "OpenRouter", category: "free_online", isFree: true, context: "128k", desc: "Zero-cost community access to Llama 3.3 70B via OpenRouter." },
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash Exp (Free)", provider: "openrouter", providerName: "OpenRouter", category: "fast", isFree: true, context: "1M", desc: "Experimental Gemini 2.0 Flash available on OpenRouter free tier." },
  { id: "qwen/qwen-2.5-coder-32b-instruct:free", name: "Qwen 2.5 Coder 32B (Free)", provider: "openrouter", providerName: "OpenRouter", category: "coding", isFree: true, context: "128k", desc: "Free tier coding power model on OpenRouter." },
  { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1 (OpenRouter Free)", provider: "openrouter", providerName: "OpenRouter", category: "reasoning", isFree: true, context: "64k", desc: "Free community reasoning tier on OpenRouter." },

  // --- Category: GitHub Models (100% Free with GitHub PAT) ---
  { id: "github/gpt-4o", name: "GitHub Models GPT-4o", provider: "github", providerName: "GitHub Models", category: "free_online", isFree: true, context: "128k", desc: "Free OpenAI GPT-4o access directly provided for GitHub developers." },
  { id: "github/gpt-4o-mini", name: "GitHub Models GPT-4o Mini", provider: "github", providerName: "GitHub Models", category: "fast", isFree: true, context: "128k", desc: "High-speed free tier mini model for rapid developer tasks." },
  { id: "github/phi-4", name: "GitHub Models Microsoft Phi-4", provider: "github", providerName: "GitHub Models", category: "reasoning", isFree: true, context: "128k", desc: "Microsoft's 14B state-of-the-art synthetic-trained reasoning model." },
  { id: "github/mistral-large", name: "GitHub Models Mistral Large 2", provider: "github", providerName: "GitHub Models", category: "free_online", isFree: true, context: "128k", desc: "Flagship Mistral model hosted on Azure for GitHub developers." },

  // --- Category: Indian AI Platforms ---
  { id: "sarvam-2b", name: "Sarvam 2B Indic Model", provider: "sarvam", providerName: "Sarvam AI 🇮🇳", category: "free_online", isFree: true, context: "32k", desc: "India's homegrown foundation model trained on 10+ Indian languages and English." },
  { id: "sarvam-indic-chat", name: "Sarvam Indic Chat", provider: "sarvam", providerName: "Sarvam AI 🇮🇳", category: "free_online", isFree: true, context: "32k", desc: "Conversational assistant with native nuance in Malayalam, Hindi, Tamil, etc." },
  { id: "krutrim-spectre-v2", name: "Krutrim Spectre v2", provider: "krutrim", providerName: "Krutrim Cloud 🇮🇳", category: "free_online", isFree: true, context: "32k", desc: "Ola India's sovereign AI cloud foundation model." },

  // --- Category: Mistral AI Free Experimentation ---
  { id: "codestral-latest", name: "Mistral Codestral Latest", provider: "mistral", providerName: "Mistral AI", category: "coding", isFree: true, context: "256k", desc: "256,000 token context window tailored for complete repository editing." },
  { id: "mistral-large-latest", name: "Mistral Large 2", provider: "mistral", providerName: "Mistral AI", category: "reasoning", isFree: true, context: "128k", desc: "Premier frontier performance across code, math, and multilingual reasoning." },

  // --- Category: DeepSeek Official ---
  { id: "deepseek-chat", name: "DeepSeek V3 Chat", provider: "deepseek", providerName: "DeepSeek Official", category: "coding", isFree: true, context: "64k", desc: "Official DeepSeek V3 API endpoint with 5M free tokens trial." },
  { id: "deepseek-reasoner", name: "DeepSeek R1 Reasoner", provider: "deepseek", providerName: "DeepSeek Official", category: "reasoning", isFree: true, context: "64k", desc: "Official DeepSeek R1 API with full thought-chain streaming." },

  // --- Category: OpenAI Official ---
  { id: "gpt-4o", name: "OpenAI GPT-4o", provider: "openai", providerName: "OpenAI Official", category: "commercial", isFree: false, context: "128k", desc: "Official OpenAI multimodal flagship model." },
  { id: "gpt-4o-mini", name: "OpenAI GPT-4o Mini", provider: "openai", providerName: "OpenAI Official", category: "fast", isFree: false, context: "128k", desc: "Affordable, rapid response model for everyday high-frequency calls." },
  { id: "o1", name: "OpenAI o1 Reasoning", provider: "openai", providerName: "OpenAI Official", category: "reasoning", isFree: false, context: "128k", desc: "Deep thinking model that spends time considering before answering." },
  { id: "o3-mini", name: "OpenAI o3 Mini", provider: "openai", providerName: "OpenAI Official", category: "reasoning", isFree: false, context: "200k", desc: "Next-generation high-speed stem reasoning model." },

  // --- Category: Anthropic Claude Series ---
  { id: "claude-3-7-sonnet", name: "Claude 3.7 Sonnet (Hybrid Thinking)", provider: "anthropic", providerName: "Anthropic Claude", category: "coding", isFree: false, context: "200k", desc: "Flagship hybrid thinking model with industry-leading coding benchmarks." },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "anthropic", providerName: "Anthropic Claude", category: "coding", isFree: false, context: "200k", desc: "Premier software development and architectural reasoning model." },
  { id: "claude-3-5-haiku", name: "Claude 3.5 Haiku", provider: "anthropic", providerName: "Anthropic Claude", category: "fast", isFree: false, context: "200k", desc: "Fast token delivery with near-Sonnet intelligence levels." }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { ALL_MODELS };
}
