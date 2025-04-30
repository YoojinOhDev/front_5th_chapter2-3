import { Input } from "@/shared/ui"
import { Dispatch, SetStateAction } from "react"
import { Search } from "lucide-react"

interface Props {
  searchQuery: string
  setSearchQuery: Dispatch<SetStateAction<string>>
  searchPosts: () => void
}

export const PostSearch = ({ searchQuery, setSearchQuery, searchPosts }: Props) => {
  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="게시물 검색..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && searchPosts()}
        />
      </div>
    </div>
  )
}
