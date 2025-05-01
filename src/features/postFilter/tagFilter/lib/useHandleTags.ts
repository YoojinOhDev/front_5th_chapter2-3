import { useFetchTags } from "@/features/postFilter/tagFilter/api"

export function useHandleTags() {
  const { data } = useFetchTags()

  return { tags: data || [] }
}
