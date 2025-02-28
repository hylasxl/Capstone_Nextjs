import { DisplayAccount } from "./user.type"

export interface GetListFriendRequest {
    account_id: string
}

export interface GetListFriendResponse {
    Infos: DisplayAccount[]
    success: boolean
}

