import { MessageSquare } from "lucide-react"
import { PostContent } from "@/entities/post"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, highlightText } from "@/shared/ui"
import { PostComments } from "@/features/postInteraction"
import { usePostDetail } from "../model/usePostDetail"

interface Props {
  post: PostContent
  searchQuery: string
}

export const PostDetailButtonAndDialog = ({ post, searchQuery }: Props) => {
  const { selectedPostForDetail, setSelectedPostForDetail, openPostDetail } = usePostDetail(post)

  return (
    <>
      <Button variant="ghost" size="sm" onClick={openPostDetail}>
        <MessageSquare className="w-4 h-4" />
      </Button>

      <Dialog open={!!selectedPostForDetail} onOpenChange={(open) => !open && setSelectedPostForDetail(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPostForDetail?.title || "", searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPostForDetail?.body || "", searchQuery)}</p>
            <PostComments postId={selectedPostForDetail?.id || 0} searchQuery={searchQuery} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
