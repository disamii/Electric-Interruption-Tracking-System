import { getToken } from "./InterruptionAPI";
import toast from "react-hot-toast";
import LoginNavigation from "../component/LoginNavigate";


export async function getUser(username) {
  let USERURL = `http://127.0.0.1:8000/accounts/user/${username}`;

  const token = getToken();
  if (token)
    try {
      const profileResp = await fetch(USERURL, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!profileResp.ok) {
        const errorResp = await profileResp.json();
        throw new Error("unable to fetch  user profile");
      }
      const profileData = await profileResp.json();
      return profileData;
    } catch (error) {
      throw error;
    }
  else {
    toast.error("session expired login again please");
    LoginNavigation();
    throw new Error("token not found login please");
  }
}



export async function userFetch(username = undefined) {
  let USERURL = `http://127.0.0.1:8000/accounts/user/`;

  if (username !== undefined) {
    USERURL += `${username}/`;
  }

  const token = getToken();
  if (token)
    try {
      const profileResp = await fetch(USERURL, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!profileResp.ok) {
        const errorResp = await profileResp.json();
        throw new Error("unable to fetch  user profile");
      }
      const profileData = await profileResp.json();
      return profileData;
    } catch (error) {
      throw error;
    }
  else {
    toast.error("session expired login again please");
    LoginNavigation();
    throw new Error("token not found login please");
  }
}

export async function suspendUser(username) {
  let USERURL = `http://127.0.0.1:8000/accounts/user/${username}/suspend/`;

  const token = getToken();
  if (token)
    try {
      const profileResp = await fetch(USERURL, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!profileResp.ok) {
        const errorResp = await profileResp.json();
        throw new Error("unable to fetch  user profile");
      }
      const profileData = await profileResp.json();
      return profileData;
    } catch (error) {
      throw error;
    }
  else {
    toast.error("session expired login again please");
    throw new Error("token not found login please");
  }
}

export async function deleteUser(username) {
  let USERURL = ` http://127.0.0.1:8000/accounts/user/${username}/`;
  const token = getToken();
  if (token)
    try {
      const profileResp = await fetch(USERURL, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!profileResp.ok) {
        const errorResp = await profileResp.json();
        throw new Error("unable to fetch  user profile");
      }
      if (profileResp.status === 204) return;

    } catch (error) {
      console.error(error);
      throw error;
    }
  else {
    toast.error("session expired login again please");
    LoginNavigation();
    throw new Error("token not found login please");
  }
}

export async function resetPasswordUser(username) {
  let USERURL = ` http://127.0.0.1:8000/accounts/change_password/${username}/reset_password/`;
  const token = getToken();
  if (token)
    try {
      const profileResp = await fetch(USERURL, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!profileResp.ok) {
        const errorResp = await profileResp.json();
        throw new Error("unable to fetch  user profile");
      }
      const profileData = await profileResp.json();
      return profileData;
    } catch (error) {
      throw error;
    }
  else {
    toast.error("session expired login again please");
    LoginNavigation();
    throw new Error("token not found login please");
  }
}

export async function updateUser(data) {
  const username = data.username;
  console.log(data);
  let USERURL = ` http://127.0.0.1:8000/accounts/user/${username}/`;

  const token = getToken();
  if (token)
    try {
      const profileResp = await fetch(USERURL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!profileResp.ok) {
        const errorResp = await profileResp.json();
        console.log(errorResp);
        throw new Error("unable to update user profile");
      }
      const profileData = await profileResp.json();
      return profileData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  else {
    toast.error("session expired login again please");
    LoginNavigation();
    throw new Error("token not found login please");
  }
}

export async function createUser(data) {
  let USERURL = ` http://127.0.0.1:8000/accounts/user/`;
  const token = getToken();
  if (token)
    try {
      const profileResp = await fetch(USERURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!profileResp.ok) {
        const errorResp = await profileResp.json();
        throw new Error("unable to fetch  user profile");
      }
      const profileData = await profileResp.json();
      return profileData;
    } catch (error) {
      throw error;
    }
  else {
    toast.error("session expired login again please");
    LoginNavigation();
    throw new Error("session expired login again please");
  }
}
