import { createContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [queryLogs, setQueryLogs] = useState([]);
  const handleQueryLogs = (logs) => {
    setQueryLogs((prev) => {
      if (prev.length > 30) {
        return [...prev.slice(prev.length - 30, prev.length), logs];
      } else {
        return [...prev, logs];
      }
    });
  };
  return (
    <AppContext.Provider value={{ queryLogs, handleQueryLogs }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
