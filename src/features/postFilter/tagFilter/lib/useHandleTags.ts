import { useEffect, useState } from "react"
import { Tag } from "@/entities/tag"
import { fetchTagsAPI } from "@/features/postFilter/tagFilter/api"

export function useHandleTags() {
  const [tags, setTags] = useState<Tag[]>([])
  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const data = await fetchTagsAPI()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return { tags }
}
