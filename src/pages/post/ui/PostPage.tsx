import { Post } from "@/widgets/post"
import { Footer, Header } from "@/widgets"

export const PostPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Post />
      </main>
      <Footer />
    </div>
  )
}
