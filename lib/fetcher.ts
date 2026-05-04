export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  let res = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (res.status === 401) {
    const refresh = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refresh.ok) {
      res = await fetch(input, {
        ...init,
        credentials: "include",
      });
    } else {
      window.location.href = "/login";
    }
  }

  return res;
}