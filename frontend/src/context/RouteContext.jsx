import React, { useState, createContext, useContext, useEffect } from "react";
import useFetch from "../customHook/useFetch";
import { useAuth } from "./AuthContext";
const routeSelectContext = createContext();
export const useSelectHandler = () => useContext(routeSelectContext);

const MessageQuery = `http://127.0.0.1:8000/messages/chat/get_my_chat/`;

export default function RouteContextProvider({ children }) {
  const { error, data, loading, setfetch } = useFetch(MessageQuery);
  const { username } = useAuth();

  const [selected, setSelected] = useState("Dashboard");
  const [notification, setNofication] = useState(0);
  const onSelectHandler = (item) => {
    setSelected(item);
  };
  const onNotifyHandler = (item) => {
    setNofication(item);
  };
  useEffect(() => {
    if (data) {
      let arrayMessage = data ? data : [];

      setNofication(() => {
        return arrayMessage.reduce((msgAcc, msg) => {
          if (!msg.seen && msg.receiver === username) msgAcc++;
          return msgAcc;
        }, 0);
      });
    }
  }, [data]);

  return (
    <routeSelectContext.Provider
      value={{ selected, onSelectHandler, onNotifyHandler, notification }}
    >
      {children}
    </routeSelectContext.Provider>
  );
}

export const useRoute = () => useContext(routeSelectContext);
