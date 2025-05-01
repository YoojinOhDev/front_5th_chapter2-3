import { useAtom } from "jotai"
import { Comment } from "@/entities/post/model/types.ts"
import { commentsState } from "@/entities/post/model/atoms"

export const useComments = () => {
  const [comments, setComments] = useAtom(commentsState)

  const addComment = (postId: number, comment: Comment) => {
    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment],
    }))
  }

  const removeComment = (postId: number, commentId: number) => {
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId]?.filter((comment) => comment.id !== commentId) || [],
    }))
  }

  return { comments, setComments, addComment, removeComment }
}
