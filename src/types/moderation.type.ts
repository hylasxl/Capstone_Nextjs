export interface GetListBanWordsRequest {
    RequestAccountID: number;
}

export interface WordData {
    ID: number;
    Word: string;
}

export interface DataSet {
    LanguageCode: string;
    Words: WordData[];
}

export interface GetListBanWordsResponse {
    Data: DataSet[];
}

export interface EditWordRequest {
    ID: number;
    Content: string;
}

export interface EditWordResponse {
    Success: boolean;
}

export interface DeleteWordRequest {
    ID: number;
}

export interface DeleteWordResponse {
    Success: boolean;
}

export const transformGetListBanWordsRequest = (
    request: GetListBanWordsRequest
): { request_account_id: number } => {
    return {
        request_account_id: request.RequestAccountID,
    };
};

export const transformEditWordRequest = (
    request: EditWordRequest
): { id: number; content: string } => {
    return {
        id: request.ID,
        content: request.Content,
    };
};

export const transformDeleteWordRequest = (
    request: DeleteWordRequest
): { id: number } => {
    return {
        id: request.ID,
    };
};

export interface AddWordRequest {
    request_account_id: number,
    content: string,
    language_code: string
}

export interface AddWordResponse {
    Success: boolean
    ID: number
}