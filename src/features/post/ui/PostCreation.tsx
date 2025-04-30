import { Plus } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared/ui"

import { PostContent } from "../index.ts"

interface Props {
  setPosts: Dispatch<SetStateAction<PostContent[]>>
}

const defaultNewPost: PostContent = { id: 0, title: "", body: "", userId: 1 }

export const PostCreation = ({ setPosts }: Props) => {
  const [newPost, setNewPost] = useState<PostContent>(defaultNewPost)
  const [showAddDialog, setShowAddDialog] = useState(false)
  // 게시물 추가
  const addPost = async () => {
    try {
      const response = await fetch("/api/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })
      const data = await response.json()
      setPosts((posts) => [data as PostContent, ...posts])
      setShowAddDialog(false)
      setNewPost(defaultNewPost)
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
            <Button onClick={addPost}>게시물 추가</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
