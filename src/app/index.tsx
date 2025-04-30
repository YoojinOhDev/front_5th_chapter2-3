import { BrowserRouter as Router } from "react-router-dom"
import {PostsManagerPage} from "@/pages/post/ui/PostsManagerPage.tsx"
import React from "react"

const App = () => {
  return (
    <React.StrictMode>
      <Router>
        <PostsManagerPage />
      </Router>
    </React.StrictMode>
  )
}

export default App
