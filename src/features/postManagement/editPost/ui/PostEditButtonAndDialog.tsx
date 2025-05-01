import { Edit2 } from "lucide-react"
import { PostContent } from "@/entities/post"
import { useState } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared/ui"
import { useAtom } from "jotai"
import { postsState } from "@/entities/post/model/atoms"

interface Props {
  post: PostContent
}

export const PostEditButtonAndDialog = ({ post }: Props) => {
  const [, setPosts] = useAtom(postsState)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editedPost, setEditedPost] = useState<PostContent>(post)

  const handleEdit = () => {
    setPosts((prev) => prev.map((p) => (p.id === post.id ? editedPost : p)))
    setShowEditDialog(false)
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setShowEditDialog(true)}>
        <Edit2 className="w-4 h-4" />
      </Button>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={editedPost.title}
              onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
            />
            <Textarea
              placeholder="내용"
              value={editedPost.body}
              onChange={(e) => setEditedPost({ ...editedPost, body: e.target.value })}
            />
            <Button onClick={handleEdit}>수정</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
