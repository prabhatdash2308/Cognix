import type { HTMLAttributes } from "react";

export type CardVariant = "default" | "elevated" | "outline" | "ghost";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  /** Remove all internal padding */
  noPadding?: boolean;
  /** Add hover lift effect */
  interactive?: boolean;
}

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;
export type CardBodyProps = HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = HTMLAttributes<HTMLDivElement>;
