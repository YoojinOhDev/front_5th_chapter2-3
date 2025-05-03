import { PostContent } from "@/entities/post"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { useEffect, useState } from "react"
import { UserProfile } from "@/entities/post/model/types"
import { useFetchUser } from "../api/fetchUser"

interface Props {
  post: PostContent
}

export const PostAuthor = ({ post }: Props) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [openUserModal, setOpenUserModal] = useState(false)
  const { data: userData } = useFetchUser(post.author?.id || 0, openUserModal)

  useEffect(() => {
    userData && setSelectedUser(userData)
  }, [userData])

  return (
    <>
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setOpenUserModal(true)}>
        <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
        <span>{post.author?.username}</span>
      </div>
      <Dialog open={!!selectedUser && !!openUserModal} onOpenChange={(open) => !open && setSelectedUser(null)}>
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
