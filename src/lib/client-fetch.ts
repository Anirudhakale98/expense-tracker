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

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register") {
        window.location.href = `/login?from=${encodeURIComponent(path)}`;
      }
    }
    throw new Error(data.error ?? "Request failed");
  }
  return data as T;
}
