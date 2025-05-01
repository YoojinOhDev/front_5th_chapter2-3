import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"
import { useHandleTags } from "../lib/useHandleTags"

interface Props {
  selectedTag: string
  onChangeTag: (tag: string) => void
}

export const TagFilter = ({ selectedTag, onChangeTag }: Props) => {
  const { tags } = useHandleTags()

  return (
    <Select value={selectedTag} onValueChange={onChangeTag}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="태그 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">모든 태그</SelectItem>
        {tags.map((tag) => (
          <SelectItem key={tag.url} value={tag.slug}>
            {tag.slug}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
