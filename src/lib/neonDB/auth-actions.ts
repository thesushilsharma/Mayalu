"use server"
export async function sendEmailVerificationAction() { return { success: true }; }
export async function resendEmailVerificationAction() { return { success: true }; }
export async function verifyEmailAction(oobCode: string) { return { success: true }; }
export async function changePasswordAction(formData: FormData) { return { success: true }; }
export async function updatePasswordAction(formData: FormData) { return { success: true }; }
export async function forgotPasswordAction(prevState: any, formData: FormData) { return { success: true }; }