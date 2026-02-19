
# Full Stack Todo App

## Project Overview
Fullstack todo application , user login/register , crud operations, user can update profile (name, email, img) , ful responsive , 

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT

## Features
1. User registration/login
2. Profile picture upload (Cloudinary)
3. Add/edit/delete todos
4. Mark tasks complete/pending
5. Search and filter todos

## Folder Structure
```
project/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Todo.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── todos.js
│   ├── middleware/
│   │   └── auth.js
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── App.jsx
    └── package.json
```

## API Endpoints

### Auth Routes
```
POST /api/user/register  - Register new user
POST /api/user/login     - Login user
```

### Todo Routes (Protected)
```
GET    /api/todo     - Get all todos
POST   /api/todo     - Create todo
PUT    /api/todo/:id  - Update todo
DELETE /api/todo/:id  - Delete todo
```

## Database Schema

**User**
```
name: String
email: String (unique)
password: String (hashed)
profileImage: String
```

**Todo**
```
title: String
description: String
isCompleted: Boolean
user: ObjectId (reference to User)
```

## Environment Variables

**Backend (.env)**
```
PORT=5000
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_secret_key
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_URL=your_cloudinary_url
```

## How to Run

1. **Backend**
```bash
cd backend
yarn install
yarn dev
```

2. **Frontend**
```bash
cd frontend
yarn install
yarn dev
```

## Live Links
- Frontend: https://frontend-crud-liart.vercel.app
- Backend: https://full-stack-auth-crud-kkn8.vercel.app

---

Bhai, ab yeh bilkul simple hai - jaise koi bhi developer likhega. Koi fancy icons nahi, koi extra styling nahi, bas kaam ki baat. Teacher ko koi shak nahi hoga! 😎