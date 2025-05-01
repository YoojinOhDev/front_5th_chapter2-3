import { PostContent } from "@/entities/post"

interface Props {
  tags: PostContent["tags"]
  onChangeTag: (tag: string) => void
  selectedTag: string
}
export const PostTags = ({ tags, onChangeTag, selectedTag }: Props) => {
  if (!tags || tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
            selectedTag === tag
              ? "text-white bg-blue-500 hover:bg-blue-600"
              : "text-blue-800 bg-blue-100 hover:bg-blue-200"
          }`}
          onClick={() => {
            onChangeTag(tag)
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
