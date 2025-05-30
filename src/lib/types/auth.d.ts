type AuthState = {
    success?: boolean;
    message?: string;
    errors?: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        form?: string;
    };
};