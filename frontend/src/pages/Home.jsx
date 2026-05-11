import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { nanoid,customAlphabet } from "nanoid"


function Home() {

  const [username, setUsername] = useState("")
  const [roomCode, setRoomCode] = useState("")

  const navigate = useNavigate()
  const generateRoomCode = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  6
)

  const handleCreateRoom = () => {

    if (!username.trim()) {
      alert("Please enter username")
      return
    }

    const roomId = generateRoomCode()

    navigate(`/room/${roomId}?username=${username}`)
  }

  const handleJoinRoom = () => {

    if (!username.trim()) {
      alert("Please enter username")
      return
    }

    if (!roomCode.trim()) {
      alert("Please enter room code")
      return
    }

    navigate(`/room/${roomCode}?username=${username}`)
  }

  return (
    <main className="h-screen w-full bg-gray-950 flex items-center justify-center p-4">

      <div className="bg-neutral-900 p-8 rounded-xl flex flex-col gap-5 w-[400px]">

        <h1 className="text-white text-3xl font-bold text-center">
          Real Time Editor
        </h1>

        <input
          type="text"
          placeholder="Enter username"
          className="p-3 rounded bg-neutral-800 text-white outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          type="button"
          onClick={handleCreateRoom}
          className="bg-amber-50 text-black font-bold p-3 rounded"
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

        <input
          type="text"
          placeholder="Enter room code"
          className="p-3 rounded bg-neutral-800 text-white outline-none"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />

        <button
          type="button"
          onClick={handleJoinRoom}
          className="bg-green-500 text-white font-bold p-3 rounded"
        >
          Join Room
        </button>

      </div>

    </main>
  )
}

export default Home