import { Plus } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared/ui"
import { PostContent } from "@/entities/post"

interface Props {
  setPosts: Dispatch<SetStateAction<PostContent[]>>
}

const defaultNewPost: PostContent = { id: 0, title: "", body: "", userId: 1 }

export const PostCreateButtonAndDialog = ({ setPosts }: Props) => {
  const [newPost, setNewPost] = useState<PostContent>(defaultNewPost)
  const [showAddDialog, setShowAddDialog] = useState(false)

  // API 호출
  const createPost = async (post: PostContent): Promise<PostContent> => {
    const response = await fetch("/api/posts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // 상태 업데이트
  const updatePostsState = (newPost: PostContent) => {
    setPosts((prevPosts) => [newPost, ...prevPosts])
    setShowAddDialog(false)
    setNewPost(defaultNewPost)
  }

  const handleAddPost = async () => {
    try {
      const createdPost = await createPost(newPost)
      updatePostsState(createdPost)
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  return (
    <>
      <Button onClick={() => setShowAddDialog(true)}>
        <Plus className="w-4 h-4 mr-2" />
        게시물 추가
      </Button>
      {/* 게시물 추가 대화상자 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <Textarea
              rows={30}
              placeholder="내용"
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            />
            <Input
              type="number"
              placeholder="사용자 ID"
              value={newPost.userId}
              onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
            />
            <Button onClick={handleAddPost}>게시물 추가</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
