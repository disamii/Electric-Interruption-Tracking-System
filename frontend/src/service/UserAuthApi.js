import { getToken } from "./InterruptionAPI";

const LOGINURL = "http://127.0.0.1:8000/api/token/";

export async function userLogginApi(credential) {
  try {
    const resp = await fetch(LOGINURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credential),
    });

    if (!resp.ok) {
      if (resp.status===401) throw new Error("Invalid credentials");
      else throw new Error("un expected error");
    }
    const data = await resp.json();
    localStorage.setItem("accessToken", data.access);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function profilefetch() {
  const token=getToken()
  if (token)
    try {
      const profileResp = await fetch(
        "http://127.0.0.1:8000/accounts/user/me/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!profileResp.ok) {
        const errorResp = await profileResp.json();
        console.error(errorResp);
        throw new Error("unable to fetch  user profile");
      }
      const profileData = await profileResp.json();
      return profileData;
    } catch (error) {
      console.error(
        "An unexpected error occurred while fetching user profile",
        error
      );
      return error;
    }
    else
    {
      throw new Error('token not found login please')
    }
}
