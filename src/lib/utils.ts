import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFirstName(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Parent";
  }

  return trimmed.split(/\s+/)[0] ?? "Parent";
}

export function formatDisplayDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function safeRedirect(target: string | null | undefined, fallback: string) {
  if (!target || !target.startsWith("/")) {
    return fallback;
  }

  return target;
}
