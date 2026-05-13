export function validatePassword(password: string): string | null {
  const atLeastOneUpperCaseRegex = /[A-Z]/;
  const atLeastOneNumberRegex = /[0-9]/;
  const atLeastOneSpecialCharRegex = /[^a-zA-Z0-9]/;

  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!atLeastOneUpperCaseRegex.test(password)) return "Password must contain at least one uppercase letter.";
  if (!atLeastOneNumberRegex.test(password)) return "Password must contain at least one number.";
  if (!atLeastOneSpecialCharRegex.test(password)) return "Password must contain at least one special character";

  return null;
}