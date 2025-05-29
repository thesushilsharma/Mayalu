type LoginState = {
    success?: boolean;
    message?: string;
    errors?: {
        email?: string[];
        password?: string[];
        form?: string;
    };
};