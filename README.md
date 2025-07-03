
# California Budget Planner Pro

A modern, full-stack budgeting web app tailored for California residents. Plan, track, and optimize your finances with real CA tax data, personalized recommendations, and a user-friendly interface.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Highlights](#project-highlights)
- [License](#license)

## Overview

California Budget Planner Pro helps users make smarter financial decisions by providing accurate tax calculations, dynamic budgeting tools, and actionable insights. Built with Flask (Python) and vanilla JS, it’s designed for real-world impact and ease of use.

## Features

- Responsive, single-page web UI
- California-specific tax and cost-of-living calculations
- Multiple named user profiles (create, select, download, upload, delete)
- Expense tracking and categorization
- Savings goals and recommendations
- Income conversion (hourly, monthly, yearly)
- Personalized budget breakdowns and tips
- Secure user authentication and session management
- Export/import profiles as JSON
- One-click Windows executable (no Python required for end users)

## Tech Stack

- **Backend:** Python 3, Flask, SQLite
- **Frontend:** HTML5, CSS3, JavaScript (Chart.js)
- **Packaging:** PyInstaller

## Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/california-budget-planner-pro.git
   cd california-budget-planner-pro
   ```

2. **Install dependencies**
   ```sh
   pip install flask flask-cors
   ```

3. **Run the app**
   ```sh
   python budget_backend.py
   ```
   Open your browser at [http://localhost:5000](http://localhost:5000)

4. **Build Windows executable (optional)**
   ```sh
   python -m pip install pyinstaller
   python -m PyInstaller --onefile --noconsole --add-data "budget_frontend.html;." --add-data "budget_app.db;." --add-data "frontend_global.js;." budget_backend.py
   ```

## Usage

- Register or log in to create and manage multiple budget profiles.
- Use the Calculator, Income Converter, and Custom Budget tabs for personalized planning.
- Track expenses, set savings goals, and get dynamic recommendations.
- Export or import your profiles for backup or transfer.

## Project Highlights

- **End-to-End Engineering:** Backend, frontend, and database all designed and integrated from scratch.
- **Real-World Data:** Uses up-to-date California tax brackets and county rates.
- **Modern UX:** SPA feel with dynamic tabs and live data visualization.
- **Security:** Password hashing, session management, and safe defaults.
- **Production-Ready:** Clean code, clear documentation, and easy packaging for Windows.

## License

MIT License

---

*Created by Aadit — 2025*
