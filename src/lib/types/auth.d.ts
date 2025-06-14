type AuthState = {
    success?: boolean;
    message?: string;
    errors?: {
        givenName?: string[];
        familyName?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        form?: string;
    };
};