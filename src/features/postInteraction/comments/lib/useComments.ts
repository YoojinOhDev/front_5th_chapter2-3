import { useState } from "react"
import { Comment, Comments } from "@/entities/post"
import { NewComment, defaultNewComment } from "../model/types"
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useUpdateCommentMutation,
} from "../api/commentApi"

// 공통 상태 관리 로직
const useCommentState = (comments: Comments, setComments: (comments: Comments) => void) => {
  const addCommentState = (postId: number, newComment: Comment) => {
    const newCommentProp = {
      [postId]: [...(comments[postId] || []), newComment],
    }
    setComments({
      ...comments,
      ...newCommentProp,
    })
  }
  const updateCommentState = (postId: number, updatedComment: Comment) => {
    const newCommentProp = {
      [postId]: comments[postId].map((comment) => (comment.id === updatedComment.id ? updatedComment : comment)),
    }

    setComments({
      ...comments,
      ...newCommentProp,
    })
  }

  const deleteCommentState = (postId: number, commentId: number) => {
    setComments({
      ...comments,
      [postId]: comments[postId].filter((comment) => comment.id !== commentId),
    })
  }

  return {
    addCommentState,
    updateCommentState,
    deleteCommentState,
  }
}

// 댓글 추가 관련 로직
export const useAddComment = (comments: Comments, setComments: (comments: Comments) => void) => {
  const [newComment, setNewComment] = useState<NewComment>(defaultNewComment)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState<boolean>(false)
  const { addCommentState } = useCommentState(comments, setComments)
  const { mutate: mutateNewComment } = useAddCommentMutation()

  const addComment = async () => {
    mutateNewComment(newComment, {
      onSuccess: (data) => {
        addCommentState(data.postId, data)
        setShowAddCommentDialog(false)
        setNewComment(defaultNewComment)
      },
      onError: (error) => {
        console.error("댓글 추가 오류:", error)
      },
    })
  }

  return {
    newComment,
    setNewComment,
    showAddCommentDialog,
    setShowAddCommentDialog,
    addComment,
  }
}

// 댓글 수정 관련 로직
export const useEditComment = (comments: Comments, setComments: (comments: Comments) => void) => {
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState<boolean>(false)
  const { updateCommentState } = useCommentState(comments, setComments)
  const { mutate } = useUpdateCommentMutation()

  const updateComment = async () => {
    if (!selectedComment) return
    mutate(selectedComment, {
      onSuccess: (data) => {
        updateCommentState(data.postId, data)
        setShowEditCommentDialog(false)
        setSelectedComment(null)
      },
      onError: (error) => {
        console.error("댓글 수정 오류:", error)
      },
    })
  }

  return {
    selectedComment,
    setSelectedComment,
    showEditCommentDialog,
    setShowEditCommentDialog,
    updateComment,
  }
}

// 댓글 삭제 관련 로직
export const useDeleteComment = (comments: Comments, setComments: (comments: Comments) => void) => {
  const { deleteCommentState } = useCommentState(comments, setComments)
  const { mutate } = useDeleteCommentMutation()

  const deleteComment = async (id: number, postId: number) => {
    mutate(id, {
      onSuccess: () => {
        deleteCommentState(postId, id)
      },
      onError: (error) => {
        console.error("댓글 삭제 오류:", error)
      },
    })
  }

  return {
    deleteComment,
  }
}

// 댓글 좋아요 관련 로직
export const useLikeComment = (comments: Comments, setComments: (comments: Comments) => void) => {
  const { updateCommentState } = useCommentState(comments, setComments)
  const { mutate } = useLikeCommentMutation()

  const likeComment = async (id: number, postId: number) => {
    const comment = comments[postId]?.find((c) => c.id === id)
    if (!comment) return

    mutate(
      { id: id, likes: comment.likes },
      {
        onSuccess: (data) => {
          updateCommentState(postId, { ...data, likes: comment.likes + 1 })
        },
        onError: (error) => {
          console.error("댓글 좋아요 오류:", error)
        },
      },
    )
  }

  return {
    likeComment,
  }
}
