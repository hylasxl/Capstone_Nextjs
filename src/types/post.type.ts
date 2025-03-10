export interface GetNewPostStatisticRequest {
    RequestAccountID: number;
    PeriodLabel: string;
    PeriodYear: number;
    PeriodMonth: number;
}

interface RawGetNewPostStatisticRequest {
    request_account_id: number;
    period_label: string;
    period_year: number;
    period_month: number
}

export interface GetNewPostStatisticResponse {
    RequestAccountID: number;
    PeriodLabel: string;
    TotalPosts: number;
    Data: DataTerms[];
}

interface RawGetNewPostStatisticResponse {
    request_account_id: number;
    period_label: string;
    total_posts: number;
    data: RawDataTerms[];
}

export interface DataTerms {
    Label: string;
    Count: number;
}

interface RawDataTerms {
    label: string;
    count: number;
}

const safeParse = <T>(json: unknown, validator: (data: unknown) => data is T): T => {
    if (!validator(json)) {
        throw new Error("Invalid response format");
    }
    return json;
};

const isDataTerms = (data: unknown): data is DataTerms => {
    if (typeof data !== "object" || data === null) return false;
    const obj = data as DataTerms;
    return typeof obj.Label === "string" && typeof obj.Count === "number";
};

const isGetNewPostStatisticResponse = (data: unknown): data is GetNewPostStatisticResponse => {
    if (typeof data !== "object" || data === null) return false;
    const obj = data as GetNewPostStatisticResponse;
    return (
        typeof obj.RequestAccountID === "number" &&
        typeof obj.PeriodLabel === "string" &&
        typeof obj.TotalPosts === "number" &&
        Array.isArray(obj.Data) &&
        obj.Data.every(isDataTerms)
    );
};


// ✅ Transform Request (Frontend → API Format)
export const transformedGetNewPostStatisticRequest = (
    request: GetNewPostStatisticRequest
): RawGetNewPostStatisticRequest => {
    return {
        request_account_id: request.RequestAccountID,
        period_month: request.PeriodMonth,
        period_year: request.PeriodYear,
        period_label: request.PeriodLabel,
    };
};

// ✅ Transform Response (API → Frontend Format)
export const transformedGetNewPostStatisticResponse = (
    apiResponse: RawGetNewPostStatisticResponse
): GetNewPostStatisticResponse => {
    return {
        RequestAccountID: apiResponse.request_account_id,
        PeriodLabel: apiResponse.period_label,
        TotalPosts: apiResponse.total_posts,
        Data: apiResponse.data.map((d) => ({
            Label: d.label,
            Count: d.count,
        })),
    };
};

export const parseGetNewPostStatisticRequest = (request: GetNewPostStatisticRequest): RawGetNewPostStatisticRequest => {
    return {
        period_month: request.PeriodMonth,
        period_year: request.PeriodYear,
        period_label: request.PeriodLabel,
        request_account_id: request.RequestAccountID
    }
};

export const parseGetNewPostStatisticResponse = (json: unknown): GetNewPostStatisticResponse => {
    const transformed = transformedGetNewPostStatisticResponse(json as RawGetNewPostStatisticResponse);
    return safeParse<GetNewPostStatisticResponse>(transformed, isGetNewPostStatisticResponse);
};

export interface GetMediaStatisticRequest {
    RequestAccountID: number;
    PeriodLabel: string;
    PeriodYear: number;
    PeriodMonth: number;
}

interface RawGetMediaStatisticRequest {
    request_account_id: number;
    period_label: string;
    period_year: number;
    period_month: number
}

export interface GetMediaStatisticResponse {
    RequestAccountID: number;
    PeriodLabel: string;
    TotalMedias: number;
    Data: DataTerms[];
}

interface RawGetMediaStatisticResponse {
    request_account_id: number;
    period_label: string;
    total_medias: number;
    data: RawDataTerms[];
}



const isGetMediaStatisticResponse = (data: unknown): data is GetMediaStatisticResponse => {
    if (typeof data !== "object" || data === null) return false;
    const obj = data as GetMediaStatisticResponse;
    return (
        typeof obj.RequestAccountID === "number" &&
        typeof obj.PeriodLabel === "string" &&
        typeof obj.TotalMedias === "number" &&
        Array.isArray(obj.Data) &&
        obj.Data.every(isDataTerms)
    );
};


// ✅ Transform Request (Frontend → API Format)
export const transformedGetMediaStatisticRequest = (
    request: GetMediaStatisticRequest
): RawGetMediaStatisticRequest => {
    return {
        request_account_id: request.RequestAccountID,
        period_month: request.PeriodMonth,
        period_year: request.PeriodYear,
        period_label: request.PeriodLabel,
    };
};

// ✅ Transform Response (API → Frontend Format)
export const transformedGetMediaStatisticResponse = (
    apiResponse: RawGetMediaStatisticResponse
): GetMediaStatisticResponse => {
    return {
        RequestAccountID: apiResponse.request_account_id,
        PeriodLabel: apiResponse.period_label,
        TotalMedias: apiResponse.total_medias,
        Data: apiResponse.data.map((d) => ({
            Label: d.label,
            Count: d.count,
        })),
    };
};

export const parseGetMediaStatisticRequest = (request: GetMediaStatisticRequest): RawGetMediaStatisticRequest => {
    return {
        period_month: request.PeriodMonth,
        period_year: request.PeriodYear,
        period_label: request.PeriodLabel,
        request_account_id: request.RequestAccountID
    }
};

export const parseGetMediaStatisticResponse = (json: unknown): GetMediaStatisticResponse => {
    const transformed = transformedGetMediaStatisticResponse(json as RawGetMediaStatisticResponse);
    return safeParse<GetMediaStatisticResponse>(transformed, isGetMediaStatisticResponse);
};

export interface GetPostWMediaStatisticRequest {
    RequestAccountID: number,
    PeriodLabel: string
    PeriodYear: number
    PeriodMonth: number
}

interface RawGetPostWMediaStatisticRequest {
    request_account_id: number;
    period_label: string;
    period_year: number;
    period_month: number
}

export interface GetPostWMediaStatisticResponse {
    RequestAccountID: number
    TotalPosts: number
    TotalPostWMedias: number
}

interface RawGetPostWMediaStatisticResponse {
    request_account_id: number;
    total_posts: number,
    total_post_w_medias: number
}

export const transformGetPostWMediaStatisticRequest = (request: GetPostWMediaStatisticRequest): RawGetPostWMediaStatisticRequest => {
    return {
        request_account_id: request.RequestAccountID,
        period_label: request.PeriodLabel,
        period_month: request.PeriodMonth,
        period_year: request.PeriodYear
    }
}

export const transformGetPostWMediaStatisticResponse = (response: RawGetPostWMediaStatisticResponse): GetPostWMediaStatisticResponse => {
    return {
        RequestAccountID: response.request_account_id,
        TotalPosts: response.total_posts,
        TotalPostWMedias: response.total_post_w_medias
    }
}

export interface GetReportedPostRequest {
    RequestAccountID: number;
    Page: number;
    PageSize: number;
}

interface RawGetReportedPostRequest {
    request_account_id: number;
    page: number;
    page_size: number;
}

export interface ReportedPostData {
    PostID: number;
    ID: number;
    Reason: string;
    ResolveStatus: string;
}

interface RawReportedPostData {
    post_id: number;
    id: number;
    reason: string;
    resolve_status: string;
}

export interface GetReportedPostResponse {
    ReportedPosts: ReportedPostData[];
    Page: number;
    PageSize: number;
}

interface RawGetReportedPostResponse {
    reported_posts: RawReportedPostData[];
    page: number;
    page_size: number;
}

export const transformGetReportedPostRequest = (
    request: GetReportedPostRequest
): RawGetReportedPostRequest => {
    return {
        request_account_id: request.RequestAccountID,
        page: request.Page,
        page_size: request.PageSize,
    };
};

export const transformReportedPostData = (
    raw: RawReportedPostData
): ReportedPostData => {
    return {
        PostID: raw.post_id,
        ID: raw.id,
        Reason: raw.reason,
        ResolveStatus: raw.resolve_status,
    };
};

export const transformGetReportedPostResponse = (
    apiResponse: RawGetReportedPostResponse
): GetReportedPostResponse => {
    return {
        ReportedPosts: apiResponse.reported_posts.map(transformReportedPostData),
        Page: apiResponse.page,
        PageSize: apiResponse.page_size,
    };
};

export interface CreatePostRequest {
    content: string,
    privacy_status: string,
    is_published_later: string,
    published_later_timestamp: string,
    account_id: string,
    tag_account_ids: string
    images: File[]
}

export interface CreatePostResponse {
    post_id: string,
    media_urls: string[]
}

export interface GetNewFeedRequest {
    account_id: number,
    seen_post_id: number[],
    page: number,
    page_size: number
}

export interface GetNewFeedResponse {
    account_id: number,
    page: number,
    page_size: number,
    posts: DisplayPost[]
}

export interface DisplayPost {
    post_id: number;
    content: string;
    is_shared: boolean;
    share_post_id: number;
    share_post_data: SharePostDataDisplay;
    is_hidden: boolean;
    is_content_edited: boolean;
    privacy_status: string;
    interaction_type: string;
    medias: PostShareMediaDisplay[];
    created_at: number;
    is_published_later: boolean;
    published_later_timestamp: number;
    is_published: boolean;
    reactions: PostReactionDisplay;
    comment_quantity: PostCommentDisplay;
    shares: PostShareDisplay;
    error: string;
    account: SingleAccountInfo;
}

export interface SharePostDataDisplay {
    post_id: number;
    content: string;
    is_content_edited: boolean;
    privacy_status: string;
    created_at: number;
    is_published: boolean;
    medias: PostShareMediaDisplay[];
    account: SingleAccountInfo;
}

export interface PostShareMediaDisplay {
    url: string;
    content: string;
    media_id: number;
}

export interface PostReactionDisplay {
    total_quantity: number;
    reactions: PostReactionData[];
}

export interface PostReactionData {
    reaction_type: string;
    account: SingleAccountInfo;
}

export interface PostCommentDisplay {
    total_quantity: number;
}

export interface PostShareDisplay {
    total_quantity: number;
    shares: PostShareData[];
}

export interface PostShareData {
    account: SingleAccountInfo;
    created_at: number;
}

export interface SingleAccountInfo {
    account_id: number;
    avatar_url: string;
    display_name: string;
}

export interface GetPostCommentReq {
    post_id: number,
    page: number,
    page_size: number
}

export interface GetPostCommentRes {
    post_id: number,
    error: string,
    success: boolean,
    total_comment_number: number
    comments: Comment[]
}

export interface Comment {
    CommentID: number,
    AccountID: number,
    Content: string,
    ReplyFromID: number | null,
    Level: number,
    Replies: Comment[] | null
}