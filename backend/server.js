import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import { YSocketIO } from "y-socket.io/dist/server"


const PORT = process.env.PORT || 3000

// Comma separated list of allowed frontend origins, e.g.
// CLIENT_ORIGIN=https://my-editor.vercel.app,http://localhost:5173
// Leave it empty to allow every origin.
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map(origin => origin.trim().replace(/\/$/, ""))
    .filter(Boolean)


const app = express()

const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins.length ? allowedOrigins : "*",
        methods: [ "GET", "POST" ]
    }
})


const ySocketIO = new YSocketIO(io, {
    gcEnabled: true
})
ySocketIO.initialize()


app.get("/", (req, res) => {
    res.status(200).json({
        message: "Real Time Editor server is running",
        success: true
    })
})

app.get("/health", (req, res) => {
    res.status(200).json({
        message: "ok",
        success: true,
        rooms: ySocketIO.documents.size,
        uptime: Math.round(process.uptime())
    })
})


httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


function shutdown() {
    io.close()
    httpServer.close(() => process.exit(0))
}

process.on("SIGTERM", shutdown)
process.on("SIGINT", shutdown)
