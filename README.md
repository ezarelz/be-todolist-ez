## Todolist Backend with Swagger

---

# 🧩 Todo API (In-Memory)

A simple and lightweight **Express.js REST API** for managing todos with user authentication — built using **JWT**, **Swagger UI**, and **in-memory data** (no external database required).

---

## 🚀 Features

- 🔐 **User authentication** (Register & Login)
- 🔑 **JWT-based authorization**
- 🧠 **In-memory data storage** (no database needed)
- 🗂️ CRUD operations for Todos
- ⚙️ Filters & Pagination
- 🧾 Interactive API documentation (Swagger)
- 🔁 Auto-reload with Nodemon in development
- 🌍 Ready for Railway deployment

---

## ⚙️ Installation & Setup

### 1️⃣ Clone this repository

```bash
git clone https://github.com/ezarelz/be-todolist-ez.git
cd todo-api-be
```

````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Start the server

For development (auto-reload with `nodemon`):

```bash
npm run dev
```

For production:

```bash
npm start
```

Server runs on **[http://localhost:3001](http://localhost:3001)**

---

## 📘 API Documentation (Swagger)

Access the interactive API documentation here:

👉 **Local:** [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
👉 **Production (Railway):** `https://yourproject.up.railway.app/api-docs`

---

## 🧰 Environment Variables

Create a `.env` file (or configure Railway Variables):

| Variable                | Description                        | Example                      |
| ----------------------- | ---------------------------------- | ---------------------------- |
| `PORT`                  | Server port                        | `3001`                       |
| `JWT_SECRET`            | Secret key for token signing       | `your_secret_key`            |
| `RAILWAY_PUBLIC_DOMAIN` | Railway public domain (auto-added) | `yourproject.up.railway.app` |

---

## 👤 Authentication Endpoints

All authentication-related routes are **public**.

### 🔸 Register User

```
POST /auth/register
```

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### 🔸 Login User

```
POST /auth/login
```

**Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "JWT_TOKEN_HERE"
}
```

---

## ✅ Todos Endpoints

> ⚠️ All todo routes require **Authorization header** > `Authorization: Bearer <token>`

### ➕ Create Todo

```
POST /todos
```

**Body:**

```json
{
  "task": "Finish React Project",
  "priority": "high",
  "date": "2025-11-01"
}
```

### 📋 Get All Todos

```
GET /todos
```

### ✅ Get Completed Todos

```
GET /todos/completed
```

### 🌀 Mark Todo as Complete / Incomplete

```
PATCH /todos/{id}/complete
```

**Body (optional):**

```json
{ "completed": true }
```

### 📝 Update Todo

```
PUT /todos/{id}
```

**Body:**

```json
{
  "task": "Update UI design",
  "priority": "medium",
  "date": "2025-11-05"
}
```

### ❌ Delete Todo

```
DELETE /todos/{id}
```

---

## 💡 Usage Example

### 1️⃣ Login with a user

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### 2️⃣ Create a Todo

```bash
curl -X POST http://localhost:3001/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"task":"Write documentation","priority":"high","date":"2025-11-01"}'
```

### 3️⃣ Mark Todo as Completed

```bash
curl -X PATCH http://localhost:3001/todos/<todo_id>/complete \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🧩 Sample Initial Data

The API starts with **sample users and todos** for testing.

### 👥 Sample Users

| Email                                             | Password    |
| ------------------------------------------------- | ----------- |
| [john@example.com](mailto:john@example.com)       | password123 |
| [jane@example.com](mailto:jane@example.com)       | password123 |
| [bob@example.com](mailto:bob@example.com)         | password123 |
| [alice@example.com](mailto:alice@example.com)     | password123 |
| [charlie@example.com](mailto:charlie@example.com) | password123 |

> 🧠 Use any of these to login quickly and test the API.

---

## ⚠️ Notes

- 🧠 Data is stored **in memory** — it resets whenever the server restarts.
- 🔒 JWT tokens expire in **24 hours**.
- 🔑 Passwords are hashed using **bcrypt**.
- 📅 All dates must follow `YYYY-MM-DD` format.

---

## 🌐 Deployment (Railway)

1. Push project to GitHub:

   ```bash
   git add .
   git commit -m "Initial deploy to Railway"
   git push origin main
   ```

2. Go to [https://railway.app](https://railway.app)
3. Create new project → **Deploy from GitHub Repo**
4. Set environment variables (`JWT_SECRET`, optional `PORT`)
5. Wait for build & deploy to finish 🎉

Your live API:

```
https://<yourproject>.up.railway.app/
```

## ❤️ Acknowledgements

Built with:

- [Express.js](https://expressjs.com/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Railway](https://railway.app/)
- [JWT](https://jwt.io/)

---

---

## 🧾 License

MIT © 2025 [Ezarelz](https://github.com/ezarelz)

---
````
