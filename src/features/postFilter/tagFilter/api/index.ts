import { Tag } from "@/entities/tag"
import { useQuery } from "@tanstack/react-query"

export const fetchTagsAPI = async (): Promise<Tag[]> => {
  const response = await fetch("/api/posts/tags")
  return response.json()
}

export const useFetchTags = () => {
  return useQuery<Tag[] | undefined>({
    queryKey: ["tags"],
    queryFn: fetchTagsAPI,
  })
}
