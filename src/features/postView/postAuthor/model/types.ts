import { UserProfile } from "@/entities/post/model/types"

export interface PostAuthorProps {
  post: {
    author?: UserProfile
  }
}
