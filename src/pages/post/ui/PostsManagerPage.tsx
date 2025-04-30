import { PostWidget } from "@/widgets/post"
import { Footer, Header } from "@/widgets"

export const PostsManagerPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <PostWidget />
      </main>
      <Footer />
    </div>
  )
}
