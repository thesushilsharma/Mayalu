import { z } from "zod"

// Strong password validation schema
const strongPasswordSchema = z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(64, "Password must be at most 64 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(/[!@#$%^&*()]/, "Password must include at least one special character")

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
})

export const signUpSchema = z
    .object({
        email: z.string().email("Please enter a valid email address"),
        password: strongPasswordSchema,
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords need to match",
        path: ["confirmPassword"],
    })

export const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

export const updatePasswordSchema = z.object({
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords need to match",
        path: ["confirmPassword"],
    })

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: strongPasswordSchema,
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords need to match",
        path: ["confirmPassword"],
    })

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignUpFormValues = z.infer<typeof signUpSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

// Helper function to validate password strength
export function validatePasswordStrength(password: string) {
    const results = {
        minLength: password.length >= 12,
        maxLength: password.length <= 64,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*()]/.test(password),
    }

    const isValid = Object.values(results).every(Boolean)

    return {
        isValid,
        results,
    }
}

// Helper function to check if passwords match
export function doPasswordsMatch(password: string, confirmPassword: string) {
    return password === confirmPassword && password.length > 0
}
