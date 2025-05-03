import { Comment } from "@/entities/post"
import { useQuery, UseQueryResult } from "@tanstack/react-query"

export const fetchCommentsAPI = async (postId: number): Promise<{ comments: Comment[] }> => {
  const response = await fetch(`/api/comments/post/${postId}`)
  return response.json()
}

export const useFetchComments = (
  postId: number,
  fetchComment: boolean,
  alreadyHaveComments: boolean,
): UseQueryResult<{ comments: Comment[] }> => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchCommentsAPI(postId),
    enabled: !!postId && fetchComment && !alreadyHaveComments,
  })
}
