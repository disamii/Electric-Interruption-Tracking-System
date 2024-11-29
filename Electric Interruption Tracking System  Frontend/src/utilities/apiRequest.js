import { getToken } from "./getToken";
import  handleResponse from "../service/handleResponse";

export async function apiRequest(url, method, body = null) {
    const token = getToken();
  
    const options = {
      method,
      headers: {
        Authorization: `JWT ${token}`,
        "Content-Type": "application/json",
      },
    };
  
    if (body) {
      options.body = JSON.stringify(body);
    }
  
    try {
      const resp = await fetch(url, options);
      const data = await handleResponse(resp);
      return data;
    } catch (error) {
      throw error;
    }
  }