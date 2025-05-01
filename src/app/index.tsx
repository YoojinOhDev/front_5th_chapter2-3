import { BrowserRouter as Router } from "react-router-dom"
import { PostsManagerPage } from "@/pages/post/ui/PostsManagerPage.tsx"
import React from "react"
import { QueryProvider } from "@/app/providers/QueryProvider.tsx"

const App = () => {
  return (
    <React.StrictMode>
      <Router>
        <QueryProvider>
          <PostsManagerPage />
        </QueryProvider>
      </Router>
    </React.StrictMode>
  )
}

export default App
