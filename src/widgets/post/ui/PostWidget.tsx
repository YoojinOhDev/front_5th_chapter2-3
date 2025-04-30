import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  highlightText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { PostCreation } from "@/features/post/ui/PostCreation.tsx"
import { PostContent } from "@/features/post"
import { UserProfile } from "@/entities/post/model/types.ts"
import { PostResponse, UserResponse } from "@/features/post/model/types.ts"
import { TagFilter } from "@/features/tagFilter/ui/TagFilter.tsx"
import { SortBy } from "@/features/sortBy/ui/SortBy.tsx"
import { SortOrder } from "@/features/sortOrder/ui/SortOrder.tsx"
import { Pagination } from "@/features/pagination/ui/Pagination.tsx"
import { PostTags } from "@/features/postTags/ui/PostTags.tsx"
import { PostAuthor } from "@/features/postAuthor/ui/PostTags.tsx"
import { PostReactions } from "@/features/PostReactions/ui/PostReactions.tsx"
import { PostEditButton } from "@/features/postEditor/ui/PostEditButton.tsx"
import { PostDetailButton } from "@/features/postDetail/ui/PostDetailButton.tsx"
import { PostDeleteButton } from "@/features/postDeleteButton/ui/PostDeleteButton.tsx"
import { PostSearch } from "@/features/postSearch/ui/PostSearch.tsx"

export interface Comment {
  body: string
  postId: number
  userId: number
  id: number
  likes: number
  user: {
    username: string
  }
}
export type Comments = Record<number, Comment[]>

export interface Tag {
  url: string
  slug: string
}

const fetchPostsAPI = async (limit: number, skip: number): Promise<PostResponse> => {
  const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
  return response.json()
}

const fetchUsersAPI = async (): Promise<UserResponse> => {
  const response = await fetch("/api/users?limit=0&select=username,image")
  return response.json()
}

const searchPostsAPI = async (query: string): Promise<PostResponse> => {
  const response = await fetch(`/api/posts/search?q=${query}`)
  return response.json()
}

const fetchPostsByTagAPI = async (tag: string): Promise<PostResponse> => {
  const response = await fetch(`/api/posts/tag/${tag}`)
  return response.json()
}

export const PostWidget = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 상태 관리
  const [posts, setPosts] = useState<PostContent[]>([])
  const [total, setTotal] = useState<number>(0)
  const [skip, setSkip] = useState<number>(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState<number>(parseInt(queryParams.get("limit") || "10"))

  const [searchQuery, setSearchQuery] = useState<string>(queryParams.get("search") || "")

  const [sortBy, setSortBy] = useState<string>(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState<string>(queryParams.get("sortOrder") || "asc")
  const [loading, setLoading] = useState<boolean>(false)

  const [selectedTag, setSelectedTag] = useState<string>(queryParams.get("tag") || "")
  const [comments, setComments] = useState<Comments>({})

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  function onChangeTag(value: string) {
    setSelectedTag(value)
    fetchPostsByTag(value)
    updateURL()
  }

  const updatePostsState = (postsData: PostResponse, usersData: UserResponse) => {
    const postsWithUsers =
      postsData.posts?.map((post: PostContent) => ({
        ...post,
        author: usersData.users?.find((user: UserProfile) => user.id === post.userId),
      })) || []

    setPosts(postsWithUsers)
    setTotal(postsData.total ?? 0)
  }

  // 게시물 가져오기
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

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const data = await searchPostsAPI(searchQuery)
      if (data.posts && data.total) {
        setPosts(data.posts)
        setTotal(data.total)
      }
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  // 태그별 게시물 가져오기
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

  useEffect(() => {
    fetchPosts()
    updateURL()
  }, [skip, limit, sortBy, sortOrder])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <PostCreation
            setPosts={(posts) => {
              const typedPosts = posts as PostContent[]
              setPosts(typedPosts)
            }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <PostSearch searchPosts={searchPosts} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <TagFilter onChangeTag={onChangeTag} selectedTag={selectedTag} />
            <SortBy sortBy={sortBy} setSortBy={setSortBy} />
            <SortOrder sortOrder={sortOrder} setSortOrder={setSortOrder} />
          </div>

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead className="w-[150px]">작성자</TableHead>
                  <TableHead className="w-[150px]">반응</TableHead>
                  <TableHead className="w-[150px]">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.id}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{highlightText(post.title, searchQuery)}</div>
                        <PostTags tags={post.tags} onChangeTag={onChangeTag} selectedTag={selectedTag} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <PostAuthor post={post} />
                    </TableCell>
                    <TableCell>
                      <PostReactions reactions={post.reactions} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <PostDetailButton
                          post={post}
                          comments={comments}
                          setComments={setComments}
                          searchQuery={searchQuery}
                        />
                        <PostEditButton post={post} posts={posts} setPosts={setPosts} />
                        <PostDeleteButton postId={post.id} posts={posts} setPosts={setPosts} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* 페이지네이션 */}
          <Pagination limit={limit} setLimit={setLimit} skip={skip} setSkip={setSkip} total={total} />
        </div>
      </CardContent>
    </Card>
  )
}
