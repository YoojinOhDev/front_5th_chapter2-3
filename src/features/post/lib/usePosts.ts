import { useState } from "react"
import { PostContent, UserProfile } from "@/entities/post/model/types.ts"
import { PostResponse, UserResponse } from "../model/types"
import { fetchPostsAPI, fetchUsersAPI, searchPostsAPI, fetchPostsByTagAPI } from "../api/postApi.ts"

export const usePosts = (skip: number, limit: number) => {
  const [posts, setPosts] = useState<PostContent[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  const updatePostsState = (postsData: PostResponse, usersData: UserResponse) => {
    const postsWithUsers =
      postsData.posts?.map((post: PostContent) => ({
        ...post,
        author: usersData.users?.find((user: UserProfile) => user.id === post.userId),
      })) || []

    setPosts(postsWithUsers)
    setTotal(postsData.total ?? 0)
  }

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const [postsData, usersData] = await Promise.all([fetchPostsAPI(limit, skip), fetchUsersAPI()])
      updatePostsState(postsData, usersData)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchPosts = async (query: string) => {
    if (!query) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const data = await searchPostsAPI(query)
      if (data.posts && data.total) {
        setPosts(data.posts)
        setTotal(data.total)
      }
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const [postsData, usersData] = await Promise.all([fetchPostsByTagAPI(tag), fetchUsersAPI()])
      updatePostsState(postsData, usersData)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }

  return { posts, total, loading, fetchPosts, searchPosts, fetchPostsByTag, setPosts }
}
