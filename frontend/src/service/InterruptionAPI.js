import toast from "react-hot-toast";

const dateYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const CurrentPeriod = currentMonth <= 6 ? 1 : 2;
const InterruptionURL = `http://127.0.0.1:8000/interruption_data/interruptions/?year=${dateYear}`;

export function getToken() {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Token not found");
    }
    return token;
  } catch (error) {
    toast.error("Session expired. Please log in again.");
  }
}
export async function expressInterruptionData(express, year = dateYear) {
  const token = getToken();
  if (token)
    try {
      const resp = await fetch(InterruptionURL, {
        method: "GET",
        headers: {
          authorization: `bearer ${token}`,
          "Content-Type": "Application/json",
        },
      });
      if (!resp.ok) throw new Error("un able to fetch");
      const data = await resp.json();
      return data;
    } catch (error) {
      throw error;
    }
}

export async function interruptionDataSummary(
  year = dateYear,
  period = CurrentPeriod
) {
  const InterruptionSummaryURL = `http://127.0.0.1:8000/interruption_data/interruption_summary/monthly_summary_of_year/?year=${year}&period=${period}`;
  const token = getToken();
  if (token)
    try {
      const resp = await fetch(InterruptionSummaryURL, {
        method: "GET",
        headers: {
          authorization: `bearer ${token}`,
          "Content-Type": "Application/json",
        },
      });
      if (!resp.ok) throw new Error("unable to fetch");
      const data = await resp.json();
      return data;
    } catch (error) {
      throw error;
    }
  else console.log("no token");
}
