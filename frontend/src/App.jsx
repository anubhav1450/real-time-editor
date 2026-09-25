import "./App.css"
import { lazy, Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"

// Monaco is large; only load it once someone actually opens a room.
const EditorPage = lazy(() => import("./pages/EditorPage"))

function Loading() {
  return (
    <main className="h-screen w-full bg-[#0f0f0f] flex items-center justify-center text-neutral-400">
      Loading editor…
    </main>
  )
}

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<EditorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
