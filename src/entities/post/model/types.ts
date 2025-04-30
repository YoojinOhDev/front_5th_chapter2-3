export interface UserProfile {
  id: number
  username: string
  image: string
  firstName: string
  lastName: string
  age: number
  email: string
  phone: string
  address: {
    address: string
    city: string
    state: string
  }
  company: {
    name: string
    title: string
  }
}

export type PostContent = {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
  author?: UserProfile
}

export interface Comment {
  body: string
  postId: number
  userId: number
  id: number
  likes: number
  user: {
    username: string
  }
}

export type Comments = Record<number, Comment[]>
