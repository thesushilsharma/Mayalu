"use client";

import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        setIsSubmitting(false);
        return;
      }

      toast.success("Login successful!");
      router.push("/account/dashboard");
      router.refresh();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "An error occurred during login",
      );
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/account/dashboard",
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
          title="Google sign-in is disabled for now"
        >
          <Button
            type="button"
            variant="outline"
            disabled
            onClick={handleGoogleSignIn}
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
              or sign in with email
            </span>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold text-foreground flex items-center justify-between"
            >
              <span>Email address</span>
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
                className="h-11 pl-10 rounded-2xl border-border/80 bg-background/60 focus-visible:ring-rose-500 focus-visible:border-rose-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-foreground"
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-rose-500 hover:text-rose-600 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="h-11 pl-10 pr-10 rounded-2xl border-border/80 bg-background/60 focus-visible:ring-rose-500 focus-visible:border-rose-500"
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
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-bold shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in to Mayalu</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <div className="mt-6 text-center text-xs text-muted-foreground pt-2">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/auth/sign-up"
              className="font-bold text-rose-500 hover:text-rose-600 transition-colors underline underline-offset-4"
            >
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
