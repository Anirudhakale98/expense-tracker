const API_SECRET =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_SECRET
    : undefined;

export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options?.headers ?? {}),
  };
  if (API_SECRET) {
    (headers as Record<string, string>)["x-api-secret"] = API_SECRET;
  }

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Request failed");
  }
  return data as T;
}
