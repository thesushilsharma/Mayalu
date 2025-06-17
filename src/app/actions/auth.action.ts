"use server";

import { APP_URL } from "@/lib/contants";
import { loginLimiter, signupLimiter } from "@/lib/RateLimiter/limiter";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  signUpSchema,
} from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function loginAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  // Check rate limit
  if (!(await loginLimiter.removeTokens(1))) {
    return { errors: { form: 'Too many login attempts. Please try again later.' } };
  }

  try {
    const validatedFields = loginSchema.safeParse(Object.fromEntries(formData));
    
    if (!validatedFields.success) {
      const flatErrors = validatedFields.error.flatten().fieldErrors;
    
      const simplifiedErrors: AuthState["errors"] = Object.fromEntries(
        Object.entries(flatErrors).map(([key, value]) => [key, value?.[0]])
      );
    
      return { errors: simplifiedErrors };
    }   

    const { email, password } = validatedFields.data;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const errorMessages: Record<string, string> = {
        'Invalid login credentials': 'Invalid email or password.',
        'Email not confirmed': 'Please verify your email address.',
        'Too many requests': 'Too many attempts. Please wait and try again.',
        'User not found': 'No account found with this email.',
      };

      return {
        errors: { form: errorMessages[error.message] || 'Login failed. Please try again.' },
      };
    }

    revalidatePath('/', 'layout');
    redirect('/account/profile');
  } catch (error: any) {
    if (error?.digest?.includes('NEXT_REDIRECT')) throw error;
    
    return {
      errors: { 
        form: error.message?.includes('fetch') 
          ? 'Network error. Please check your connection.'
          : 'An unexpected error occurred.'
      },
    };
  }
}

export async function signUpAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!(await signupLimiter.removeTokens(1))) {
    return { errors: { form: 'Too many signup attempts. Please try again later.' } };
  }

  try {
    const validatedFields = signUpSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
      const flatErrors = validatedFields.error.flatten().fieldErrors;
    
      const simplifiedErrors: AuthState["errors"] = Object.fromEntries(
        Object.entries(flatErrors).map(([key, value]) => [key, value?.[0]])
      );
    
      return { errors: simplifiedErrors };
    }
    

    const { givenName,familyName, email, password } = validatedFields.data;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          givenName,
          familyName,
        },
      },
    });

    if (error) {
      return {
        errors: { form: error.message },
      };
    }

    if (data.user?.identities?.length === 0) {
      return {
        errors: { form: 'Email already exists. Please sign in or check your email for confirmation.' },
      };
    }

    if (data.user && !data.user.email_confirmed_at) {
      revalidatePath('/', 'layout');
      redirect('/auth/sign-up-success');
    }

    return { success: true, message: 'Sign-up successful.' };
  } catch (error: any) {
    if (error?.digest?.includes('NEXT_REDIRECT')) throw error;
    
    return {
      errors: { 
        form: error.message?.includes('fetch') 
          ? 'Network error. Please check your connection.'
          : 'An unexpected error occurred.'
      },
    };
  }
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
