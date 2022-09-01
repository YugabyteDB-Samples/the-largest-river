import { createContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import getJSON from "../services/rest";

const AppContext = createContext();

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [queryLogs, setQueryLogs] = useState([]);
  //default path is /api, other paths include /api-asia, /api-europe, etc
  const [trafficLocations, setTrafficLocations] = useState([]);
  const [trafficLocation, setTrafficLocation] = useState(
    localStorage.hasOwnProperty("trafficLocation")
      ? localStorage.getItem("trafficLocation")
      : "api"
  );
  const [currentDatabase, setCurrentDatabase] = useState(
    localStorage.hasOwnProperty("currentDatabase")
      ? localStorage.getItem("currentDatabase")
      : "single_region"
  );

  const getDatabases = async () => {
    try {
      const db = await getJSON("/api/databases");
      setDatabases(db.databases);
      return Promise.resolve();
    } catch (e) {
      console.log("error in fetching current database", e);
    }
  };

  const getTrafficLocations = async () => {
    try {
      const json = await getJSON(`/${trafficLocation}/trafficLocations`);
      const data = json.data;
      setTrafficLocations(data);
      return Promise.resolve();
    } catch (e) {
      console.log("error in fetching /trafficLocations", e);
    }
  };

  const initialize = async () => {
    console.log("Initializing traffic locations and databases");
    await Promise.all([getTrafficLocations(), getDatabases()]);
    setLoading(false);
  };
  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    getNodesForDB();

    // Navigate to products view on Traffic Location or Database change
    // if not on landing page or initial page load
    if (location?.pathname != "/" && loading != true)
      navigate("/store/products", { replace: true });
  }, [trafficLocation, currentDatabase]);

  const getNodesForDB = async () => {
    try {
      const resp = await getJSON(
        `/${trafficLocation}/databases/${currentDatabase}/nodes`
      );
      const nodes = resp.nodes;
      const connectedNodeIdx = resp.connection_node_index;
      const isReplicaNode =
        resp.nodes[resp.connection_node_index].type === "replica";
      setDatabaseNodes({
        nodes,
        connectedNodeIndex: connectedNodeIdx,
        isReplicaNode,
      });
    } catch (e) {
      console.log("error in fetching database nodes", e);
    }
  };

  const handleQueryLogs = (logs, explainAnalyzeResults, latency) => {
    const logResult = {
      logs,
      explainAnalyzeResults,
      latency,
    };
    setQueryLogs((prev) => {
      if (prev.length > 30) {
        return [...prev.slice(prev.length - 30, prev.length), logResult];
      } else {
        return [...prev, logResult];
      }
    });
  };
  const [productsInCart, setProductsInCart] = useState([]);
  const [showExecutionPlan, setShowExecutionPlan] = useState(true);
  const [databases, setDatabases] = useState([]);
  const [databaseNodes, setDatabaseNodes] = useState({});
  return (
    <AppContext.Provider
      value={{
        databases,
        setDatabases,
        databaseNodes,
        setDatabaseNodes,
        handleQueryLogs,
        queryLogs,
        loading,
        trafficLocation,
        setTrafficLocation,
        trafficLocations,
        setTrafficLocations,
        currentDatabase,
        setCurrentDatabase,
        productsInCart,
        setProductsInCart,
        showExecutionPlan,
        setShowExecutionPlan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
