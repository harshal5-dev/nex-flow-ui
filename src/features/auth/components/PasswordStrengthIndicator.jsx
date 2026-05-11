import { IconCheck, IconX } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import {
  getPasswordRequirementResults,
  getPasswordStrengthStyles,
} from "../lib/passwordStrength";

const PasswordStrengthIndicator = ({
  passwordValue = "",
  showRequirements = true,
  className,
}) => {
  const strengthStyles = getPasswordStrengthStyles(passwordValue);
  const requirementResults = getPasswordRequirementResults(passwordValue);

  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-muted/35 p-3",
        className
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-foreground/90">Password strength</p>
        <p className={cn("text-xs font-semibold", strengthStyles.textClassName)}>
          {strengthStyles.text}
        </p>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-background">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            strengthStyles.bar
          )}
        />
      </div>

      {showRequirements && (
        <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {requirementResults.map((requirement) => (
            <li
              key={requirement.id}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors",
                requirement.isMet ? "text-success" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "inline-flex size-4 items-center justify-center rounded-full border",
                  requirement.isMet
                    ? "border-success/40 bg-success/10"
                    : "border-border/70 bg-background"
                )}
              >
                {requirement.isMet ? (
                  <IconCheck className="size-2.5" />
                ) : (
                  <IconX className="size-2.5 text-muted-foreground/80" />
                )}
              </span>
              {requirement.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
