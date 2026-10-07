import Link from "next/link";
import type { ComponentProps } from "react";
import styles from "./ui.module.css";

type Variant = "solid" | "outline";

function classes(variant: Variant, small?: boolean, extra?: string) {
  return [styles.button, styles[variant], small && styles.small, extra].filter(Boolean).join(" ");
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; small?: boolean };

export function ButtonLink({ variant = "solid", small, className, ...props }: ButtonLinkProps) {
  return <Link className={classes(variant, small, className)} {...props} />;
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; small?: boolean };

export function Button({ variant = "solid", small, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={classes(variant, small, className)} {...props} />;
}
