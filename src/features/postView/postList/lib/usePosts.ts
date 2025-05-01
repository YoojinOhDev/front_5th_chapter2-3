import { useAtom } from "jotai"
import { PostContent, UserProfile } from "@/entities/post/model/types.ts"
import { PostResponse, UserResponse } from "../model/types.ts"
import { searchPostsAPI, useFetchPosts, useFetchUsers, useFetchPostsByTag } from "../api"
import { postsState, totalPostsState, loadingState } from "@/entities/post/model/atoms"
import { useEffect } from "react"

function getPostsWithUsers(postsData: PostResponse, usersData: UserResponse) {
  return (
    postsData.posts?.map((post: PostContent) => ({
      ...post,
      author: usersData.users?.find((user: UserProfile) => user.id === post.userId),
    })) || []
  )
}

export const usePosts = (skip: number, limit: number, selectedTag: string | undefined) => {
  const [posts, setPosts] = useAtom(postsState)
  const [total, setTotal] = useAtom(totalPostsState)
  const [loading, setLoading] = useAtom(loadingState)

  const {
    data: postsData,
    isLoading: isFetchPostLoading,
    refetch: refetchPosts,
  } = useFetchPosts(limit, skip, selectedTag)
  const { data: usersData, isLoading: isFetchUsersLoading } = useFetchUsers()
  const { data: postsDataByTag, isLoading: isFetchPostByTagLoading } = useFetchPostsByTag(selectedTag)
  setLoading(isFetchPostLoading || isFetchUsersLoading || isFetchPostByTagLoading)

  const updatePostsState = (postsWithUsers: PostContent[], total: number | undefined) => {
    setPosts(postsWithUsers)
    setTotal(total ?? 0)
  }

  useEffect(() => {
    if (!postsData || !usersData) return

    updatePostsState(getPostsWithUsers(postsData, usersData), postsData.total)
  }, [postsData, usersData, postsDataByTag])

  useEffect(() => {
    if (!postsDataByTag || !usersData) return

    updatePostsState(getPostsWithUsers(postsDataByTag, usersData), postsDataByTag.total)
  }, [usersData, postsDataByTag])

  const searchPosts = async (query: string) => {
    setLoading(true)
    try {
      const data = await searchPostsAPI(query)
      if (data.posts && data.total) {
        updatePostsState(data.posts, data.total)
      }
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  return { posts, total, loading, searchPosts, refetchPosts, setPosts }
}
