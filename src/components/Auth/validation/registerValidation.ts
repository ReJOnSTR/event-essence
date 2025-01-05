export const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
};

export const FIELD_RULES = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    required: true,
    pattern: /\S+@\S+\.\S+/,
  },
  phoneNumber: {
    required: true,
    pattern: /^05[0-9]{9}$/,
  },
  teachingSubjects: {
    required: true,
    minItems: 1,
  },
};

export const validatePassword = (password: string) => {
  if (password.length < PASSWORD_RULES.minLength) {
    return `Şifre en az ${PASSWORD_RULES.minLength} karakter olmalıdır`;
  }
  if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
    return "Şifre en az bir büyük harf içermelidir";
  }
  if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
    return "Şifre en az bir küçük harf içermelidir";
  }
  if (PASSWORD_RULES.requireNumber && !/\d/.test(password)) {
    return "Şifre en az bir rakam içermelidir";
  }
  if (PASSWORD_RULES.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Şifre en az bir özel karakter içermelidir";
  }
  return "";
};