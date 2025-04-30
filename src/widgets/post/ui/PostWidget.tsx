import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@/shared/ui"
import { Edit2, MessageSquare, Plus, Search, ThumbsUp, Trash2 } from "lucide-react"
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

export interface NewComment {
  body: string
  postId: number | null
  userId: number
}

const defaultNewComment: NewComment = {
  body: "",
  postId: null,
  userId: 1,
}
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

const updatePostAPI = async (post: PostContent): Promise<PostContent> => {
  const response = await fetch(`/api/posts/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  return response.json()
}

const deletePostAPI = async (id: number): Promise<void> => {
  await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  })
}

const fetchCommentsAPI = async (postId: number): Promise<{ comments: Comment[] }> => {
  const response = await fetch(`/api/comments/post/${postId}`)
  return response.json()
}

const addCommentAPI = async (comment: { body: string; postId: number | null; userId: number }): Promise<Comment> => {
  const response = await fetch("/api/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  })
  return response.json()
}

const updateCommentAPI = async (comment: Comment): Promise<Comment> => {
  const response = await fetch(`/api/comments/${comment.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body: comment.body }),
  })
  return response.json()
}

const deleteCommentAPI = async (id: number): Promise<void> => {
  await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  })
}

const likeCommentAPI = async (id: number, likes: number): Promise<Comment> => {
  const response = await fetch(`/api/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: likes + 1 }),
  })
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
  const [selectedPost, setSelectedPost] = useState<PostContent | null>(null)
  const [sortBy, setSortBy] = useState<string>(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState<string>(queryParams.get("sortOrder") || "asc")
  const [loading, setLoading] = useState<boolean>(false)

  const [selectedTag, setSelectedTag] = useState<string>(queryParams.get("tag") || "")
  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<NewComment>(defaultNewComment)

  const [showEditDialog, setShowEditDialog] = useState<boolean>(false)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState<boolean>(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState<boolean>(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState<boolean>(false)

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

  const updateCommentsState = (postId: number, newComments: Comment[]) => {
    setComments((prev) => ({ ...prev, [postId]: newComments }))
  }

  const updateCommentState = (postId: number, updatedComment: Comment) => {
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId].map((comment) => (comment.id === updatedComment.id ? updatedComment : comment)),
    }))
  }

  const deleteCommentState = (postId: number, commentId: number) => {
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId].filter((comment) => comment.id !== commentId),
    }))
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

  // 게시물 업데이트
  const updatePost = async () => {
    if (!selectedPost) return
    try {
      const data = await updatePostAPI(selectedPost)
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      await deletePostAPI(id)
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return
    try {
      const data = await fetchCommentsAPI(postId)
      updateCommentsState(postId, data.comments)
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 추가
  const addComment = async () => {
    try {
      const data = await addCommentAPI(newComment)
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))
      setShowAddCommentDialog(false)
      setNewComment(defaultNewComment)
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  // 댓글 업데이트
  const updateComment = async () => {
    if (!selectedComment) return
    try {
      const data = await updateCommentAPI(selectedComment)
      updateCommentState(data.postId, data)
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const deleteComment = async (id: number, postId: number) => {
    try {
      await deleteCommentAPI(id)
      deleteCommentState(postId, id)
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    try {
      const comment = comments[postId]?.find((c) => c.id === id)
      if (!comment) return

      const data = await likeCommentAPI(id, comment.likes)
      updateCommentState(postId, { ...data, likes: comment.likes + 1 })
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: PostContent) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  useEffect(() => {
    fetchPosts()
    updateURL()
  }, [skip, limit, sortBy, sortOrder])

  // 하이라이트 함수 추가
  const highlightText = (text: string, highlight: string) => {
    if (!text) return null
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  // 댓글 렌더링
  const renderComments = (postId: number) => (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment((prev) => ({ ...prev, postId }))
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment)
                  setShowEditCommentDialog(true)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

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
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchPosts()}
                />
              </div>
            </div>
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
                        <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPost(post)
                            setShowEditDialog(true)
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
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

      {/* 게시물 수정 대화상자 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={selectedPost?.title || ""}
              onChange={(e) => {
                if (!selectedPost) return
                setSelectedPost({ ...selectedPost, title: e.target.value })
              }}
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={selectedPost?.body || ""}
              onChange={(e) => {
                if (!selectedPost) return
                setSelectedPost({ ...selectedPost, body: e.target.value })
              }}
            />
            <Button onClick={updatePost}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 대화상자 */}
      <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={newComment.body}
              onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
            />
            <Button onClick={addComment}>댓글 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
              onChange={(e) => {
                if (!selectedComment) return
                setSelectedComment({ ...selectedComment, body: e.target.value })
              }}
            />
            <Button onClick={updateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title || "", searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body || "", searchQuery)}</p>
            {renderComments(selectedPost?.id || 0)}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
