# 📈 Stoxy — Real-time Stock Market Dashboard

A modern, blazing-fast **stock market web app** built with **Next.js**, **React**, and **MongoDB**, designed for traders and investors who want **smarter watchlists**, **faster insights**, and **actionable alerts** — all in one elegant dashboard.

![Dashboard Preview](public/assets/images/dashboard.jpeg)

---

## 🚀 Features

✅ **Personalized Watchlists** — Add, remove, and organize stocks with instant updates.  
✅ **Live Market Data** — Integrated with **Finnhub API** for real-time price movements.  
✅ **AI-Powered Daily Summaries** — Automated daily stock and market insights delivered via email using **Inngest** + **Nodemailer**.  
✅ **TradingView Widgets** — Embedded professional-grade charts and heatmaps.  
✅ **Secure Authentication** — Managed with **Better Auth**, session persistence, and API protection.  
✅ **Debounced Stock Search** — Lightning-fast lookup with watchlist state enrichment.  
✅ **Responsive Modern UI** — Built with **Tailwind CSS** and **ShadCN** components.  
✅ **Optimized Backend Workflows** — Background job processing powered by **Inngest**.  
✅ **Deployed on Vercel** — Serverless, fast, and scalable deployment.

---

## 🧠 Tech Stack

| Category            | Technology                                                             |
| ------------------- | ---------------------------------------------------------------------- |
| **Frontend**        | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, ShadCN/UI |
| **Backend**         | Next.js API Routes, Inngest, Nodemailer                                |
| **Database**        | MongoDB (Mongoose)                                                     |
| **Auth**            | Better Auth                                                            |
| **Data Provider**   | Finnhub API                                                            |
| **Charts**          | TradingView Embeds                                                     |
| **Hosting**         | Vercel                                                                 |
| **Automation / DX** | CodeRabbit                                                             |

---

## 📸 Preview

> _"Smarter watchlists. Faster decisions."_

| Market Overview | Heatmap | News & Quotes |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

git clone https://github.com/yourusername/stoxy.git
cd stoxy

### 2️⃣ Install dependencies

npm install

### 3️⃣ Add environment variables

Create a `.env.local` file and include:

NODE_ENV='development'
NEXT_PUBLIC_BASE_URL='http://localhost:3000'
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
GEMINI_API_KEY=
NODEMAILER_EMAIL=
NODEMAILER_PASSWORD=
FINNHUB_API_KEY=

### 4️⃣ Run the development server

npm run dev

### 5️⃣ Open your browser

Visit → http://localhost:3000

---

## 🧑‍💻 Author

**Suvigya Mishra**  
💼 Full-stack Developer | React, Next.js, and SaaS Enthusiast  
🔗 LinkedIn: https://linkedin.com/in/suvigyamishra  
🔗 GitHub: https://github.com/crazyhaller

---

## 🪪 License

This project is licensed under the **MIT License** — feel free to use and modify with attribution.

---

⭐ If you like this project, please consider giving it a star on GitHub!
