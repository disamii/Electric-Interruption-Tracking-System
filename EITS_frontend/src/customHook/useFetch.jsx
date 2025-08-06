import { useEffect, useState } from "react";

export default function useFetch(URL) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [url, setUrl] = useState(URL);

  const fetchData = async () => {
    const token=localStorage.getItem('accessToken')
    let iserrorsetted = false;
    setLoading(true);
    try {
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,

        },
      });

      if (!resp.ok) {
        const response = await resp.json();
        setError(response);
        iserrorsetted = true;
        throw new Error(resp.statusText);
      }

      const data = await resp.json();
      setData(data);
    } catch (error) {
      if (!iserrorsetted) setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) fetchData(); 
    return () => {
      setData(null);
      setError(null);
      setLoading(false);
    };
  }, [url]);

  useEffect(() => {
    setUrl(URL);
  }, [URL]);

  const setfetch = (newUrl) => {
    if (newUrl !== url) setUrl(newUrl);
    else fetchData();
  };

  return { loading, error, data, setfetch,fetchData};
}
