export interface GetNewRegisterationDataRequest {
    RequestAccountID: number;
    PeriodLabel: string;
    PeriodYear: number;
    PeriodMonth: number;
}

interface RawGetNewRegisterationDataRequest {
    request_account_id: number;
    period_label: string;
    period_year: number;
    period_month: number
}

export interface GetNewRegisterationDataResponse {
    RequestAccountID: number;
    PeriodLabel: string;
    TotalUsers: number;
    Data: DataTerms[];
}

interface RawGetNewRegisterationDataResponse {
    request_account_id: number;
    period_label: string;
    total_users: number;
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

const isGetNewRegisterationDataResponse = (data: unknown): data is GetNewRegisterationDataResponse => {
    if (typeof data !== "object" || data === null) return false;
    const obj = data as GetNewRegisterationDataResponse;
    return (
        typeof obj.RequestAccountID === "number" &&
        typeof obj.PeriodLabel === "string" &&
        typeof obj.TotalUsers === "number" &&
        Array.isArray(obj.Data) &&
        obj.Data.every(isDataTerms)
    );
};


// ✅ Transform Request (Frontend → API Format)
export const transformedGetNewRegisterationDataRequest = (
    request: GetNewRegisterationDataRequest
): RawGetNewRegisterationDataRequest => {
    return {
        request_account_id: request.RequestAccountID,
        period_month: request.PeriodMonth,
        period_year: request.PeriodYear,
        period_label: request.PeriodLabel,
    };
};

// ✅ Transform Response (API → Frontend Format)
export const transformedGetNewRegisterationDataResponse = (
    apiResponse: RawGetNewRegisterationDataResponse
): GetNewRegisterationDataResponse => {
    return {
        RequestAccountID: apiResponse.request_account_id,
        PeriodLabel: apiResponse.period_label,
        TotalUsers: apiResponse.total_users,
        Data: apiResponse.data.map((d) => ({
            Label: d.label,
            Count: d.count,
        })),
    };
};

export const parseGetNewRegisterationDataRequest = (request: GetNewRegisterationDataRequest): RawGetNewRegisterationDataRequest => {
    return {
        period_month: request.PeriodMonth,
        period_year: request.PeriodYear,
        period_label: request.PeriodLabel,
        request_account_id: request.RequestAccountID
    }
};

export const parseGetNewRegisterationDataResponse = (json: unknown): GetNewRegisterationDataResponse => {
    const transformed = transformedGetNewRegisterationDataResponse(json as RawGetNewRegisterationDataResponse);
    return safeParse<GetNewRegisterationDataResponse>(transformed, isGetNewRegisterationDataResponse);
};

export interface GetUserTypeRequest {
    RequestAccountID: number;
}

interface RawGetUserTypeRequest {
    request_account_id: number;
}

export interface GetUserTypeResponse {
    RequestAccountID: number;
    TotalUsers: number;
    BannedUsers: number;
    DeletedUsers: number;
}

interface RawGetUserTypeResponse {
    request_account_id: number;
    total_users: number;
    banned_users: number;
    deleted_users: number;
}

// ✅ Transform Request (Frontend → API Format)
export const transformedGetUserTypeRequest = (
    request: GetUserTypeRequest
): RawGetUserTypeRequest => {
    return {
        request_account_id: request.RequestAccountID,
    };
};

// ✅ Transform Response (API → Frontend Format)
export const transformedGetUserTypeResponse = (
    apiResponse: RawGetUserTypeResponse
): GetUserTypeResponse => {
    return {
        RequestAccountID: apiResponse.request_account_id,
        TotalUsers: apiResponse.total_users,
        BannedUsers: apiResponse.banned_users,
        DeletedUsers: apiResponse.deleted_users,
    };
};

// ✅ Validator Functions
const isGetUserTypeResponse = (data: unknown): data is GetUserTypeResponse => {
    if (typeof data !== "object" || data === null) return false;
    const obj = data as GetUserTypeResponse;
    return (
        typeof obj.RequestAccountID === "number" &&
        typeof obj.TotalUsers === "number" &&
        typeof obj.BannedUsers === "number" &&
        typeof obj.DeletedUsers === "number"
    );
};

// ✅ Safe Parsing
export const parseGetUserTypeResponse = (json: unknown): GetUserTypeResponse => {
    const transformed = transformedGetUserTypeResponse(json as RawGetUserTypeResponse);
    return safeParse<GetUserTypeResponse>(transformed, isGetUserTypeResponse);
};

export const parseGetUserTypeRequest = (request: GetUserTypeRequest): RawGetUserTypeRequest => {
    return {
        request_account_id: request.RequestAccountID
    };
}

// ✅ Request Interfaces
export interface GetAccountListRequest {
    RequestID: number;
    Page: number;
    PageSize: number;
}

interface RawGetAccountListRequest {
    request_id: number;
    page: number;
    page_size: number;
}

// ✅ Response Interfaces
export interface AccountRawInfo {
    AccountID: number;
    Username: string;
    IsBanned: boolean;
    Method: string;
    IsSelfDeleted: boolean;
}

interface RawAccountRawInfo {
    account_id: number;
    username: string;
    is_banned: boolean;
    method: string;
    is_self_deleted: boolean;
}

export interface GetAccountListResponse {
    Accounts: AccountRawInfo[];
    Page: number;
    PageSize: number;
}

interface RawGetAccountListResponse {
    accounts: RawAccountRawInfo[];
    page: number;
    page_size: number;
}

export const transformGetAccountListRequest = (
    request: GetAccountListRequest
): RawGetAccountListRequest => {
    return {
        request_id: request.RequestID,
        page: request.Page,
        page_size: request.PageSize,
    };
};


export const transformAccountRawInfo = (raw: RawAccountRawInfo): AccountRawInfo => {
    return {
        AccountID: raw.account_id,
        Username: raw.username,
        IsBanned: raw.is_banned,
        Method: raw.method,
        IsSelfDeleted: raw.is_self_deleted,
    };
};

// ✅ Transform Response (API → Frontend Format)
export const transformGetAccountListResponse = (
    apiResponse: RawGetAccountListResponse
): GetAccountListResponse => {
    return {
        Accounts: apiResponse.accounts.map(transformAccountRawInfo),
        Page: apiResponse.page,
        PageSize: apiResponse.page_size,
    };
};

export interface SearchAccountListRequest {
    RequestID: number;
    Page: number;
    PageSize: number;
    QueryString: string
}

interface RawSearchAccountListRequest {
    request_id: number;
    page: number;
    page_size: number;
    query_string: string
}

export const transformSeachAccountListRequest = (
    request: SearchAccountListRequest
): RawSearchAccountListRequest => {
    return {
        request_id: request.RequestID,
        page: request.Page,
        page_size: request.PageSize,
        query_string: request.QueryString
    };
};

// ✅ Request Interfaces
export interface ResolveBanUserRequest {
    AccountID: number;
    Action: string;
}

interface RawResolveBanUserRequest {
    account_id: number;
    action: string;
}

// ✅ Response Interfaces
export interface ResolveBanUserResponse {
    Success: boolean;
}

interface RawResolveBanUserResponse {
    success: boolean;
}

// ✅ Transform Request (Frontend → API Format)
export const transformResolveBanUserRequest = (
    request: ResolveBanUserRequest
): RawResolveBanUserRequest => {
    return {
        account_id: request.AccountID,
        action: request.Action,
    };
};

// ✅ Transform Response (API → Frontend Format)
export const transformResolveBanUserResponse = (
    apiResponse: RawResolveBanUserResponse
): ResolveBanUserResponse => {
    return {
        Success: apiResponse.success,
    };
};

export interface GetReportedAccountListRequest {
    RequestAccountID: number;
    Page: number;
    PageSize: number;
}

interface RawGetReportedAccountListRequest {
    request_account_id: number;
    page: number;
    page_size: number;
}

export interface ReportAccountData {
    AccountID: number;
    Username: string;
    Reason: string;
    ResolveStatus: string;
}

interface RawReportAccountData {
    account_id: number;
    username: string;
    reason: string;
    resolve_status: string;
}

export interface GetReportedAccountListResponse {
    Accounts: ReportAccountData[];
    Page: number;
    PageSize: number;
}

interface RawGetReportedAccountListResponse {
    accounts: RawReportAccountData[];
    page: number;
    page_size: number;
}

export const transformGetReportedAccountListRequest = (
    request: GetReportedAccountListRequest
): RawGetReportedAccountListRequest => {
    return {
        request_account_id: request.RequestAccountID,
        page: request.Page,
        page_size: request.PageSize,
    };
};

export const transformReportAccountData = (
    raw: RawReportAccountData
): ReportAccountData => {
    return {
        AccountID: raw.account_id,
        Username: raw.username,
        Reason: raw.reason,
        ResolveStatus: raw.resolve_status,
    };
};

export const transformGetReportedAccountListResponse = (
    apiResponse: RawGetReportedAccountListResponse
): GetReportedAccountListResponse => {
    return {
        Accounts: apiResponse.accounts.map(transformReportAccountData),
        Page: apiResponse.page,
        PageSize: apiResponse.page_size,
    };
};
