# College Website Management System

A full-stack College Website Management System developed using React, TypeScript, Node.js, Express, and MongoDB. The system provides an online platform for managing college information, courses, faculty, notices, admissions, galleries, and user authentication through an administrative dashboard.

---

## Technologies Used

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

---

## Features

- Admin Authentication
- Admin Dashboard
- Teacher Management
- Student Registration
- Course Management
- Department Management
- Notice Management
- Gallery Management
- Admission Management
- Site Settings Management
- Responsive User Interface

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd college-website
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the **backend** folder:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
CLIENT_URL=http://localhost:5173
COOKIE_SECURE=false
```

Run the backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the **frontend** folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

---

## Project Structure

```
college-website/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── src/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── ...
│
└── README.md
```

---

## Login

Create an administrator account using the backend startup seed or insert an admin user directly into MongoDB before logging in.

---

## Notes

- MongoDB must be running locally or connected through MongoDB Atlas.
- The repository contains only the application source code. Database contents are not included.

---

## Author

**Ikita Shrestha**

Bachelor of Computer Applications (BCA)
