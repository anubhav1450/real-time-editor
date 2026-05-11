# Backend Notes

This backend is responsible for handling real-time communication between all connected users using Socket.io and Yjs.

---

## Tech Stack

- Node.js
- Express.js
- Socket.io
- y-socket.io

---

## Backend Architecture

```txt
Express App
    ↓
HTTP Server
    ↓
Socket.io Server
    ↓
YSocketIO
    ↓
Realtime Collaboration
```

---

## Important Concepts

### Why `createServer()` is used

Socket.io works on top of the actual HTTP server.

```js
const app = express()
const httpServer = createServer(app)
```

This allows Socket.io to handle WebSocket connections properly.

---

### Why `httpServer.listen()` is used instead of `app.listen()`

Socket.io is attached to the HTTP server.

So the correct setup is:

```js
httpServer.listen(3000)
```

NOT:

```js
app.listen(3000)
```

---

## Real-Time Flow

```txt
User A types
    ↓
Socket.io emits update
    ↓
Yjs syncs document
    ↓
All connected users receive update instantly
```

---

## Room Based Collaboration

Each room has a unique room code.

Example:

```txt
/room/A7X91B
```

Users joining the same room code collaborate on the same document.

---

## Current Limitation

Currently document state is stored in memory.

This means:
- refreshing may reset data
- server restart removes document state

Persistence can later be added using:
- MongoDB
- Redis
- y-indexeddb

---

## Run Backend

```bash
npm install
npm run dev
```

Runs on:

```txt
http://localhost:3000
```