# California Budget Planner Pro

A modern, full-stack budgeting web application designed for California residents. Built with Flask (Python) for the backend and HTML/JavaScript for the frontend, this app helps users plan, track, and optimize their finances with California-specific tax and cost-of-living data.

## Features

- **Modern Web UI**: Responsive, single-page interface with multiple tabs (Calculator, Income Converter, Expenses, Goals, Custom Budget, and more).
- **California-Specific Budgeting**: Calculates federal, state, and county taxes using up-to-date CA tax brackets and local rates.
- **Custom Budget Tab**: Interactive sliders and live pie chart for personalized budget planning.
- **Expense Tracking**: Add, view, and categorize expenses. Data stored in SQLite for persistence.
- **Savings & Goals**: Set and track financial goals, with data stored in a portable JSON file.
- **Income Conversion**: Instantly convert between hourly, monthly, and yearly income.
- **Personalized Recommendations**: Dynamic tips and housing recommendations based on user profile and location.
- **User Accounts**: Register, log in, and save multiple budget profiles (optional).
- **One-Click Windows App**: Distributed as a standalone `.exe` (no Python required for end users).

## Technologies Used

- **Backend**: Python 3, Flask, SQLite, JSON
- **Frontend**: HTML5, CSS3, JavaScript (vanilla, Chart.js)
- **Packaging**: PyInstaller for Windows executable

## How to Run (Development)

1. Install Python 3.8+
2. Install dependencies:
   ```sh
   pip install flask flask-cors
   ```
3. Run the backend:
   ```sh
   python budget_backend.py
   ```
4. Open your browser to [http://localhost:5000](http://localhost:5000)

## How to Build Standalone Windows Executable

1. Install PyInstaller:
   ```sh
   python -m pip install pyinstaller
   ```
2. Build the app:
   ```sh
   python -m PyInstaller --onefile --noconsole --add-data "budget_frontend.html;." --add-data "budget_app.db;." --add-data "frontend_global.js;." budget_backend.py
   ```
   - Add `--add-data "goals.json;."` if you want to ship existing goals data.
3. The `.exe` will be in the `dist` folder.
4. Double-click the `.exe` to launch the app (browser opens automatically, no command window).


## Project Highlights for CS Recruitment

- **Full-Stack Engineering**: Designed and implemented both backend (Flask, SQLite, REST APIs) and frontend (HTML/JS, Chart.js, UI/UX).
- **Real-World Data Integration**: Used real California tax brackets and county rates for accurate calculations.
- **Modern SPA Experience**: Single-page app feel with dynamic tab switching and live updates.
- **Packaging & Distribution**: Automated build process for Windows, including troubleshooting and user-friendly deployment.
- **Security**: User authentication, password hashing, and session management.
- **Code Quality**: Modular, well-documented codebase with clear separation of concerns.
- **User-Centric Design**: Focused on actionable insights, ease of use, and accessibility.

## Possible Talking Points for Interviews

- How you handled state/county tax logic and dynamic recommendations.
- Building a full-stack app from scratch and connecting all layers.
- Packaging Python web apps as Windows executables for non-technical users.
- UI/UX decisions for financial tools and data visualization.
- Troubleshooting PyInstaller and cross-platform packaging issues.
- Using Python's standard library for file/database management and security.

## For Recruiters: Why This Project is "Ferdaaa"

- Built for real-world impact: helps Californians make smarter financial decisions.
- End-to-end engineering: from database to browser, all code written and integrated by me.
- Professional, modern, and user-friendly—ready for production and distribution.
- Demonstrates practical skills in Python, web dev, packaging, and deployment.
- Clean code, clear documentation, and a focus on user experience.

## License

MIT License (or specify your own)

---

*Created by Aadit — 2025*
