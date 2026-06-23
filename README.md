# 💸 EMI Calculator

<div align="center">

![EMI Calculator Banner](https://img.shields.io/badge/EMI-Calculator-7c2d8f?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHBvbHlnb24gcG9pbnRzPSIzMiwyIDU4LDE3IDU4LDQ3IDMyLDYyIDYsNDcgNiwxNyIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-7c2d8f?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**A professional, feature-rich Loan EMI Calculator with amortization schedule, loan comparison, prepayment analysis, and dark mode.**

[🚀 Live Demo](https://github.com/ruthvik1812/EMI-Calculator) · [🐛 Report Bug](https://github.com/ruthvik1812/EMI-Calculator/issues) · [✨ Request Feature](https://github.com/ruthvik1812/EMI-Calculator/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [EMI Formula](#-emi-formula)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deploy to Vercel](#-deploy-to-vercel)
- [Technologies Used](#-technologies-used)
- [Author](#-author)

---

## 📖 About

This EMI Calculator is a fully client-side web application built with **pure HTML, CSS, and JavaScript** — no frameworks, no dependencies. It helps users plan their loan repayments with a beautiful, responsive UI that works on all devices.

Built with love for **Digital Heroes** 🚀

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧮 **EMI Calculator** | Instant EMI calculation using the standard formula |
| ⚡ **Loan Type Presets** | One-click presets for Home, Car, Personal & Education loans |
| 📊 **Amortization Schedule** | Complete month-by-month repayment breakdown |
| 💾 **CSV Export** | Download full amortization schedule as a CSV file |
| 🖨️ **Print Support** | Print the amortization schedule directly |
| 🔄 **Loan Comparison** | Compare your loan against an alternative rate/tenure |
| 💰 **Prepayment Savings** | Calculate savings from a lump-sum prepayment |
| 💡 **Savings Tip** | Smart suggestion to save money by reducing tenure |
| 🌙 **Dark / Light Mode** | Theme toggle with localStorage persistence |
| 📋 **Copy Results** | One-click copy of all results to clipboard |
| 🔔 **Toast Notifications** | Friendly feedback for every user action |
| 📱 **Responsive Design** | Fully mobile-friendly bento-grid layout |
| ♿ **Accessible** | ARIA labels, semantic HTML, keyboard navigation |

---

## 📐 EMI Formula

The standard **Equated Monthly Instalment** formula used:

```
EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)
```

| Variable | Meaning |
|----------|---------|
| **P** | Principal Loan Amount (₹) |
| **r** | Monthly Interest Rate = Annual Rate ÷ 12 ÷ 100 |
| **n** | Total Number of Months = Tenure in Years × 12 |

**Example:**
- Loan: ₹5,00,000 | Rate: 8.5% p.a. | Tenure: 5 years
- r = 8.5 / 12 / 100 = 0.00708
- n = 5 × 12 = 60
- **EMI ≈ ₹10,254/month**

---

## 📁 Project Structure

```
EMI-Calculator/
│
├── index.html          # Main HTML — structure & layout
├── style.css           # All styling — dark mode, animations, responsive
├── script.js           # All logic — EMI calc, amortization, comparison
├── vercel.json         # Vercel deployment configuration
└── README.md           # Project documentation
```

---

## 🚀 Getting Started

### Option 1 — Open directly in browser

```bash
# Clone the repository
git clone https://github.com/ruthvik1812/EMI-Calculator.git

# Navigate to folder
cd EMI-Calculator

# Open in browser (double-click index.html)
start index.html          # Windows
open index.html           # macOS
xdg-open index.html       # Linux
```

### Option 2 — Use VS Code Live Server

1. Install the **Live Server** extension in VS Code
2. Open the project folder
3. Right-click `index.html` → **Open with Live Server**
4. App opens at `http://localhost:5500`

---

## ☁️ Deploy to Vercel

This project is pre-configured for **Vercel** deployment via `vercel.json`.

### Method 1 — Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New Project**
3. Import your GitHub repository: `ruthvik1812/EMI-Calculator`
4. Click **Deploy** — done! ✅

### Method 2 — Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel

# Deploy to production
vercel --prod
```

### Method 3 — GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Source: **Deploy from branch** → `main` → `/ (root)`
3. Click **Save** — your site will be live at:
   `https://ruthvik1812.github.io/EMI-Calculator`

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic page structure, ARIA accessibility |
| **CSS3** | Custom properties, animations, glassmorphism, dark mode |
| **Vanilla JavaScript** | EMI logic, DOM manipulation, localStorage |
| **Google Fonts** | Raleway (headings) + Poppins (body) |
| **SVG** | Progress ring chart, hexagon logo |
| **Vercel** | Production deployment |

---

## 💡 How to Use

1. **Enter Loan Details** — type the amount, annual interest rate, and tenure (or use sliders)
2. **Use Quick Presets** — click Home / Car / Personal / Education for instant defaults
3. **Click Calculate EMI** — see your monthly EMI, total interest, and total payment
4. **View Amortization** — scroll down for the full month-by-month repayment table
5. **Compare Loans** — enter an alternative rate/tenure and hit Compare Now
6. **Prepayment Analysis** — enter a lump-sum amount and the month to see your savings
7. **Export** — download the CSV or print the amortization schedule

---

## 📱 Responsive Breakpoints

| Screen | Layout |
|--------|--------|
| Desktop (> 720px) | 2-column bento grid |
| Tablet (420–720px) | Single column |
| Mobile (< 420px) | Single column, compact stats |

---

## 🔧 Customisation

The entire design system is controlled via **CSS Custom Properties** in `:root`:

```css
:root {
  --primary:   #7c2d8f;   /* Main violet colour */
  --rose:      #e8345a;   /* Interest / error colour */
  --emerald:   #0dac6f;   /* Total / success colour */
  --amber:     #e8920a;   /* Highlights / tips */
  --magenta:   #d0227c;   /* Accents */
}
```

Dark mode overrides are under `[data-theme="dark"]`.

---

## 👤 Author

**Ruthvik Raj Chintala**

- 📧 Email: [ruthvikraj.chintala1812@gmail.com](mailto:ruthvikraj.chintala1812@gmail.com)
- 🐙 GitHub: [@ruthvik1812](https://github.com/ruthvik1812)
- 🌐 Project: [EMI Calculator](https://github.com/ruthvik1812/EMI-Calculator)

---

## 🤝 Built For

<div align="center">

[![Digital Heroes](https://img.shields.io/badge/Built%20for-Digital%20Heroes-f97316?style=for-the-badge)](https://digitalheroesco.com)

</div>

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by **Ruthvik Raj Chintala** · Built for **Digital Heroes** 🚀

⭐ Star this repo if you found it helpful!

</div>
