import { useEffect, useState } from "react";

export default function usePost() {

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const postData = async (url, values, method) => {
    const token = localStorage.getItem("accessToken");
    let isErrorSet = false;
    setLoading(true);
    setError(null);
    try {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        ...(values !== null && { body: JSON.stringify(values) }),
      };
      const resp = await fetch(url, options);
      if (!resp.ok) {
        const response = await resp.json();
        setError(response);
        isErrorSet = true;
        throw new Error(resp.status);
      }

      const tempData = await resp.json();
      setData(tempData);
      return tempData;
    } catch (error) {
      if (!isErrorSet) setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const setPost = (newUrl, newValue = null, newMethod = "POST") => {
    return postData(newUrl, newValue, newMethod);
  };

  return { error, data, loading, setPost };
}
