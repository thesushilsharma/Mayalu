"use client";

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { validatePasswordStrength } from "@/lib/validations/authHelper";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    givenName: "",
    familyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    results: {
      minLength: false,
      maxLength: true,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecialChar: false,
    },
  });

  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    setPasswordValidation(validatePasswordStrength(formData.password));
    setPasswordsMatch(
      formData.password === formData.confirmPassword &&
        formData.password.length > 0,
    );
  }, [formData.password, formData.confirmPassword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.givenName} ${formData.familyName}`.trim(),
      });

      if (error) {
        toast.error(error.message || "Failed to create account");
        setIsSubmitting(false);
        return;
      }

      toast.success(
        "Account created! Please enter the 6-digit verification code sent to your email.",
      );
      setIsSubmitting(false);
      router.push(
        `/auth/verify-email?email=${encodeURIComponent(formData.email)}`,
      );
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/account/onboarding",
      });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Google sign in error");
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="rounded-3xl border border-border/80 bg-card/85 dark:bg-card/75 backdrop-blur-2xl shadow-2xl shadow-rose-500/10 p-6 sm:p-8">
        {/* Trakt-style Google Sign In (Disabled for now) */}
        <div
          className="mb-5 cursor-not-allowed"
          title="Google sign-up is disabled for now"
        >
          <Button
            type="button"
            variant="outline"
            disabled
            onClick={handleGoogleSignUp}
            className="w-full h-11 rounded-2xl border-border/60 bg-muted/40 text-muted-foreground/60 font-semibold text-xs flex items-center justify-center gap-2.5 cursor-not-allowed opacity-50 grayscale hover:bg-muted/40 pointer-events-none select-none"
          >
            <svg
              className="w-4 h-4 opacity-50 grayscale"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Google logo"
            >
              <title>Google</title>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84Z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
              />
            </svg>
            <span>Continue with Google</span>
            <span className="text-[10px] font-normal text-muted-foreground/60 border border-border/50 rounded-md px-1.5 py-0.5 ml-1 bg-muted/50">
              Coming Soon
            </span>
          </Button>
        </div>

        {/* Trakt-style Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-card/90 px-3 text-muted-foreground font-semibold">
              or register with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="givenName"
                className="text-xs font-semibold text-foreground"
              >
                First name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  id="givenName"
                  name="givenName"
                  placeholder="Aarav"
                  required
                  autoComplete="given-name"
                  value={formData.givenName}
                  onChange={handleInputChange}
                  className="h-11 pl-9 rounded-2xl border-border/80 bg-background/60 focus-visible:ring-rose-500 focus-visible:border-rose-500 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="familyName"
                className="text-xs font-semibold text-foreground"
              >
                Last name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  id="familyName"
                  name="familyName"
                  placeholder="Sharma"
                  required
                  autoComplete="family-name"
                  value={formData.familyName}
                  onChange={handleInputChange}
                  className="h-11 pl-9 rounded-2xl border-border/80 bg-background/60 focus-visible:ring-rose-500 focus-visible:border-rose-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold text-foreground"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className="h-11 pl-10 rounded-2xl border-border/80 bg-background/60 focus-visible:ring-rose-500 focus-visible:border-rose-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-foreground"
            >
              Create password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 12 characters"
                required
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
                className={cn(
                  "h-11 pl-10 pr-10 rounded-2xl border-border/80 bg-background/60 focus-visible:ring-rose-500 focus-visible:border-rose-500",
                  formData.password &&
                    (passwordValidation.isValid
                      ? "border-emerald-500/80 focus-visible:ring-emerald-500"
                      : "border-rose-500/70 focus-visible:ring-rose-500"),
                )}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Password Validation Checklist */}
            {formData.password && (
              <div className="p-3 rounded-2xl bg-muted/30 border border-border/60 space-y-2 mt-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                  <span>Password strength</span>
                  <span
                    className={
                      passwordValidation.isValid
                        ? "text-emerald-500 font-bold"
                        : "text-rose-500 font-bold"
                    }
                  >
                    {passwordValidation.isValid ? "Strong ✨" : "Incomplete"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <span
                    className={cn(
                      "flex items-center gap-1",
                      passwordValidation.results.minLength
                        ? "text-emerald-500"
                        : "text-muted-foreground",
                    )}
                  >
                    {passwordValidation.results.minLength ? "✓" : "○"} 12+
                    characters
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-1",
                      passwordValidation.results.hasUppercase
                        ? "text-emerald-500"
                        : "text-muted-foreground",
                    )}
                  >
                    {passwordValidation.results.hasUppercase ? "✓" : "○"} One
                    uppercase
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-1",
                      passwordValidation.results.hasNumber
                        ? "text-emerald-500"
                        : "text-muted-foreground",
                    )}
                  >
                    {passwordValidation.results.hasNumber ? "✓" : "○"} One
                    number
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-1",
                      passwordValidation.results.hasSpecialChar
                        ? "text-emerald-500"
                        : "text-muted-foreground",
                    )}
                  >
                    {passwordValidation.results.hasSpecialChar ? "✓" : "○"}{" "}
                    Special char
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-semibold text-foreground"
            >
              Confirm password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                required
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={cn(
                  "h-11 pl-10 pr-16 rounded-2xl border-border/80 bg-background/60 focus-visible:ring-rose-500 focus-visible:border-rose-500",
                  formData.confirmPassword &&
                    (passwordsMatch
                      ? "border-emerald-500/80 focus-visible:ring-emerald-500"
                      : "border-rose-500/70 focus-visible:ring-rose-500"),
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {formData.confirmPassword && (
                  <span>
                    {passwordsMatch ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-500" />
                    )}
                  </span>
                )}
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {formData.confirmPassword && !passwordsMatch && (
              <p className="text-[11px] text-rose-500 mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-bold shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
            disabled={
              isSubmitting || !passwordValidation.isValid || !passwordsMatch
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating your account...</span>
              </>
            ) : (
              <>
                <span>Create Mayalu Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          {/* Switch to login */}
          <div className="mt-6 text-center text-xs text-muted-foreground pt-2">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-bold text-rose-500 hover:text-rose-600 transition-colors underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
