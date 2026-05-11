# Frontend Notes

This frontend is responsible for handling the collaborative editor UI, room navigation, and realtime synchronization using Yjs.

---

## Tech Stack

- React.js
- React Router DOM
- Tailwind CSS
- Monaco Editor
- Yjs
- y-monaco
- y-socket.io
- nanoid

---

## Frontend Architecture

```txt
Home Page
    ↓
Create / Join Room
    ↓
Room Navigation
    ↓
Collaborative Editor
    ↓
Realtime Synchronization
```

---

## Room System

Each room has a unique room code.

Example:

```txt
/room/A7X91B
```

Users entering the same room code join the same collaborative editor session.

---

## How Realtime Sync Works

### 1. Yjs Document

```js
const ydoc = new Y.Doc()
```

This creates a shared collaborative document.

---

### 2. Socket Connection

```js
new SocketIOProvider(...)
```

This connects users to the websocket server.

---

### 3. Monaco Binding

```js
new MonacoBinding(...)
```

This binds Monaco Editor with the Yjs document.

Result:
- edits sync instantly
- all users stay updated in real time

---

## Features Implemented

- Create room
- Join room using room code
- Copy room code
- Active users panel
- Join another room instantly
- Realtime collaborative editing

---

## UI Notes

Tailwind CSS is used for styling.

The layout follows a desktop-first editor design:
- left sidebar
- right collaborative editor

---

## Run Frontend

```bash
npm install
npm run dev
```

Runs on:

```txt
http://localhost:5173
```