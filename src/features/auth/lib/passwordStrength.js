export const PASSWORD_REQUIREMENTS = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (value) => value.length >= 8,
  },
  {
    id: "uppercase",
    label: "At least one uppercase letter",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: "number",
    label: "At least one number",
    test: (value) => /\d/.test(value),
  },
  {
    id: "special",
    label: "At least one special character",
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
];

export const getPasswordRequirementResults = (passwordValue = "") =>
  PASSWORD_REQUIREMENTS.map((requirement) => ({
    ...requirement,
    isMet: requirement.test(passwordValue),
  }));

export const getPasswordStrengthScore = (passwordValue = "") =>
  getPasswordRequirementResults(passwordValue).reduce(
    (count, requirement) => count + (requirement.isMet ? 1 : 0),
    0
  );

export const isStrongPassword = (passwordValue = "") =>
  getPasswordStrengthScore(passwordValue) === PASSWORD_REQUIREMENTS.length;

export const getPasswordStrengthStyles = (passwordValue = "") => {
  const score = getPasswordStrengthScore(passwordValue);

  if (score <= 1) {
    return {
      bar: "w-1/4 bg-destructive",
      text: "Weak password",
      textClassName: "text-destructive",
    };
  }

  if (score <= 2) {
    return {
      bar: "w-2/4 bg-warning",
      text: "Needs improvement",
      textClassName: "text-warning-foreground",
    };
  }

  if (score === 3) {
    return {
      bar: "w-3/4 bg-info",
      text: "Almost there",
      textClassName: "text-info",
    };
  }

  return {
    bar: "w-full bg-success",
    text: "Strong password",
    textClassName: "text-success",
  };
};
