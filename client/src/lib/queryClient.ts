import { QueryClient, QueryFunction } from "@tanstack/react-query";

const BASE_PATH = import.meta.env.BASE_URL || "/";

const STATIC_DATA_MAP: Record<string, string> = {
  "/api/products": `${BASE_PATH}data/products.json`,
  "/api/categories": `${BASE_PATH}data/categories.json`,
};

function fixImagePaths(data: any): any {
  if (BASE_PATH === "/") return data;
  const prefix = BASE_PATH.replace(/\/$/, "");
  const fixUrl = (url: string | null) => {
    if (!url || url.startsWith("http") || url.startsWith(prefix)) return url;
    if (url.startsWith("/")) return `${prefix}${url}`;
    return url;
  };
  if (Array.isArray(data)) {
    return data.map((item: any) => fixImagePaths(item));
  }
  if (data && typeof data === "object") {
    const result = { ...data };
    if (result.imageUrl) result.imageUrl = fixUrl(result.imageUrl);
    if (result.images && Array.isArray(result.images)) {
      result.images = result.images.map((img: string) => fixUrl(img) || img);
    }
    return result;
  }
  return data;
}

async function fetchWithStaticFallback(url: string, options?: RequestInit): Promise<Response> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type") || "";
    if (res.ok && contentType.includes("application/json")) return res;
    throw new Error(`${res.status}`);
  } catch {
    const staticPath = STATIC_DATA_MAP[url];
    if (staticPath) {
      const staticRes = await fetch(staticPath);
      if (staticRes.ok) {
        const data = await staticRes.json();
        return new Response(JSON.stringify(fixImagePaths(data)), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
    if (url.startsWith("/api/products/") && !url.includes("/content") && !url.includes("/variants") && !url.includes("/search")) {
      const productId = url.replace("/api/products/", "");
      const staticRes = await fetch(`${BASE_PATH}data/products.json`);
      if (staticRes.ok) {
        const products = await staticRes.json();
        const product = products.find((p: any) => p.id === productId);
        if (product) {
          return new Response(JSON.stringify(fixImagePaths(product)), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
    }
    if (url.startsWith("/api/categories/")) {
      const categoryId = url.replace("/api/categories/", "");
      const staticRes = await fetch(`${BASE_PATH}data/categories.json`);
      if (staticRes.ok) {
        const categories = await staticRes.json();
        const category = categories.find((c: any) => c.id === categoryId);
        if (category) {
          return new Response(JSON.stringify(fixImagePaths(category)), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
    }
    throw new Error(`Failed to fetch: ${url}`);
  }
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;

    try {
      const res = await fetchWithStaticFallback(url, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch {
      if (unauthorizedBehavior === "returnNull") return null;
      throw new Error(`Failed to fetch: ${url}`);
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
