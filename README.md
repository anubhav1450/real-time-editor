# Real-Time Collaborative Code Editor

A real-time collaborative code editor built using React, Monaco Editor, Yjs, Socket.io, and Node.js.

This project allows multiple users to join the same room using a room code and collaborate together in real time.

---

# Features

* Real-time collaborative editing
* Room-based collaboration
* Unique room code generation
* Join rooms using room code
* Active users panel
* Monaco code editor integration
* Socket.io based communication
* Yjs CRDT synchronization
* Modern UI using Tailwind CSS

---

# Tech Stack

## Frontend

* React.js
* React Router DOM
* Tailwind CSS
* Monaco Editor
* Yjs
* y-monaco
* y-socket.io
* nanoid

## Backend

* Node.js
* Express.js
* Socket.io
* y-socket.io

---

# Project Structure

```txt
Real-Time-Editor/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── EditorPage.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# How Real-Time Collaboration Works

## 1. Room Creation

When a user creates a room:

* A unique room code is generated using nanoid
* User is redirected to:

```txt
/room/ROOMCODE
```

---

## 2. Joining a Room

Another user enters the same room code.

Both users connect to the same collaborative room.

---

## 3. Socket.io Communication

Socket.io creates a persistent WebSocket connection between:

* frontend
* backend
* all connected users

This enables instant communication.

---

## 4. Yjs Synchronization

Yjs handles collaborative state management.

It synchronizes:

* editor content
* user updates
* shared document state

across all connected clients.

---

## 5. Monaco Binding

`MonacoBinding` connects:

```txt
Monaco Editor ↔ Yjs Document
```

This means:

* when one user types
* Yjs updates
* all connected editors update instantly

---

# Backend Architecture

```txt
Express App
      ↓
HTTP Server
      ↓
Socket.io Server
      ↓
YSocketIO
      ↓
Realtime Synchronization
```

---

# Important Concepts Learned

## WebSockets

Unlike normal HTTP requests:

```txt
Request → Response → Close
```

WebSockets maintain a persistent connection:

```txt
Client ⇄ Server
```

This enables:

* live collaboration
* instant updates
* multiplayer editing

---

## Why HTTP Server is Required

Socket.io works with the actual HTTP server.

Correct setup:

```js
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
```

NOT:

```js
app.listen()
```

because WebSocket upgrades are handled by the HTTP server.

---

## CRDT (Conflict-Free Replicated Data Types)

Yjs uses CRDTs to avoid editing conflicts.

This means multiple users can:

* type simultaneously
* edit together
* stay synchronized

without overwriting each other.

---

# Frontend Flow

## Home Page

Users can:

* enter username
* create a room
* join using room code

---

## Editor Page

Users can:

* collaborate in real time
* see active users
* copy room code
* join another room instantly

---

# Installation

## Clone Repository

```bash
git clone <repo-url>
```

---

# Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```txt
http://localhost:3000
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Required Packages

## Frontend

```bash
npm install react-router-dom nanoid
npm install @monaco-editor/react
npm install yjs y-monaco y-socket.io
```

## Backend

```bash
npm install express socket.io y-socket.io
```

---

# Current Limitations

Currently the editor uses in-memory collaboration.

This means:

* refreshing may reset data
* server restart removes document state

Persistence can later be added using:

* MongoDB
* Redis
* y-indexeddb

---

# Future Improvements

* Persistent document storage
* Authentication
* Private rooms
* Cursor presence
* Docker support
* AWS ECS deployment
* Room permissions
* Syntax selection
* Dark/light themes

---

# Deployment Plan

## Frontend

* Vercel
* Netlify

## Backend

* Render
* Railway
* AWS ECS

---

# What This Project Demonstrates

This project demonstrates understanding of:

* Real-time systems
* WebSockets
* Collaborative applications
* CRDT synchronization
* Full-stack development
* Room-based architecture
* Modern frontend development
* Backend socket communication

---

#
