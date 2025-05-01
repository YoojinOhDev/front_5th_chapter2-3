import { useAtom } from "jotai"
import { PostContent, UserProfile } from "@/entities/post/model/types.ts"
import { PostResponse, UserResponse } from "../model/types.ts"
import { fetchUsersAPI, searchPostsAPI, fetchPostsByTagAPI, useFetchPosts, useFetchUsers } from "../api"
import { postsState, totalPostsState, loadingState } from "@/entities/post/model/atoms"
import { useEffect } from "react"

export const usePosts = (skip: number, limit: number) => {
  const [posts, setPosts] = useAtom(postsState)
  const [total, setTotal] = useAtom(totalPostsState)
  const [loading, setLoading] = useAtom(loadingState)

  const { data: postsData, isLoading: isFetchPostLoading, refetch: refetchPosts } = useFetchPosts(limit, skip)
  const { data: usersData, isLoading: isFetchUsersLoading } = useFetchUsers()
  setLoading(isFetchPostLoading || isFetchUsersLoading)
  const updatePostsState = (postsData: PostResponse, usersData: UserResponse) => {
    const postsWithUsers =
      postsData.posts?.map((post: PostContent) => ({
        ...post,
        author: usersData.users?.find((user: UserProfile) => user.id === post.userId),
      })) || []

    setPosts(postsWithUsers)
    setTotal(postsData.total ?? 0)
  }

  useEffect(() => {
    if (!postsData || !usersData) return
    updatePostsState(postsData, usersData)
  }, [postsData, usersData])

  const searchPosts = async (query: string) => {
    if (!query) {
      await refetchPosts()
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
      await refetchPosts()
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

  return { posts, total, loading, searchPosts, refetchPosts, fetchPostsByTag, setPosts }
}
