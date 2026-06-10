export const getCsrfToken = async (): Promise<string | null> => {
  try {
    const res = await fetch("http://localhost:8000/sanctum/csrf-cookie", {
      credentials: "include",
    });
    if (!res.ok) {
      console.error(`Failed to fetch CSRF cookie: ${res.status}`);
      return null;
    }
    const xsrfCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="));

    if (!xsrfCookie) {
      console.error("XSRF-TOKEN cookie not found");
      return null;
    }

    const token = decodeURIComponent(xsrfCookie.split("=")[1]);
    return token;
  } catch (e) {
    console.error("CSRF request failed");
    return null;
  }
};
