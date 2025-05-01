import { useState } from "react"
import { Comment, Comments } from "@/entities/post/model/types.ts"

export const useComments = () => {
  const [comments, setComments] = useState<Comments>({})

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
