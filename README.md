# 📖 HotGirlsRead

A premium, modern social reading dashboard designed for sharing your reading journey, tracking reading goals, and connecting with friends. 

HotGirlsRead combines a warm, elegant pink-and-cream aesthetic with a seamless, responsive Single Page Application (SPA) experience.

---

## ✨ Features

- **🔍 Global Book Database Search**: Real-time debounced autocomplete search querying the **Google Books API** (with a robust **Open Library API** fallback). Zero manual book entry required!
- **📖 Progress & Status Updates**: Post what you're reading or finished. Easily transition books from *"Currently Reading"* to *"Finished"* directly from your sidebar or feed, logging star ratings and reviews dynamically.
- **📊 Profile Dashboard & Book Insights**:
  - **Shelf Grid**: A visual grid of all books you've logged with dynamic status badges.
  - **Goal Tracking**: A custom progress challenge bar showing how close you are to your annual reading goal.
  - **Insights & Metrics**: Counters showing total books read, currently reading count, likes received, and your average star rating.
  - **Genre Breakdown**: A clean, graphical bar-chart breakdown of your favorite book genres.
- **💕 Social Feed & Friends**:
  - Heart posts, leave comments, and see what's trending.
  - A dedicated **Friends Tab** tracking your friends' active reading progress and reviews.
- **⚙️ Inline Profile Personalization**: Customize your display name, username, avatar, cover banner, bio, and reading goals directly inside your profile view.

---

## 🎨 Design Aesthetics

- **Harmonious Palette**: Built on curated deep burgundy, warm pinks, soft creams, and clean borders.
- **Typography**: Sleek pairing of serif headers (**Lora** from Google Fonts) and modern sans-serif body text (**Inter**).
- **Subtle Motion**: Heart-pop likes, slide-down editors, and spinning loading states designed to wow at first glance.
- **Fully Responsive**: Adapts beautifully to mobile, tablet, and desktop viewports.

---

## 🚀 Getting Started

This application is built with vanilla, client-side web technologies. Because it utilizes ES6 JavaScript modules, it needs to be run using a local development server rather than opening the HTML file directly.

### Option 1: Using Python (Terminal)
Open your terminal inside the project folder and run:
```bash
python -m http.server 8001
```
Then open [http://localhost:8001](http://localhost:8001) in your browser.

### Option 2: VS Code Live Server
If you are using VS Code, right-click on `index.html` and select **Open with Live Server**.

---

## 🛠️ Built With

- **HTML5**: Structured semantically for modern browser compatibility and SEO.
- **Vanilla CSS**: Premium styling without the overhead of heavy frameworks.
- **ES6 JavaScript**: Modular, structured state control and dynamic DOM rendering.
- **APIs Used**: [Google Books API](https://developers.google.com/books) and [Open Library API](https://openlibrary.org/developers/api).
