export default async function handleResponse(resp) {
    if (!resp.ok) {
      const errorResp = await resp.json();
      console.error(errorResp)
      const message = errorResp.detail || "Unexpected error";
      throw new Error(message);
    }
    return await resp.json();
  }
  