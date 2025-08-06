import { useState } from "react";

export default function useDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const deleteData = async (url) => {
    let isErrorSet = false;
    const token=localStorage.getItem('accessToken')
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
      });

      if (!resp.ok) {
        const response = await resp.json();
        setError(response);
        isErrorSet = true;
        throw new Error(resp.status);
      }
      
      setData({detail : "successfully deleted"});
      return {detail : "successfully deleted"};

    } catch (error) {
      if (!isErrorSet) setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const setDelete = (url) => {
    return deleteData(url);
  };


  return { loading, error, data, setDelete };
}

