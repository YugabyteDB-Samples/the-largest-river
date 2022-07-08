import { createContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [queryLogs, setQueryLogs] = useState([]);
  //default path is /api, other paths include /api-asia, /api-europe, etc
  const [trafficLocations, setTrafficLocations] = useState([
    { id: "api", label: "United States", coords: [34.0499998, -118.249999] },
    { id: "api-asia", label: "Asia", coords: [35.652832, 139.839478] },
  ]);
  const [trafficLocation, setTrafficLocation] = useState("api");
  const [currentDatabase, setCurrentDatabase] = useState(1);
  const handleQueryLogs = (logs, explainAnalyzeResults) => {
    const logResult = {
      logs,
      explainAnalyzeResults,
    };
    setQueryLogs((prev) => {
      if (prev.length > 30) {
        return [...prev.slice(prev.length - 30, prev.length), logResult];
      } else {
        return [...prev, logResult];
      }
    });
  };
  return (
    <AppContext.Provider
      value={{
        queryLogs,
        handleQueryLogs,
        trafficLocation,
        setTrafficLocation,
        trafficLocations,
        setTrafficLocations,
        currentDatabase,
        setCurrentDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
