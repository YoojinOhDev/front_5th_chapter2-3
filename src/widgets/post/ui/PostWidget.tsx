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

import {
  PostEditButtonAndDialog,
  PostDeleteButtonAndDialog,
  PostCreateButtonAndDialog,
} from "@/features/postManagement"

import {
  PostAuthor,
  PostDetailButtonAndDialog,
  usePaginationAndSort,
  usePosts,
  useTagFilter,
} from "@/features/postView"

import { PostSearch, SortBy, SortOrder, TagFilter } from "@/features/postFilter"

import { PostReactions } from "@/features/postInteraction"

import { PostTags, Pagination, useURLParams } from "@/shared"
import { useAtom } from "jotai"
import { loadingState } from "@/entities/post/model/atoms.ts"

export const PostWidget = () => {
  const { getParam } = useURLParams()
  const [searchQuery, setSearchQuery] = useState<string>(getParam("search"))
  const [loading] = useAtom(loadingState)
  const { skip, setSkip, limit, setLimit, sortBy, setSortBy, sortOrder, setSortOrder, handleURLUpdate } =
    usePaginationAndSort({
      onParamsChange: () => {
        fetchPosts()
      },
    })

  const { posts, total, fetchPosts, searchPosts, fetchPostsByTag } = usePosts(skip, limit)
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
          <PostCreateButtonAndDialog />
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
                        <PostDetailButtonAndDialog post={post} searchQuery={searchQuery} />
                        <PostEditButtonAndDialog post={post} />
                        <PostDeleteButtonAndDialog postId={post.id} />
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
