import { Comment } from "@/entities/post"
import { NewComment } from "../model/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const addCommentAPI = async (comment: NewComment): Promise<Comment> => {
  const response = await fetch("/api/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  })
  return response.json()
}

export const updateCommentAPI = async (comment: Comment): Promise<Comment> => {
  const response = await fetch(`/api/comments/${comment.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body: comment.body }),
  })
  return response.json()
}

export const deleteCommentAPI = async (id: number): Promise<void> => {
  await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  })
}

export const likeCommentAPI = async (id: number, likes: number): Promise<Comment> => {
  const response = await fetch(`/api/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: likes + 1 }),
  })
  return response.json()
}

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<Comment, Error, NewComment>({
    mutationFn: (comment) => addCommentAPI(comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })
}

export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<Comment, Error, Comment>({
    mutationFn: updateCommentAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })
}

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: deleteCommentAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })
}

export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<Comment, Error, { id: number; likes: number }>({
    mutationFn: ({ id, likes }) => likeCommentAPI(id, likes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })
}
