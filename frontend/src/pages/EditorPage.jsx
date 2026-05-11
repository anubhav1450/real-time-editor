import { Editor } from "@monaco-editor/react"
import { MonacoBinding } from "y-monaco"
import { useRef, useMemo, useState, useEffect } from "react"
import * as Y from "yjs"
import { SocketIOProvider } from "y-socket.io"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"

function EditorPage() {

  const editorRef = useRef(null)

  const [users, setUsers] = useState([])
  const [copied, setCopied] = useState(false)
  const [newRoomCode, setNewRoomCode] = useState("")

  const { roomId } = useParams()

  const [searchParams] = useSearchParams()

  const navigate = useNavigate()

  const username = searchParams.get("username")

  useEffect(() => {
    if (!username) {
      navigate("/")
    }
  }, [username])

  const ydoc = useMemo(() => new Y.Doc(), [])

  const yText = useMemo(() => {
    return ydoc.getText(roomId)
  }, [ydoc, roomId])

  const handleMount = (editor) => {

    editorRef.current = editor

    new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
    )
  }

  useEffect(() => {

    if (username) {

      const provider = new SocketIOProvider(
        "http://localhost:3000",
        roomId,
        ydoc,
        {
          autoConnect: true,
        }
      )

      provider.awareness.setLocalStateField("user", { username })

      const updateUsers = () => {

        const states = Array.from(
          provider.awareness.getStates().values()
        )

        setUsers(
          states
            .filter(state => state.user && state.user.username)
            .map(state => state.user)
        )
      }

      updateUsers()

      provider.awareness.on("change", updateUsers)

      function handleBeforeUnload() {
        provider.awareness.setLocalStateField("user", null)
      }

      window.addEventListener("beforeunload", handleBeforeUnload)

      return () => {
        provider.disconnect()
        window.removeEventListener("beforeunload", handleBeforeUnload)
      }
    }

  }, [username, roomId])

  const handleCopyCode = async () => {

    await navigator.clipboard.writeText(roomId)

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const handleJoinAnotherRoom = () => {

    if (!newRoomCode.trim()) return

    navigate(`/room/${newRoomCode}?username=${username}`)
  }

  return (
   <main className="h-screen w-full bg-[#0f0f0f] flex gap-4 p-4 overflow-hidden">

      <aside className="w-[320px] min-w-[320px] bg-neutral-900 rounded-2xl border border-neutral-800 flex flex-col overflow-hidden">

        <div className="p-5 border-b border-neutral-800">

          <h1 className="text-2xl font-bold text-white">
            Real Time Editor
          </h1>

          <p className="text-neutral-400 text-sm mt-2">
            Share this room code with your friends
          </p>

          <div className="mt-5 bg-black border border-neutral-700 rounded-xl p-4">

            <p className="text-neutral-400 text-xs mb-2">
              ROOM CODE
            </p>

            <div className="text-center mb-4">

              <span className="text-2xl font-bold tracking-[6px] text-green-400 break-all">
                {roomId}
              </span>

            </div>

            <div className="flex flex-col gap-3">

              <button
                onClick={handleCopyCode}
                className="w-full bg-green-500 hover:bg-green-600 transition-all text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                {copied ? "Copied!" : "Copy Code"}
              </button>

              <div className="flex flex-col gap-2">

                <input
                  type="text"
                  placeholder="Enter Room Code"
                  value={newRoomCode}
                  onChange={(e) => setNewRoomCode(e.target.value.toUpperCase())}
                  className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-2 rounded-lg outline-none"
                />

                <button
                  onClick={handleJoinAnotherRoom}
                  className="w-full bg-red-500 hover:bg-red-600 transition-all text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Join Room
                </button>

              </div>

            </div>

          </div>

        </div>

        <div className="p-5 flex-1 overflow-y-auto">

          <h2 className="text-lg font-semibold text-white mb-4">
            Active Users
          </h2>

          <ul className="space-y-3">

            {users.map((user, index) => (
              <li
                key={index}
                className="bg-neutral-800 border border-neutral-700 text-white p-3 rounded-xl flex items-center gap-3"
              >

                <div className="w-3 h-3 rounded-full bg-green-400"></div>

                <span className="font-medium break-all">
                  {user.username}
                </span>

              </li>
            ))}

          </ul>

        </div>

      </aside>

      <section className="flex-1 min-h-[500px] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">

        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// Start collaborating..."
          theme="vs-dark"
          onMount={handleMount}
        />

      </section>

    </main>
  )
}

export default EditorPage