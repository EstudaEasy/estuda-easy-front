import axios from "axios";

function normalizeMessage(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0);

    if (parts.length > 0) return parts.join("\n");
  }

  if (typeof value === "object") {
    const maybeObj = value as Record<string, unknown>;

    const nestedMessage =
      normalizeMessage(maybeObj.message) ||
      normalizeMessage(maybeObj.error) ||
      normalizeMessage(maybeObj.detail) ||
      normalizeMessage(maybeObj.details);

    if (nestedMessage) return nestedMessage;
  }

  return null;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Ocorreu um erro inesperado. Tente novamente.",
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    const apiMessage =
      normalizeMessage(data) ||
      normalizeMessage((data as Record<string, unknown> | undefined)?.message) ||
      normalizeMessage((data as Record<string, unknown> | undefined)?.error);

    if (apiMessage) return apiMessage;

    if (error.response?.status === 401) {
      return "Sua sessão expirou. Faça login novamente.";
    }
  }

  if (error instanceof Error) {
    const directMessage = normalizeMessage(error.message);
    if (directMessage) return directMessage;
  }

  return fallback;
}
