import { create } from "zustand";

const useStore=create((set)=>({
    totalUser:0,
    setTotalUser:(totaluser)=>set({totalUser:totaluser})
}))
export default useStore;