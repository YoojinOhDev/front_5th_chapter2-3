import { UserProfile } from "@/entities/post/model/types"
import { useQuery } from "@tanstack/react-query"
import { UseQueryResult } from "@tanstack/react-query"

export const fetchUserAPI = async (userId: number): Promise<UserProfile> => {
  const response = await fetch(`/api/users/${userId}`)
  return response.json()
}

export const useFetchUser = (userId: number, openUserModal: boolean): UseQueryResult<UserProfile | undefined> => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserAPI(userId),
    enabled: !!userId && openUserModal,
  })
}
