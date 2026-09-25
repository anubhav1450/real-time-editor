# Real-Time Collaborative Editor

A real-time collaborative editor built using React, Monaco Editor, Yjs, Socket.io, and Node.js.

Users can create or join rooms using unique room codes and collaborate together in real time.

---
## Screenshots

### Home Page

![Home Page](./screenshots/RTE1.png)

---

### Collaborative Editor

![Collaborative Editor](./screenshots/RTE2.png)

---

### Collapsed Sidebar View

![Collapsed Sidebar](./screenshots/RTE3.png)

---

## Features

- Real-time collaboration
- Room based editing
- Unique room codes and shareable invite links
- Active users panel
- Live colored cursors with name tags
- Language picker synced across the room
- Connection status indicator
- Monaco editor integration
- Yjs synchronization
- Modern UI with Tailwind CSS

---

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Tailwind CSS
- Monaco Editor
- Yjs
- nanoid

### Backend
- Node.js
- Express.js
- Socket.io
- y-socket.io

---

## Project Structure

```txt
Real-Time-Editor/
│
├── backend/
│   ├── README.md
│   └── server.js
│
├── frontend/
│   ├── README.md
│   ├── vercel.json
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── config.js
│       ├── lib/
│       └── pages/
│
├── testing/
│   └── multi-user-test.js
│
├── render.yaml
└── README.md
```

---

## Local Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Multi-user test

With both running:

```bash
cd testing
npm install
CHANNEL=chrome USERS=5 npm test
```

---

## Deployment

The app is split in two because the backend needs a server that stays running.

| Part     | Host                              | Why |
| -------- | --------------------------------- | --- |
| Frontend | Vercel                            | Static Vite build |
| Backend  | Render / Railway / Fly.io         | Needs long-lived WebSocket connections, which Vercel's serverless functions don't support |

1. **Backend on Render** – New → Blueprint → pick this repo. `render.yaml` sets everything up.
   Copy the service URL (e.g. `https://real-time-editor-server.onrender.com`).
2. **Frontend on Vercel** – import the repo, set the root directory to `frontend`,
   and add the environment variable `VITE_SERVER_URL` = the backend URL. Redeploy.
3. Optionally set `CLIENT_ORIGIN` on the backend to your Vercel URL to restrict CORS.

---

## Notes

Detailed implementation notes are available inside:

- `frontend/README.md`
- `backend/README.md`

---

## Future Improvements

- Persistence
- Authentication
- Docker deployment
- Private rooms

---

## Author

Anubhav Kulshreshtha
