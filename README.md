# 🧠 Mind Pulse

### Machine Learning Powered Mental Health Score Prediction

Mind Pulse is a full-stack machine learning web application that predicts a mental health score based on lifestyle, academic, social-media usage, sleep, physical activity, and stress-related factors.

> **Disclaimer:** Mind Pulse is an educational project and is not a medical or psychological diagnostic tool.

---

## 🌐 Live Demo

https://mindpulse-w26m.onrender.com/

---

## ✨ Features

- 🧠 Machine Learning based mental health score prediction
- 📊 Interactive analysis and score visualization
- 🌙 Dark and Light mode
- 🎨 Modern and responsive UI
- 📱 Mobile-friendly design
- 🔌 FastAPI REST API
- ✅ Input validation
- 🎯 Animated particle background
- 🧩 shadcn/ui components
- ☁️ Deployed on Render

---

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router

**Backend**
- Python
- FastAPI
- Pydantic
- Pandas
- Joblib
- Uvicorn

**Machine Learning**
- Scikit-learn
- Pandas
- NumPy
- Joblib

**Deployment**
- Render

---

## 📂 Project Structure

```text
Mind-Pulse/
│
├── Model/
│   └── Mental_Health_Model.pkl
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       │   ├── Home.tsx
│       │   └── Analysis.tsx
│       ├── lib/
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
│
├── server/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── .gitignore
└── README.md
```

---

## 🧠 How It Works

```text
User Input
    ↓
React Frontend
    ↓
FastAPI Backend
    ↓
Input Validation
    ↓
Machine Learning Model
    ↓
Mental Health Score
    ↓
Analysis Page
```

A **higher score represents better predicted mental health** according to the model's scoring system.

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- Python 3.9+
- Git

### Clone Repository

```bash
git clone https://github.com/BoGeYmAn04/Mind-Pulse.git
cd Mind-Pulse
```

---

## 🖥️ Frontend

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Run the frontend:

```bash
npm run dev
```

---

## 🐍 Backend

Navigate to the server:

```bash
cd server
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `server/.env`:

```env
FRONTEND_URL=http://localhost:5173
```

Run FastAPI:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## ☁️ Deployment

Mind Pulse is deployed on **Render** using two services.

### Frontend

**Service:** Static Site

```text
Root Directory: client
Build Command: npm run build
Publish Directory: dist
```

Environment variable:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### Backend

**Service:** Web Service

```text
Root Directory: server
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Environment variable:

```env
FRONTEND_URL=https://your-frontend-url.onrender.com
```

---

## 🔄 SPA Routing

For React client-side routing on Render, add:

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

This allows routes such as `/analysis` to work correctly after refreshing the page.

---

## 🎨 UI

Mind Pulse provides:

- Dark and Light themes
- Responsive layouts
- Modern form controls
- Interactive score visualization
- Animated analysis background
- Theme-aware colors and typography
- Clean and minimal design

---

## ⚠️ Disclaimer

Mind Pulse is intended for educational and informational purposes only.

The generated score is not a medical diagnosis, psychological diagnosis, or clinical assessment and should not replace professional medical advice.

---

## 👨‍💻 Author

**BoGeYmAn04**

GitHub:  
https://github.com/BoGeYmAn04/Mind-Pulse

---

<p align="center">
  Made with ❤️ using React, FastAPI and Machine Learning
</p>
