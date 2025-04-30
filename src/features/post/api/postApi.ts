import { PostResponse, UserResponse } from "../model/types"

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
