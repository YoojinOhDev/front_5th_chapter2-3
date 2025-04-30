import {PostContent} from "@/entities/post";
import {UserProfile} from "@/entities/post/model/types.ts";

export interface PostResponse {
    id: number
    title: string
    body: string
    userId: number
    posts?: PostContent[]
    total?: number
}

export interface UserResponse {
    id: number
    username: string
    image: string
    users?: UserProfile[]
}