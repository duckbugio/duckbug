export type LoginCredentials = {
    email: string;
    password: string;
};

export type SignupCredentials = {
    email: string;
    password: string;
};

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
};

export type SignupResponse = {
    success: boolean;
};
