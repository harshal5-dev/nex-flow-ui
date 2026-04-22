import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const DEFAULT_ERROR_MESSAGE = "An error occurred, please try again.";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getApiErrorDetails = (
  error,
  fallbackMessage = DEFAULT_ERROR_MESSAGE
) => {
  const source =
    error && (error.status !== undefined || error.data) ? error : error?.error;

  const status = source?.status ?? error?.status ?? null;
  const data =
    source?.data && typeof source.data === "object" ? source.data : {};

  const validationErrors =
    data.validationErrors ?? data.errors ?? source?.validationErrors ?? null;

  const message =
    data.message || source?.message || error?.message || fallbackMessage;

  return {
    status,
    message,
    validationErrors,
    path: data.path || "",
  };
};

export const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8081/api/v1",
  credentials: "include",
});

export const baseQuery = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // Normalize error shape
  if (result?.error) {
    const normalizedError = getApiErrorDetails(result.error);

    result.error = {
      status: normalizedError.status,
      data: {
        message: normalizedError.message,
        validationErrors: normalizedError.validationErrors,
        path: normalizedError.path,
      },
    };
  }

  return result;
};
