import { useState } from "react"
import { useURLParams } from "@/shared/lib"

export const useTagFilter = (initialTag: string = "") => {
  const [selectedTag, setSelectedTag] = useState<string>(initialTag)
  const { updateURL } = useURLParams()

  const onChangeTag = (value: string) => {
    setSelectedTag(value)
    updateURL({ tag: value })
  }

  return { selectedTag, onChangeTag }
}
