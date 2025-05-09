import { PostContent } from "@/entities/post"
import { Button } from "@/shared/ui"
import { Trash2 } from "lucide-react"
import { useAtom } from "jotai"
import { postsState } from "@/entities/post/model/atoms.ts"

const deletePostAPI = async (id: number): Promise<void> => {
  await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  })
}
interface Props {
  postId: PostContent["id"]
}

export const PostDeleteButtonAndDialog = ({ postId }: Props) => {
  const [posts, setPosts] = useAtom(postsState)

  const deletePost = async (id: number) => {
    try {
      await deletePostAPI(id)
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }
  return (
    <Button variant="ghost" size="sm" onClick={() => deletePost(postId)}>
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
