export interface SecurityState {
    token: string;
}

export interface UnregUser {
    email: string;
    password: string;
    confirmPassword: string;
    emailPreferences: boolean;
    phone: string;
    name: UserName;
}

export interface SignInUser {
    email: string;
    password: string;
}

export interface UserName {
    last: string;
    first: string;
}

export interface SignInInfo {
    refreshExpiredIn: string;
    refreshExpiredLife: string;
    refreshToken: string;
    status: string;
    token: string;
    tokenExpiredLife: string;
    tokenExpiredIn: string;
}

export type AuthStatus = 'loading' | 'success' | 'error' | 'none';

export enum AuthStatuses {
    AUTH_REQUESTED = 'loading',
    AUTH_ERROR = 'error',
    AUTH_SUCCESS = 'success',
    NONE = 'none',
}
