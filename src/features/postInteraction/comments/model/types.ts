import { Comments } from "@/entities/post"

export interface NewComment {
  body: string
  postId: number | null
  userId: number
}

export const defaultNewComment: NewComment = {
  body: "",
  postId: null,
  userId: 1,
}

export interface PostCommentsProps {
  postId: number
  comments: Comments
  setComments: (comments: Comments) => void
  searchQuery: string
}
