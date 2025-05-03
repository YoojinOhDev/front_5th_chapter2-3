import { PostResponse, UserResponse } from "../model/types.ts"
import { useQuery } from "@tanstack/react-query"

export const fetchPostsAPI = async (limit: number, skip: number): Promise<PostResponse> => {
  const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
  return response.json()
}

export const fetchUsersAPI = async (): Promise<UserResponse> => {
  const response = await fetch("/api/users?limit=0&select=username,image")
  return response.json()
}

export const searchPostsAPI = async (query: string): Promise<PostResponse> => {
  const response = await fetch(`/api/posts/search?q=${query}`)
  return response.json()
}

export const fetchPostsByTagAPI = async (tag: string): Promise<PostResponse> => {
  const response = await fetch(`/api/posts/tag/${tag}`)
  return response.json()
}

export const useFetchPosts = (limit: number, skip: number, selectedTag: string | undefined) => {
  const query = useQuery<PostResponse | undefined>({
    queryKey: ["posts", limit, skip, selectedTag],
    queryFn: () => fetchPostsAPI(limit, skip),
    enabled: !selectedTag || selectedTag === "all",
  })

  if (query.error) {
    console.error("게시물 가져오기 오류:", query.error)
  }

  return query
}

export const useFetchPostsByTag = (selectedTag: string | undefined) => {
  const query = useQuery<PostResponse | undefined>({
    queryKey: ["posts", selectedTag],
    queryFn: () => fetchPostsByTagAPI(selectedTag as string),
    enabled: !!selectedTag && selectedTag !== "all",
  })

  if (query.error) {
    console.error("게시물 가져오기 오류:", query.error)
  }

  return query
}

export const useFetchUsers = () => {
  const query = useQuery<UserResponse | undefined>({
    queryKey: ["users"],
    queryFn: () => fetchUsersAPI(),
  })

  if (query.error) {
    console.error("유저 정보 가져오기 오류:", query.error)
  }

  return query
}
