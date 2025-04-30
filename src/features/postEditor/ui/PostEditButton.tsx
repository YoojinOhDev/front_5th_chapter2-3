import { Edit2 } from "lucide-react"
import { PostContent } from "@/entities/post"
import { Dispatch, SetStateAction, useState } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared/ui"

interface Props {
  post: PostContent
  posts: PostContent[]
  setPosts: Dispatch<SetStateAction<PostContent[]>>
}
const updatePostAPI = async (post: PostContent): Promise<PostContent> => {
  const response = await fetch(`/api/posts/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  return response.json()
}

export const PostEditButton = ({ post, posts, setPosts }: Props) => {
  const [selectedPostForEdit, setSelectedPostForEdit] = useState<PostContent | null>(null)
  const updatePost = async () => {
    if (!selectedPostForEdit) return
    try {
      const data = await updatePostAPI(selectedPostForEdit)
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      setSelectedPostForEdit(null)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setSelectedPostForEdit(post)
        }}
      >
        <Edit2 className="w-4 h-4" />
      </Button>

      <Dialog open={!!selectedPostForEdit} onOpenChange={(open) => !open && setSelectedPostForEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={selectedPostForEdit?.title || ""}
              onChange={(e) => {
                if (!selectedPostForEdit) return
                setSelectedPostForEdit({ ...selectedPostForEdit, title: e.target.value })
              }}
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={selectedPostForEdit?.body || ""}
              onChange={(e) => {
                if (!selectedPostForEdit) return
                setSelectedPostForEdit({ ...selectedPostForEdit, body: e.target.value })
              }}
            />
            <Button onClick={updatePost}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
