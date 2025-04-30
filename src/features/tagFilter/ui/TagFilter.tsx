import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/shared/ui";
import {useEffect, useState} from "react";
import {Tag} from "@/widgets/post/ui/PostWidget.tsx";

function useHandleTags(){
    const fetchTagsAPI = async (): Promise<Tag[]> => {
        const response = await fetch("/api/posts/tags")
        return response.json()
    }
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

    return {tags}
}

interface Props {
    selectedTag: string
    onChangeTag: (tag: string) => void
}

export const TagFilter = ({selectedTag, onChangeTag}: Props) => {
    const {tags} = useHandleTags();

    return  <Select
        value={selectedTag}
        onValueChange={onChangeTag}
    >
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
}