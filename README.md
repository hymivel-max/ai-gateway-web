# ⚡ AI Gateway Web Client (GitHub Pages Ready)

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Hosting-success.svg?logo=github)](https://pages.github.com/)
[![Zero Key](https://img.shields.io/badge/Free%20Tier-Zero%20Key%20Needed-brightgreen.svg)](#features)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Models](https://img.shields.io/badge/models-150%2B%20catalog-blue.svg)](models.html)

A sleek, 100% client-side AI Chat Playground and Web Client designed to be hosted directly on **GitHub Pages** with **zero backend server, zero Python, and zero databases required**.

Runs out-of-the-box with **100% Free Zero-Key AI Models** (GPT-4o, DeepSeek R1, Mistral Large, Qwen 2.5 Coder, Llama 3.3, and FLUX Image AI) and allows users to optionally connect their own Google Gemini, Groq, or OpenAI API keys directly from their browser.

---

## 🌟 Key Features

- **🚀 1-Click GitHub Pages Ready:** Pure HTML5, CSS3, and modern Vanilla JS. No build steps, no Node.js, no Docker, no server required!
- **🔓 Instant Free AI Models (Zero-Key):**
  - **GPT-4o (Omni Fast)**
  - **DeepSeek R1** (Full step-by-step mathematical reasoning)
  - **DeepSeek V3** (Software engineering & syntax)
  - **Mistral Large** (Multilingual frontier reasoning)
  - **Qwen 2.5 Coder 32B** (Specialized programming assistant)
  - **Meta Llama 3.3 70B**
  - **FLUX.1 Schnell** (Photorealistic AI Image Generation)
- **🔑 Bring Your Own Key (Optional):**
  - Connect Google Gemini, Groq LPUs, or OpenAI API keys in the Settings modal.
  - **100% Client-Side Privacy:** Keys are stored strictly in browser `localStorage` and never sent to any intermediary server.
- **💻 Markdown & Syntax Highlighting:**
  - Real-time markdown streaming via `marked.js`.
  - Syntax highlighted code blocks with 1-click **Copy Code** button via `highlight.js`.
  - LaTeX mathematical equations supported via `KaTeX`.
- **🎙️ Voice Input & Multi-Chat Sessions:**
  - Speech-to-Text input via Web Speech API.
  - Local multi-session chat history and conversation export to Markdown.
- **📱 Responsive Glassmorphic Dark UI:**
  - Works seamlessly across desktop, tablets, and mobile devices.

---

## ⚡ 1-Minute GitHub Pages Hosting Guide

Follow these simple steps to host this web app on your GitHub account for free:

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Set repository name (e.g., `ai-gateway-web` or `<your-username>.github.io`).
3. Set visibility to **Public**.
4. Click **Create repository**.

### Step 2: Push this Folder to GitHub
Run the following commands inside this directory:

```bash
# Initialize git
git init
git branch -M main

# Stage and commit
git add .
git commit -m "feat: initial commit for GitHub Pages AI Web Client"

# Connect and push
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. In your GitHub repository, click **Settings** (top tab).
2. In the left sidebar, click **Pages** (under the "Code and automation" section).
3. Under **Build and deployment** → **Source**, select **Deploy from a branch**.
4. Under **Branch**, select `main` and folder `/ (root)`.
5. Click **Save**.

🎉 **Your AI Web App is now live!** In ~60 seconds, access it at:
```
https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPO_NAME>/
```

---

## 📂 Project Structure

```
ai-gateway-web/
├── index.html          # Main AI Chat Playground UI
├── models.html         # Interactive 150+ Model Explorer & Catalog
├── .nojekyll           # Bypasses Jekyll for GitHub Pages
├── LICENSE             # MIT License
├── README.md           # Documentation & Hosting Guide
├── css/
│   └── styles.css      # Modern Glassmorphic Dark Theme
└── js/
    ├── app.js          # Core client-side inference & stream engine
    └── models_data.js  # Catalog dataset of 150+ AI models
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
