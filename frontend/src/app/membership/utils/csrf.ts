const CSRF_TOKEN_KEY = "csrf-token";

const isBrowser = typeof window !== "undefined";

export const csrfUtils = {
  getToken: () => {
    if (!isBrowser) {
      return ""; // Return empty string during SSR
    }

    // Only run this code on the client side
    if (!document.cookie.includes(CSRF_TOKEN_KEY)) {
      const token = Math.random().toString(36).substring(2);
      document.cookie = `${CSRF_TOKEN_KEY}=${token}; path=/; SameSite=Strict`;
    }
    const match = document.cookie.match(
      new RegExp(`${CSRF_TOKEN_KEY}=([^;]+)`)
    );
    return match ? match[1] : "";
  },

  setToken: (token: string) => {
    if (isBrowser) {
      document.cookie = `${CSRF_TOKEN_KEY}=${token}; path=/; SameSite=Strict`;
    }
  },

  validateToken: (token: string) => {
    if (!isBrowser) {
      return true; // Skip validation during SSR
    }
    return token === csrfUtils.getToken();
  },
};
