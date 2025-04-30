import { MessageSquare } from "lucide-react"
import { PostContent } from "@/entities/post"
import { Dispatch, SetStateAction, useState } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, highlightText } from "@/shared/ui"
import { Comment, Comments } from "@/widgets/post/ui/PostWidget.tsx"
import { PostComments } from "@/features/postComments/ui/PostComments.tsx"

interface Props {
  post: PostContent
  comments: Comments
  setComments: Dispatch<SetStateAction<Comments>>
  searchQuery: string
}
const fetchCommentsAPI = async (postId: number): Promise<{ comments: Comment[] }> => {
  const response = await fetch(`/api/comments/post/${postId}`)
  return response.json()
}
export const PostDetailButton = ({ post, comments, setComments, searchQuery }: Props) => {
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<PostContent | null>(null)
  const updateCommentsState = (postId: number, newComments: Comment[]) => {
    setComments((prev) => ({ ...prev, [postId]: newComments }))
  }
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return
    try {
      const data = await fetchCommentsAPI(postId)
      updateCommentsState(postId, data.comments)
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  const openPostDetail = (post: PostContent) => {
    setSelectedPostForDetail(post)
    fetchComments(post.id)
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
        <MessageSquare className="w-4 h-4" />
      </Button>

      <Dialog open={!!selectedPostForDetail} onOpenChange={(open) => !open && setSelectedPostForDetail(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPostForDetail?.title || "", searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPostForDetail?.body || "", searchQuery)}</p>
            <PostComments
              postId={selectedPostForDetail?.id || 0}
              setComments={setComments}
              comments={comments}
              searchQuery={searchQuery}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
