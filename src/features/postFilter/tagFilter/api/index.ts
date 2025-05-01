import { Tag } from "@/entities/tag"

export const fetchTagsAPI = async (): Promise<Tag[]> => {
  const response = await fetch("/api/posts/tags")
  return response.json()
}
