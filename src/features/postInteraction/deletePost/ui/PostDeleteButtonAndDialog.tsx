import { Button } from "@/shared/ui"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui"
import { useState } from "react"
import { PostContent } from "@/entities/post"
import { usePosts } from "@/widgets/post/lib/usePosts"

interface Props {
  post: PostContent
}

export const PostDeleteButtonAndDialog = ({ post }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const { deletePost } = usePosts()

  const handleDelete = async () => {
    try {
      await deletePost(post.id)
      setIsOpen(false)
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error)
    }
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setIsOpen(true)}>
        삭제
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시글 삭제</DialogTitle>
            <DialogDescription>정말로 이 게시글을 삭제하시겠습니까?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
