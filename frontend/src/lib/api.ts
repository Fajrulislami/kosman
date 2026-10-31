// frontend/src/lib/api.ts

export class ApiError extends Error {
  status: number;
  details?: Record<string, string[] | string> | any;
  code?: string;

  constructor(message: string, status: number, details?: any, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.code = code;
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let roleContext: string | null = null;

  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;

    // Prioritaskan header konteks berdasarkan endpoint API atau konteks halaman aktif
    if (endpoint.startsWith("/api/admin") || currentPath.startsWith("/admin")) {
      roleContext = "admin";
    } else if (endpoint.startsWith("/api/portal") || currentPath.startsWith("/portal")) {
      roleContext = "tenant";
    }
  }

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (roleContext) {
    headers.set("x-role", roleContext);
  }

  // Token sesi kini dilindungi penuh oleh browser via httpOnly Cookie (credentials: "include"),
  // sehingga terbebas dari celah pencurian token skrip XSS di localStorage.
  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Tangani otomatis jika sesi kedaluwarsa atau belum login (401 Unauthorized)
    if (response.status === 401 && typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/login")) {
        // Hapus httpOnly cookie di server & bersihkan residu sesi
        try {
          fetch(`/api/auth/logout?role=${roleContext || ""}`, {
            method: "POST",
            credentials: "include",
          }).catch(() => {});
        } catch {
          // ignore
        }

        // Hapus residu token lama di localStorage jika masih tersimpan dari versi sebelumnya
        localStorage.removeItem("kostara_admin_token");
        localStorage.removeItem("kostara_tenant_token");
        localStorage.removeItem("kostara_token");

        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    const errorMessage = data.error || data.message || "Terjadi kesalahan saat memuat data";
    throw new ApiError(errorMessage, response.status, data.details, data.code);
  }

  return data;
}
