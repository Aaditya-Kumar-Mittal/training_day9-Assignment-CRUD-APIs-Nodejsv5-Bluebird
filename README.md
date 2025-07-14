# 🧠 Node.js v5 CRUD API

![Node.js](https://img.shields.io/badge/Node.js-v5.12.0-green?logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-v4-blue?logo=express&logoColor=white) ![Bluebird](https://img.shields.io/badge/Promises-Bluebird-4B32C3?logo=javascript&logoColor=yellow) ![Middleware](https://img.shields.io/badge/Middleware-Logger-orange) ![License](https://img.shields.io/badge/license-MIT-brightgreen) ![Status](https://img.shields.io/badge/status-Completed-success)

> A lightweight and modular RESTful API built with **Node.js v5**, **Express**, and **Bluebird** supporting full **CRUD operations**, custom logging middleware, and file-based configuration.

---

## 📁 Project Structure

```plaintext

├── app.js                    # Entry point
├── config/
│   └── database.config.js    # DB connection config
├── controllers/
│   └── userController.controller.js
├── docs/                     # Developer notes & deep dives
│   ├── Context and Bind in Promises.md
│   ├── Coroutine and Yield.md
│   ├── Losing Context.md
│   └── yield vs await.md
├── logs/
│   └── server.log            # Logger output
├── middlewares/
│   └── logger.js             # Custom logger middleware
├── routes/
│   └── userRoutes.routes.js
├── package.json
├── package-lock.json
└── README.md

```

---

## 🚀 Features

- 📦 Simple, modular CRUD operations
- 🔁 Bluebird-based Promise and coroutine flow
- 📃 Body-parser for JSON request handling
- 🧾 Custom logger middleware for request tracking
- 📁 Clean file structure
- 🛠️ Documented with helpful developer guides in `/docs`

---

## 🧰 Tech Stack

| Layer         | Tech Used           |
| ------------- | ------------------- |
| Runtime       | Node.js v5.12.0     |
| Web Framework | Express v4          |
| Promises      | Bluebird            |
| Middleware    | body-parser, logger |
| Dev Docs      | Markdown            |

---

## ⚙️ Installation

### Prerequisites

- Node.js v5.12.0 (via [`nvm`](https://github.com/coreybutler/nvm-windows))
- npm v3+

### Install Dependencies

```bash
npm install
```

---

## 📡 API Endpoints

| Method | Endpoint     | Description       |
| ------ | ------------ | ----------------- |
| GET    | `/users`     | Get all users     |
| GET    | `/users/:id` | Get user by ID    |
| POST   | `/users`     | Create new user   |
| PUT    | `/users/:id` | Update user by ID |
| DELETE | `/users/:id` | Delete user by ID |

> All endpoints are JSON-based.

---

## 📝 Logger Middleware

A custom logger is used to write all incoming requests to `logs/server.log`.

- ✅ Method, URL, timestamp are logged
- ✅ Easily extendable
- ✅ Keeps your terminal clean

---

## 🔄 Usage

### Start the Server

```bash
node app.js
```

Or using PM2:

```bash
pm2 start app.js --name node-crud-api
```

---

## 📚 Developer Notes

Helpful documentation files inside the `docs/` folder:

- 🧵 `Context and Bind in Promises.md`
- 🔄 `Coroutine and Yield.md`
- 🤔 `Losing Context.md`
- ⚖️ `yield vs await.md`

---

## 🪪 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Aaditya Kumar Mittal**
📧 [LinkedIn](https://www.linkedin.com/in/aaditya-kumar-mittal/)
