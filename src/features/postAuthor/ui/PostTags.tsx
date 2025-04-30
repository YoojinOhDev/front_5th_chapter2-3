import { PostContent } from "@/entities/post"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { useState } from "react"
import { UserProfile } from "@/entities/post/model/types.ts"

interface Props {
  post: PostContent
}
const fetchUserAPI = async (userId: number): Promise<UserProfile> => {
  const response = await fetch(`/api/users/${userId}`)
  return response.json()
}

export const PostAuthor = ({ post }: Props) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  // 사용자 모달 열기
  const openUserModal = async (user: UserProfile | undefined) => {
    if (!user) return
    try {
      const userData = await fetchUserAPI(user.id)
      setSelectedUser(userData)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }
  return (
    <>
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => openUserModal(post.author)}>
        <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
        <span>{post.author?.username}</span>
      </div>
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img src={selectedUser?.image} alt={selectedUser?.username} className="w-24 h-24 rounded-full mx-auto" />
            <h3 className="text-xl font-semibold text-center">{selectedUser?.username}</h3>
            <div className="space-y-2">
              <p>
                <strong>이름:</strong> {selectedUser?.firstName} {selectedUser?.lastName}
              </p>
              <p>
                <strong>나이:</strong> {selectedUser?.age}
              </p>
              <p>
                <strong>이메일:</strong> {selectedUser?.email}
              </p>
              <p>
                <strong>전화번호:</strong> {selectedUser?.phone}
              </p>
              <p>
                <strong>주소:</strong> {selectedUser?.address?.address}, {selectedUser?.address?.city},{" "}
                {selectedUser?.address?.state}
              </p>
              <p>
                <strong>직장:</strong> {selectedUser?.company?.name} - {selectedUser?.company?.title}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
