"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState } from "react";
import { signUpAction } from "@/app/actions/auth.action";
import { CheckCircle2, XCircle } from "lucide-react";
import { useDebounce } from "use-debounce";
import {
  doPasswordsMatch,
  validatePasswordStrength,
} from "@/lib/validations/authHelper";

const initialState: AuthState = { errors: {} };

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState
  );
  const [formValues, setFormValues] = useState({
    givenName: "",
    familyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [debouncedPassword] = useDebounce(formValues.password, 300);
  const [debouncedConfirmPassword] = useDebounce(
    formValues.confirmPassword,
    300
  );
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
    setPasswordValidation(validatePasswordStrength(debouncedPassword));
    setPasswordsMatch(
      doPasswordsMatch(debouncedPassword, debouncedConfirmPassword)
    );
  }, [debouncedPassword, debouncedConfirmPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="givenName">Given Name</Label>
                <Input
                  id="givenName"
                  type="text"
                  name="givenName"
                  placeholder="John"
                  value={formValues.givenName}
                  onChange={handleChange}
                  required
                  aria-invalid={!!state.errors?.givenName}
                  aria-describedby={
                    state.errors?.givenName ? "givenName-error" : undefined
                  }
                />
                {state.errors?.givenName && (
                  <p id="givenName-error" className="text-sm text-red-500">
                    {state.errors.givenName[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="familyName">Family Name</Label>
                <Input
                  id="familyName"
                  type="text"
                  name="familyName"
                  placeholder="Doe"
                  value={formValues.familyName}
                  onChange={handleChange}
                  required
                  aria-invalid={!!state.errors?.familyName}
                  aria-describedby={
                    state.errors?.familyName ? "familyName-error" : undefined
                  }
                />
                {state.errors?.familyName && (
                  <p id="familyName-error" className="text-sm text-red-500">
                    {state.errors.familyName[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                  aria-invalid={!!state.errors?.email}
                  aria-describedby={
                    state.errors?.email ? "email-error" : undefined
                  }
                />
                {state.errors?.email && (
                  <p id="email-error" className="text-sm text-red-500">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  className={cn(
                    formValues.password &&
                      (passwordValidation.isValid
                        ? "border-green-500 focus-visible:ring-green-500"
                        : "border-red-500 focus-visible:ring-red-500")
                  )}
                  required
                  aria-invalid={!!state.errors?.password}
                  aria-describedby={
                    state.errors?.password ? "password-error" : undefined
                  }
                />
                {state.errors?.password && (
                  <p id="password-error" className="text-sm text-red-500">
                    {state.errors.password[0]}
                  </p>
                )}
                {formValues.password && (
                  <div className="mt-2 space-y-2 text-sm">
                    <p className="font-medium">Password must:</p>
                    <ul className="space-y-1 pl-2">
                      {[
                        {
                          check: passwordValidation.results.minLength,
                          text: "Be at least 12 characters",
                        },
                        {
                          check: passwordValidation.results.maxLength,
                          text: "Be at most 64 characters",
                        },
                        {
                          check: passwordValidation.results.hasUppercase,
                          text: "Include uppercase letter",
                        },
                        {
                          check: passwordValidation.results.hasLowercase,
                          text: "Include lowercase letter",
                        },
                        {
                          check: passwordValidation.results.hasNumber,
                          text: "Include number",
                        },
                        {
                          check: passwordValidation.results.hasSpecialChar,
                          text: "Include special character",
                        },
                      ].map(({ check, text }) => (
                        <li
                          key={text}
                          className={cn(
                            "flex items-center gap-2",
                            check ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {check ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formValues.confirmPassword}
                    onChange={handleChange}
                    className={cn(
                      formValues.confirmPassword &&
                        (passwordsMatch
                          ? "border-green-500 focus-visible:ring-green-500"
                          : "border-red-500 focus-visible:ring-red-500")
                    )}
                    required
                    aria-invalid={!!state.errors?.confirmPassword}
                    aria-describedby={
                      state.errors?.confirmPassword
                        ? "confirm-password-error"
                        : undefined
                    }
                  />
                  {formValues.confirmPassword && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {passwordsMatch ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {((formValues.confirmPassword && !passwordsMatch) ||
                  state.errors?.confirmPassword) && (
                  <p
                    id="confirm-password-error"
                    className="text-sm text-red-500"
                  >
                    {state.errors?.confirmPassword?.[0] ||
                      "Passwords need to match"}
                  </p>
                )}
              </div>
              {state.errors?.form && (
                <p className="text-sm text-red-500">{state.errors.form}</p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={
                  isPending || !passwordValidation.isValid || !passwordsMatch
                }
              >
                {isPending ? "Creating account..." : "Sign Up"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
