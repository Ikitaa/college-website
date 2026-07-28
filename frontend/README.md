# College Website Management System

A full-stack College Website Management System built using React, TypeScript, Node.js, Express, and MongoDB.

## Technologies

Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication

## Installation

### Clone repository

```bash
git clone <repository-url>
cd college-website
```

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET
CLIENT_URL=http://localhost:5173
COOKIE_SECURE=false
```

Run backend:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

## Features

- Admin Dashboard
- Teacher Management
- Student Registration
- Course Management
- Notices
- Gallery
- Admissions
- Authentication
- Responsive Design

## Login

Create an admin account using the backend seed or insert one into MongoDB.

## Author

Ikita Shrestha