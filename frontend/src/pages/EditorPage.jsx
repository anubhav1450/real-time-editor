import "../lib/monaco"
import { Editor } from "@monaco-editor/react"
import { MonacoBinding } from "y-monaco"
import { useState, useEffect, useMemo } from "react"
import * as Y from "yjs"
import { SocketIOProvider } from "y-socket.io"
import {
  useParams,
  useSearchParams,
  useNavigate
} from "react-router-dom"
import {
  SERVER_URL,
  LANGUAGES,
  USER_COLORS,
  normalizeRoomCode,
  normalizeUsername
} from "../config"


const STATUS_STYLES = {
  connected: { dot: "bg-green-400", label: "Live" },
  connecting: { dot: "bg-yellow-400 animate-pulse", label: "Connecting…" },
  disconnected: { dot: "bg-red-500", label: "Offline" },
}

// Label shown next to a remote cursor. Keep it CSS-string safe.
function cssLabel(text) {
  return text.replace(/["\\\n\r]/g, "")
}

function pickColor(clientId) {
  return USER_COLORS[clientId % USER_COLORS.length]
}

// Colors come from other clients, so only trust plain hex values.
function safeColor(color, clientId) {
  return /^#[0-9a-f]{6}$/i.test(color) ? color : pickColor(clientId)
}


function EditorPage() {

  const [editor, setEditor] = useState(null)
  const [session, setSession] = useState(null)
  const [status, setStatus] = useState("connecting")
  const [synced, setSynced] = useState(false)
  const [slowConnect, setSlowConnect] = useState(false)
  const [users, setUsers] = useState([])
  const [language, setLanguage] = useState("javascript")
  const [copied, setCopied] = useState("")
  const [newRoomCode, setNewRoomCode] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= 768
  )

  const params = useParams()
  const roomId = normalizeRoomCode(params.roomId || "")

  const [searchParams] = useSearchParams()

  const navigate = useNavigate()

  const username = normalizeUsername(searchParams.get("username") || "")

  useEffect(() => {
    if (!username) {
      // Someone opened an invite link: ask for a name, keep the room code.
      navigate(`/?room=${roomId}`, { replace: true })
    }
  }, [username, roomId, navigate])


  // One Yjs document + socket connection per room.
  useEffect(() => {

    if (!username || !roomId) return

    const doc = new Y.Doc()

    const provider = new SocketIOProvider(
      SERVER_URL,
      roomId,
      doc,
      { autoConnect: true }
    )

    provider.awareness.setLocalStateField("user", {
      username,
      color: pickColor(doc.clientID)
    })

    const updateUsers = () => {
      const list = []
      provider.awareness.getStates().forEach((state, clientId) => {
        if (state.user?.username) {
          list.push({
            clientId,
            username: normalizeUsername(String(state.user.username)),
            color: safeColor(state.user.color, clientId),
            isSelf: clientId === doc.clientID
          })
        }
      })
      list.sort((a, b) => Number(b.isSelf) - Number(a.isSelf))
      setUsers(list)
    }

    const settings = doc.getMap("settings")

    const updateLanguage = () => {
      setLanguage(settings.get("language") || "javascript")
    }

    const handleStatus = ({ status }) => setStatus(status)
    const handleSync = (isSynced) => setSynced(isSynced)

    provider.on("status", handleStatus)
    provider.on("sync", handleSync)
    provider.awareness.on("change", updateUsers)
    settings.observe(updateLanguage)

    const slowTimer = setTimeout(() => setSlowConnect(true), 4000)

    setStatus(provider.socket.connected ? "connected" : "connecting")
    setSynced(false)
    setSlowConnect(false)
    updateUsers()
    updateLanguage()
    setSession({ doc, provider })

    return () => {
      clearTimeout(slowTimer)
      settings.unobserve(updateLanguage)
      provider.awareness.off("change", updateUsers)
      provider.off("status", handleStatus)
      provider.off("sync", handleSync)
      provider.destroy()
      doc.destroy()
      setSession(null)
    }

  }, [username, roomId])


  // Bind Monaco to the shared text once both exist.
  useEffect(() => {

    if (!editor || !session) return

    const binding = new MonacoBinding(
      session.doc.getText("content"),
      editor.getModel(),
      new Set([ editor ]),
      session.provider.awareness
    )

    return () => binding.destroy()

  }, [editor, session])


  // Colored cursors + name tags for everyone else in the room.
  const cursorStyles = useMemo(() => {
    return users
      .filter(user => !user.isSelf)
      .map(({ clientId, color, username }) => `
        .yRemoteSelection-${clientId} { background-color: ${color}40; }
        .yRemoteSelectionHead-${clientId} {
          position: absolute;
          border-left: 2px solid ${color};
          height: 100%;
        }
        .yRemoteSelectionHead-${clientId}::after {
          content: "${cssLabel(username)}";
          position: absolute;
          top: -1.4em;
          left: -2px;
          padding: 0 4px;
          font-size: 11px;
          line-height: 1.4em;
          white-space: nowrap;
          border-radius: 3px 3px 3px 0;
          color: #0f0f0f;
          background: ${color};
          pointer-events: none;
          z-index: 10;
        }
      `)
      .join("\n")
  }, [users])


  const copyText = async (text, which) => {

    try {
      await navigator.clipboard.writeText(text)
    } catch {
      window.prompt("Copy this:", text)
      return
    }

    setCopied(which)

    setTimeout(() => {
      setCopied("")
    }, 2000)
  }

  const handleCopyCode = () => copyText(roomId, "code")

  const handleCopyLink = () =>
    copyText(`${window.location.origin}/room/${roomId}`, "link")

  const handleLanguageChange = (e) => {
    session?.doc.getMap("settings").set("language", e.target.value)
  }

  const handleJoinAnotherRoom = (e) => {

    e.preventDefault()

    const code = normalizeRoomCode(newRoomCode)

    if (!code || code === roomId) return

    setNewRoomCode("")

    navigate(`/room/${code}?username=${encodeURIComponent(username)}`)
  }

  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.connecting

  const showConnectionHint = status !== "connected" && slowConnect

  if (!username) return null

  return (

    <main className="h-screen w-full bg-[#0f0f0f] flex gap-2 sm:gap-4 p-2 sm:p-4 overflow-hidden">

      <style>{cursorStyles}</style>

      <aside
        className={`
          ${sidebarOpen ? "w-[260px] min-w-[260px]" : "w-[60px] min-w-[60px] sm:w-[70px] sm:min-w-[70px]"}
          bg-neutral-900 rounded-2xl border border-neutral-800
          flex flex-col overflow-hidden transition-all duration-300
        `}
      >

        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">

          {sidebarOpen && (
            <button
              onClick={() => navigate("/")}
              className="text-lg font-bold text-white hover:text-green-400 transition-all"
              title="Back to home"
            >
              Editor
            </button>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:text-green-400 transition-all mx-auto sm:mx-0"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            ☰
          </button>

        </div>

        {sidebarOpen && (

          <div className="p-5 border-b border-neutral-800">

            <p className="text-neutral-400 text-sm">
              Share this room code
            </p>

            <div className="mt-3 bg-black border border-neutral-700 rounded-xl p-2.5">

              <p className="text-neutral-400 text-xs mb-2">
                ROOM CODE
              </p>

              <div className="text-center mb-3">

                <span className="text-lg font-bold tracking-[4px] text-green-400 break-all">
                  {roomId}
                </span>

              </div>

              <div className="flex flex-col gap-2">

                <div className="flex gap-2">

                  <button
                    onClick={handleCopyCode}
                    className="flex-1 whitespace-nowrap bg-green-500 hover:bg-green-600 transition-all text-white px-2 py-2 rounded-lg text-sm font-semibold"
                  >
                    {copied === "code" ? "Copied!" : "Copy Code"}
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="flex-1 whitespace-nowrap bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-all text-white px-2 py-2 rounded-lg text-sm font-semibold"
                  >
                    {copied === "link" ? "Copied!" : "Copy Link"}
                  </button>

                </div>

                <form onSubmit={handleJoinAnotherRoom} className="flex flex-col gap-1.5">

                  <input
                    type="text"
                    placeholder="Enter Room Code"
                    aria-label="Room code to join"
                    maxLength={16}
                    value={newRoomCode}
                    onChange={(e) =>
                      setNewRoomCode(normalizeRoomCode(e.target.value))
                    }
                    className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-2 rounded-lg outline-none focus:border-green-500"
                  />

                  <button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600 transition-all text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    Join Room
                  </button>

                </form>

              </div>

            </div>

          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3">

          {sidebarOpen ? (

            <>
              <h2 className="text-lg font-semibold text-white mb-4">
                Active Users
                <span className="text-neutral-500 text-sm font-normal ml-2">
                  {users.length}
                </span>
              </h2>

              <ul className="space-y-3">

                {users.map((user) => (
                  <li
                    key={user.clientId}
                    className="bg-neutral-800 border border-neutral-700 text-white p-3 rounded-xl flex items-center gap-3"
                  >

                    <div
                      className="w-3 h-3 min-w-3 rounded-full"
                      style={{ backgroundColor: user.color }}
                    ></div>

                    <span className="font-medium break-all">
                      {user.username}
                    </span>

                    {user.isSelf && (
                      <span className="ml-auto text-xs text-neutral-400">
                        you
                      </span>
                    )}

                  </li>
                ))}

              </ul>
            </>

          ) : (

            <div className="flex flex-col items-center gap-3 mt-2">

              {users.map((user) => (
                <div
                  key={user.clientId}
                  title={user.username}
                  className="w-9 h-9 rounded-full text-black flex items-center justify-center font-bold"
                  style={{ backgroundColor: user.color }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
              ))}

            </div>

          )}

        </div>

      </aside>

      <section className="flex-1 min-w-0 min-h-[300px] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col">

        <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-neutral-800">

          <select
            value={language}
            onChange={handleLanguageChange}
            aria-label="Language"
            className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-2 py-1 outline-none focus:border-green-500"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 text-sm text-neutral-300" title={SERVER_URL}>
            <span className={`w-2.5 h-2.5 rounded-full ${statusStyle.dot}`}></span>
            {status === "connected" && !synced ? "Syncing…" : statusStyle.label}
          </div>

        </div>

        {showConnectionHint && (
          <div className="px-4 py-2 text-sm bg-yellow-500/10 text-yellow-300 border-b border-yellow-500/20">
            Can't reach the collaboration server yet. If it was idle it may take
            up to a minute to wake up — your edits will sync once it connects.
          </div>
        )}

        <div className="flex-1 min-h-0">

          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            onMount={setEditor}
            loading={<div className="text-neutral-400 text-sm">Loading editor…</div>}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 18 },
            }}
          />

        </div>

      </section>

    </main>
  )
}

export default EditorPage
