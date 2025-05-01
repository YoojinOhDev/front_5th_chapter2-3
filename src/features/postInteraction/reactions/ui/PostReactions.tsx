import { ThumbsDown, ThumbsUp } from "lucide-react"
import { PostContent } from "@/entities/post"

interface Props {
  reactions: PostContent["reactions"]
}

export const PostReactions = ({ reactions }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <ThumbsUp className="w-4 h-4" />
      <span>{reactions?.likes || 0}</span>
      <ThumbsDown className="w-4 h-4" />
      <span>{reactions?.dislikes || 0}</span>
    </div>
  )
}
