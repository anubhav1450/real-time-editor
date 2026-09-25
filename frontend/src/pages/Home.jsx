import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { customAlphabet } from "nanoid"
import {
  ROOM_CODE_ALPHABET,
  ROOM_CODE_LENGTH,
  USERNAME_MAX_LENGTH,
  normalizeRoomCode,
  normalizeUsername
} from "../config"


const generateRoomCode = customAlphabet(ROOM_CODE_ALPHABET, ROOM_CODE_LENGTH)

const USERNAME_KEY = "rte:username"

function readSavedUsername() {
  try {
    return localStorage.getItem(USERNAME_KEY) || ""
  } catch {
    return ""
  }
}

function saveUsername(username) {
  try {
    localStorage.setItem(USERNAME_KEY, username)
  } catch {
    // storage can be blocked (private mode); the name just won't be remembered
  }
}


function Home() {

  const [searchParams] = useSearchParams()

  const [username, setUsername] = useState(readSavedUsername)
  const [roomCode, setRoomCode] = useState(
    normalizeRoomCode(searchParams.get("room") || "")
  )
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const goToRoom = (roomId) => {

    const name = normalizeUsername(username)

    if (!name) {
      setError("Please enter a username")
      return
    }

    saveUsername(name)

    navigate(`/room/${roomId}?username=${encodeURIComponent(name)}`)
  }

  const handleCreateRoom = () => {
    goToRoom(generateRoomCode())
  }

  const handleJoinRoom = (e) => {

    e.preventDefault()

    const code = normalizeRoomCode(roomCode)

    if (!code) {
      setError(username.trim() ? "Please enter a room code" : "Please enter a username")
      return
    }

    goToRoom(code)
  }

  return (
    <main className="min-h-screen w-full bg-gray-950 flex items-center justify-center p-4">

      <div className="bg-neutral-900 p-6 sm:p-8 rounded-xl flex flex-col gap-5 w-full max-w-[400px]">

        <div className="text-center">

          <h1 className="text-white text-3xl font-bold">
            Real Time Editor
          </h1>

          <p className="text-neutral-400 text-sm mt-2">
            Write code together, live, with anyone who has your room code.
          </p>

        </div>

        <input
          type="text"
          placeholder="Enter username"
          aria-label="Username"
          maxLength={USERNAME_MAX_LENGTH}
          className="p-3 rounded bg-neutral-800 text-white outline-none focus:ring-2 focus:ring-green-500"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            setError("")
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !roomCode) handleCreateRoom()
          }}
          autoFocus={!username}
        />

        <button
          type="button"
          onClick={handleCreateRoom}
          className="bg-amber-50 hover:bg-white transition-all text-black font-bold p-3 rounded"
        >
          Create New Room
        </button>

        <div className="flex items-center gap-3">

          <div className="h-[1px] bg-gray-700 flex-1"></div>

          <span className="text-gray-400 text-sm">
            OR
          </span>

          <div className="h-[1px] bg-gray-700 flex-1"></div>

        </div>

        <form onSubmit={handleJoinRoom} className="flex flex-col gap-5">

          <input
            type="text"
            placeholder="Enter room code"
            aria-label="Room code"
            maxLength={16}
            className="p-3 rounded bg-neutral-800 text-white outline-none tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal focus:ring-2 focus:ring-green-500"
            value={roomCode}
            onChange={(e) => {
              setRoomCode(normalizeRoomCode(e.target.value))
              setError("")
            }}
            autoFocus={Boolean(username)}
          />

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 transition-all text-white font-bold p-3 rounded"
          >
            Join Room
          </button>

        </form>

        {error && (
          <p role="alert" className="text-red-400 text-sm text-center -mt-1">
            {error}
          </p>
        )}

      </div>

    </main>
  )
}

export default Home
