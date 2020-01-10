
export interface User {
    id: string;
    password: string;
    email: string;
    isAdmin: boolean;
    emailPreferences: boolean;
    activated: boolean;
    name: UserName;
}

export interface Session {
    id: string;
    userAgent: string;
    ip: string;
    createdAt: string;
    lastActionAt: string;
}

interface UserName {
    last: string;
    first: string;
}
