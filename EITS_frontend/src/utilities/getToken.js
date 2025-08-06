export function getToken() {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Token not found");
    return token;
  }
  