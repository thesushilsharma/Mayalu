export function validatePasswordStrength(password: string) {
    return {
      isValid: Object.values({
        minLength: password.length >= 12,
        maxLength: password.length <= 64,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*()]/.test(password),
      }).every(Boolean),
      results: {
        minLength: password.length >= 12,
        maxLength: password.length <= 64,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*()]/.test(password),
      },
    };
  }
  
  export function doPasswordsMatch(password: string, confirmPassword: string) {
    return password === confirmPassword && password.length > 0;
  }