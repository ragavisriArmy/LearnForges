# LearnForge: Adaptive Full-Stack Engineering Ecosystem

An interactive, production-ready educational platform combining a high-performance React user interface with a robust Node.js/Express backend API. This system functions as a digital workspace tracking engineering analytics, dynamic quiz evaluation structures, and database integrity metrics.

## 🚀 Live Links
* **Frontend Application:** [https://learn-forges.vercel.app](https://learn-forges.vercel.app)
* **Backend API Gateway:** [https://learnforges.onrender.com](https://learnforges.onrender.com)

---

## 👥 Authors & Collaborators
Developed with precision by the engineering team at **PSG Polytechnic College**:
* **M. Ragavisri (Ragavi)**

---

## 🛠️ Architecture & Tech Stack

### Frontend Architecture
Built as a highly responsive single-page application (SPA) focused on interactive dashboard widgets and user access flow:
* **Framework:** React.js (via Vite for optimized bundling)
* **Styling:** Tailwind CSS / Custom Modern UI Layouts
* **State & Routing:** React Router DOM & Context API
* **Data Fetching:** Axios (configured with environment base URLs)

### Backend Architecture
Designed with a modular, scalable controller-router design pattern to handle system logic and persistent database operations securely:
* **Runtime Environment:** Node.js
* **Server Framework:** Express.js
* **Database Engine:** Relational SQLite Database System
* **Authentication:** Middleware token handling protocols

---

## 📁 File Structure Map

```text
LearnForges/
├── backend/                  # Node.js + Express API Setup
│   ├── config/               # Database initialization (db.js)
│   ├── controllers/          # Business logic (Auth, Courses, Quizzes)
│   ├── middleware/           # Security, Auth, and Error Handlers
│   ├── routes/               # API Endpoint Definitions
│   ├── server.js             # Main App entry point
│   └── package.json
│
└── frontend/                 # React.js SPA Setup
    ├── public/               # SVG assets and icons
    ├── src/
    │   ├── assets/           # Visual presentation components
    │   ├── components/       # Reusable layout elements (Navbar, Protected Routes)
    │   ├── context/          # Auth Context global state management
    │   ├── pages/            # View Layouts (Dashboard, Login, Landing, Home)
    │   ├── App.jsx           # Core layout configuration router
    │   └── main.jsx          # DOM anchor injection
    └── vite.config.js
