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
import { useState } from "react"

import { useURLParams } from "@/shared/lib"
import { PostCreation } from "@/features/post/ui/PostCreation.tsx"
import { usePosts } from "@/features/post/lib/usePosts.ts"
import { useComments } from "@/features/post/lib/useComments.ts"
import { useTagFilter } from "@/features/post/lib/useTagFilter.ts"
import { usePaginationAndSort } from "@/features/post/lib/usePaginationAndSort.ts"
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

export const PostWidget = () => {
  const { getParam } = useURLParams()
  const [searchQuery, setSearchQuery] = useState<string>(getParam("search"))

  const { skip, setSkip, limit, setLimit, sortBy, setSortBy, sortOrder, setSortOrder, handleURLUpdate } =
    usePaginationAndSort({
      onParamsChange: () => {
        fetchPosts()
      },
    })

  const { posts, total, loading, fetchPosts, searchPosts, fetchPostsByTag, setPosts } = usePosts(skip, limit)
  const { comments, setComments } = useComments()
  const { selectedTag, onChangeTag } = useTagFilter(getParam("tag"))

  const handleSearch = () => {
    searchPosts(searchQuery)
    handleURLUpdate({ search: searchQuery })
  }

  const handleTagChange = (value: string) => {
    onChangeTag(value)
    fetchPostsByTag(value)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <PostCreation setPosts={setPosts} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <PostSearch searchPosts={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <TagFilter onChangeTag={handleTagChange} selectedTag={selectedTag} />
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
                        <PostTags tags={post.tags} onChangeTag={handleTagChange} selectedTag={selectedTag} />
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
