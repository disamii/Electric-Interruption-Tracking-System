import handleResponse from "../service/handleResponse"
const LOGINURL = "http://127.0.0.1:8000/auth/jwt/create/";

export async function userLogginApi(credential) {
  try {
    const resp = await fetch(LOGINURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credential),
    });
    const data = await handleResponse(resp);
    localStorage.setItem("accessToken", data.access);
    return data;
  } catch (error) {
    throw error;
  }
}


