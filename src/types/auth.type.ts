export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginWithGoogleRequest {
    email: string,
    display_name: string,
    photoU_url: string,
    auth_code: string,
}

export interface JWTClaims {
    accountId: string;
    permissions: string[];
    roleId: string;
    issuer: string;
    subject: string;
    audience: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    userId: string;
    jwtClaims?: JWTClaims;
    success: boolean;
}

const safeParse = <T>(json: unknown, validator: (data: unknown) => data is T): T => {
    if (!validator(json)) {
        throw new Error("Invalid response format");
    }
    return json;
};

const isJWTClaims = (data: unknown): data is JWTClaims => {
    if (typeof data !== "object" || data === null) return false;
    const obj = data as JWTClaims;
    return (
        typeof obj.accountId === "string" &&
        Array.isArray(obj.permissions) &&
        obj.permissions.every((perm) => typeof perm === "string") &&
        typeof obj.roleId === "string" &&
        typeof obj.issuer === "string" &&
        typeof obj.subject === "string" &&
        typeof obj.audience === "string"
    );
};

const isLoginResponse = (data: unknown): data is LoginResponse => {
    if (typeof data !== "object" || data === null) return false;
    const obj = data as LoginResponse;
    return (
        typeof obj.accessToken === "string" &&
        typeof obj.refreshToken === "string" &&
        typeof obj.userId === "string" &&
        (obj.jwtClaims === undefined || isJWTClaims(obj.jwtClaims)) &&
        typeof obj.success === "boolean"
    );
};


interface RawLoginResponse {
    access_token: string;
    refresh_token: string;
    user_id: string;
    jwt_claims?: JWTClaims;
    success: boolean;
}


const transformLoginResponse = (apiResponse: RawLoginResponse): LoginResponse => {
    return {
        accessToken: apiResponse.access_token,
        refreshToken: apiResponse.refresh_token,
        userId: apiResponse.user_id,
        jwtClaims: apiResponse.jwt_claims,
        success: apiResponse.success,
    };
};


export const parseLoginResponse = (json: unknown): LoginResponse => {
    const transformedResponse = transformLoginResponse(json as RawLoginResponse);
    return safeParse<LoginResponse>(transformedResponse, isLoginResponse);
};


export const parseJWTClaims = (json: unknown): JWTClaims => {
    return safeParse<JWTClaims>(json, isJWTClaims);
};