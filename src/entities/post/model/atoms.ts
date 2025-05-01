import { atom } from "jotai"
import { PostContent, Comments } from "./types"

export const postsState = atom<PostContent[]>([])
export const totalPostsState = atom<number>(0)
export const loadingState = atom<boolean>(false)
export const commentsState = atom<Comments>({})
