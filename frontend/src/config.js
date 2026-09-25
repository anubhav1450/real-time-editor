export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL?.replace(/\/$/, "") || "http://localhost:3000"

export const ROOM_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
export const ROOM_CODE_LENGTH = 6

export const USERNAME_MAX_LENGTH = 20

export const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "c", label: "C" },
  { id: "csharp", label: "C#" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "json", label: "JSON" },
  { id: "markdown", label: "Markdown" },
  { id: "sql", label: "SQL" },
  { id: "plaintext", label: "Plain Text" },
]

export const USER_COLORS = [
  "#4ade80", "#60a5fa", "#f472b6", "#facc15",
  "#a78bfa", "#fb923c", "#2dd4bf", "#f87171",
]

export function normalizeRoomCode(value) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "")
}

export function normalizeUsername(value) {
  return value.trim().slice(0, USERNAME_MAX_LENGTH)
}
