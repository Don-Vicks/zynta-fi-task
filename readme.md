# Zynta-Fi Referral System

**Zynta-Fi** is a full-stack web application that enables users to register, join a referral network, and earn points by inviting others. It includes a clean, responsive frontend, an Express.js backend, and an in-memory data store for demonstration.

> 🔧 This project uses a **monorepo structure**, with separate folders for the backend and frontend.

---

## ✨ Features

- User registration with name, email, and optional referral code  
- Automatic generation of a unique 6-digit referral code  
- Referral system: earn points for each successful referral  
- Real-time community stats (total users, referrals, and points)  
- View all registered community members  
- Responsive and modern UI with modal registration and sharing options  

---

## 📁 Project Structure

```
zynta-fi-task/
├── backend/     # Express.js backend (API)
└── frontend/    # Plain HTML, CSS, and JavaScript frontend
```

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Don-Vicks/zynta-fi-task.git
cd zynta-fi-task
```

---

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

This will start the backend server at http://localhost:3000

---

### 3. Frontend Setup

```bash
cd ../frontend
```

- Open `index.html` directly in your browser
- or
- Use a local server (e.g., Live Server in VSCode)

---

## ⚠️ API URL Configuration

By default, the frontend is configured to use the deployed API:

```javascript
this.apiBaseUrl = 'https://zynta-fi-task.onrender.com/api';
```

If you're running the backend locally (or on another host), you must update the API base URL in the following file:

`frontend/assets/js/index.js`

Change the line:

```javascript
this.apiBaseUrl = 'https://zynta-fi-task.onrender.com/api';
```

To your own backend URL, for example:

```javascript
this.apiBaseUrl = 'http://localhost:3000/api';
```

---

## 🛠 Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Storage**: In-memory (non-persistent)
