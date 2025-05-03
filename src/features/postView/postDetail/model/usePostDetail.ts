import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { PostContent, Comment } from "@/entities/post"
import { commentsState } from "@/entities/post/model/atoms"
import { useFetchComments } from "../api/comments"

export const usePostDetail = (post: PostContent) => {
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<PostContent | null>(null)
  const [comments, setComments] = useAtom(commentsState)
  const [fetchComments, setFetchComment] = useState(false)
  const { data } = useFetchComments(post.id, fetchComments, !!comments[post.id])

  const updateCommentsState = (postId: number, newComments: Comment[]) => {
    setComments((prev) => ({ ...prev, [postId]: newComments }))
  }
  useEffect(() => {
    if (!data) return
    updateCommentsState(post.id, data.comments)
  }, [data])

  const openPostDetail = () => {
    setSelectedPostForDetail(post)
    setFetchComment(true)
  }

  return {
    selectedPostForDetail,
    setSelectedPostForDetail,
    openPostDetail,
  }
}
